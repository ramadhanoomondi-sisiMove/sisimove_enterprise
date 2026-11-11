// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable, Logger } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation — Unit of Work
// -----------------------------------------------------------------------------

import { UNIT_OF_WORK } from '../../../../foundation/persistence/unit-of-work.token';

import type { UnitOfWork } from '../../../../foundation/persistence/unit-of-work.interface';

// -----------------------------------------------------------------------------
// Foundation — Event Publisher
// -----------------------------------------------------------------------------

import { EVENT_PUBLISHER } from '../../../../foundation/events/event-publisher.token';

import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';

// -----------------------------------------------------------------------------
// Foundation — Command Handler
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_ACCOUNT_TOKENS } from '../financial-account.tokens';

import { FINANCIAL_DISBURSEMENT_TOKENS } from '../financial-disbursement.tokens';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { CreateFinancialDisbursementCommand } from '../commands/create-financial-disbursement.command';

// -----------------------------------------------------------------------------
// Aggregate and Entity
// -----------------------------------------------------------------------------

import { FinancialDisbursementAggregate } from '../../domain/aggregates/financial-disbursement.aggregate';

import { FinancialDisbursementEntity } from '../../domain/entities/financial-disbursement.entity';

// -----------------------------------------------------------------------------
// Repositories
// -----------------------------------------------------------------------------

import type { FinancialAccountRepository } from '../../domain/repositories/financial-account.repository';

import type { FinancialDisbursementRepository } from '../../domain/repositories/financial-disbursement.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { FinancialAccountNotFoundException } from '../../domain/exceptions';

// =============================================================================
// Helpers
// =============================================================================

/**
 * Determines whether a Prisma P2002 error specifically represents a
 * uniqueness violation involving withdrawalPublicId.
 *
 * Supports Prisma metadata where the target is represented as either
 * an array of field names or a constraint-name string.
 *
 * Unrelated unique-constraint violations must not be treated as successful
 * duplicate withdrawal-disbursement recovery.
 */
function isWithdrawalPublicIdUniqueConstraintViolation(
  error: unknown,
): boolean {
  if (
    typeof error !== 'object' ||
    error === null ||
    !('code' in error) ||
    error.code !== 'P2002'
  ) {
    return false;
  }

  if (
    !('meta' in error) ||
    typeof error.meta !== 'object' ||
    error.meta === null
  ) {
    return false;
  }

  const metadata = error.meta;

  if (!('target' in metadata)) {
    return false;
  }

  const target = metadata.target;

  const matchesWithdrawalPublicId = (value: unknown): boolean => {
    if (typeof value !== 'string') {
      return false;
    }

    const normalized = value.toLowerCase();

    return (
      normalized.includes('withdrawalpublicid') ||
      normalized.includes('withdrawal_public_id')
    );
  };

  if (typeof target === 'string') {
    return matchesWithdrawalPublicId(target);
  }

  if (Array.isArray(target)) {
    return target.some(matchesWithdrawalPublicId);
  }

  return false;
}

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class CreateFinancialDisbursementHandler implements CommandHandler<
  CreateFinancialDisbursementCommand,
  FinancialDisbursementAggregate
> {
  private readonly logger = new Logger(CreateFinancialDisbursementHandler.name);

  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(FINANCIAL_DISBURSEMENT_TOKENS.REPOSITORY)
    private readonly disbursementRepository: FinancialDisbursementRepository,

    @Inject(FINANCIAL_ACCOUNT_TOKENS.REPOSITORY)
    private readonly accountRepository: FinancialAccountRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: UnitOfWork,

    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    command: CreateFinancialDisbursementCommand,
  ): Promise<FinancialDisbursementAggregate> {
    // -------------------------------------------------------------------------
    // Execute Creation Transaction
    // -------------------------------------------------------------------------

    let result: {
      aggregate: FinancialDisbursementAggregate;
      created: boolean;
    };

    try {
      result = await this.unitOfWork.execute(async () => {
        // ---------------------------------------------------------------------
        // 1. Recover Existing Disbursement for Originating Withdrawal
        // ---------------------------------------------------------------------
        //
        // A withdrawal must not create multiple disbursements.
        //
        // This lookup handles ordinary retries. The database unique constraint
        // and recovery outside this transaction handle concurrent deliveries.
        // ---------------------------------------------------------------------

        if (command.withdrawalPublicId !== undefined) {
          const existingDisbursement =
            await this.disbursementRepository.findByWithdrawalPublicId(
              command.withdrawalPublicId,
            );

          if (existingDisbursement !== null) {
            return {
              aggregate: existingDisbursement,
              created: false,
            };
          }
        }

        // ---------------------------------------------------------------------
        // 2. Resolve Financial Account
        // ---------------------------------------------------------------------

        const account = await this.accountRepository.findByPublicId(
          command.sourceAccountPublicId,
        );

        if (account === null) {
          throw new FinancialAccountNotFoundException(
            command.sourceAccountPublicId.value,
          );
        }

        // ---------------------------------------------------------------------
        // 3. Validate Financial Account
        // ---------------------------------------------------------------------

        account.ensureOperational();

        // ---------------------------------------------------------------------
        // 4. Validate Currency
        // ---------------------------------------------------------------------

        account.ensureCurrency(command.amount.currency);

        // ---------------------------------------------------------------------
        // 5. Create Financial Disbursement Entity
        // ---------------------------------------------------------------------
        //
        // The destination is an immutable snapshot carried by the command.
        //
        // withdrawalPublicId links this disbursement to its originating
        // Financial Account Withdrawal when one exists.
        //
        // No configured destination lookup or ownership check is performed.
        // ---------------------------------------------------------------------

        const disbursementEntity = FinancialDisbursementEntity.create(
          account.id,
          account.publicId,
          command.destination,
          command.amount,
          command.referenceType,
          command.referencePublicId,
          command.withdrawalPublicId,
        );

        // ---------------------------------------------------------------------
        // 6. Create Financial Disbursement Aggregate
        // ---------------------------------------------------------------------

        const disbursementAggregate =
          FinancialDisbursementAggregate.create(disbursementEntity);

        // ---------------------------------------------------------------------
        // 7. Record Financial Disbursement Created Event
        // ---------------------------------------------------------------------

        disbursementAggregate.recordCreated(
          command.correlationId,
          command.causationId,
        );

        // ---------------------------------------------------------------------
        // 8. Persist Newly Created Financial Disbursement
        // ---------------------------------------------------------------------
        //
        // withdrawalPublicId must be protected by a database unique
        // constraint when supplied.
        // ---------------------------------------------------------------------

        await this.disbursementRepository.create(disbursementAggregate);

        // ---------------------------------------------------------------------
        // 9. Persist Domain Events into Transactional Outbox
        // ---------------------------------------------------------------------
        //
        // EventPublisher delegates event persistence to the EventStore.
        //
        // The EventStore must participate in the same ambient transaction.
        //
        // If event persistence fails, the disbursement creation is rolled back.
        // ---------------------------------------------------------------------

        const domainEvents = disbursementAggregate.pullDomainEvents();

        if (domainEvents.length > 0) {
          await this.eventPublisher.publishAll(domainEvents);
        }

        return {
          aggregate: disbursementAggregate,
          created: true,
        };
      });
    } catch (error: unknown) {
      // -----------------------------------------------------------------------
      // 10. Recover Concurrent Duplicate Withdrawal Disbursement Creation
      // -----------------------------------------------------------------------
      //
      // Only recover a P2002 violation involving withdrawalPublicId.
      //
      // The failed transaction has now rolled back. Query again outside that
      // transaction to recover the winning disbursement.
      //
      // If no matching withdrawal disbursement exists, preserve and rethrow
      // the original error.
      // -----------------------------------------------------------------------

      if (
        command.withdrawalPublicId === undefined ||
        !isWithdrawalPublicIdUniqueConstraintViolation(error)
      ) {
        throw error;
      }

      const existingDisbursement =
        await this.disbursementRepository.findByWithdrawalPublicId(
          command.withdrawalPublicId,
        );

      if (existingDisbursement === null) {
        throw error;
      }

      this.logger.warn(
        `Concurrent Financial Disbursement creation recovered for withdrawal: ${command.withdrawalPublicId}`,
      );

      return existingDisbursement;
    }

    // -------------------------------------------------------------------------
    // 11. Log After Successful Transaction Completion
    // -------------------------------------------------------------------------

    if (result.created) {
      this.logger.log(
        `Financial Disbursement created: ${result.aggregate.publicId.value}`,
      );
    } else {
      this.logger.log(
        `Existing Financial Disbursement recovered: ${result.aggregate.publicId.value}`,
      );
    }

    // -------------------------------------------------------------------------
    // 12. Return Disbursement Aggregate
    // -------------------------------------------------------------------------

    return result.aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CreateFinancialDisbursementHandler;
