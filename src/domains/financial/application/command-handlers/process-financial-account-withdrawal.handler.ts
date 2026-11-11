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
// Application — Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS } from '../financial-account-withdrawal.tokens';

// -----------------------------------------------------------------------------
// Foundation — Command Handler
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { ProcessFinancialAccountWithdrawalCommand } from '../commands/process-financial-account-withdrawal.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { FinancialAccountWithdrawalAggregate } from '../../domain/aggregates/financial-account-withdrawal.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { FinancialAccountWithdrawalRepository } from '../../domain/repositories/financial-account-withdrawal.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { FinancialAccountWithdrawalNotFoundException } from '../../domain/exceptions';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class ProcessFinancialAccountWithdrawalHandler implements CommandHandler<
  ProcessFinancialAccountWithdrawalCommand,
  FinancialAccountWithdrawalAggregate
> {
  private readonly logger = new Logger(
    ProcessFinancialAccountWithdrawalHandler.name,
  );

  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS.REPOSITORY)
    private readonly withdrawalRepository: FinancialAccountWithdrawalRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: UnitOfWork,

    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    command: ProcessFinancialAccountWithdrawalCommand,
  ): Promise<FinancialAccountWithdrawalAggregate> {
    const result = await this.unitOfWork.execute(async () => {
      // -----------------------------------------------------------------------
      // 1. Resolve Financial Account Withdrawal
      // -----------------------------------------------------------------------

      const aggregate = await this.withdrawalRepository.findByPublicId(
        command.withdrawalId,
      );

      if (aggregate === null) {
        throw new FinancialAccountWithdrawalNotFoundException(
          command.withdrawalId.value,
        );
      }

      // -----------------------------------------------------------------------
      // 2. Idempotency — Check Current Lifecycle State
      // -----------------------------------------------------------------------

      if (!aggregate.isPending) {
        return {
          aggregate,
          transitioned: false,
        };
      }

      // -----------------------------------------------------------------------
      // 3. Process Withdrawal
      // -----------------------------------------------------------------------

      aggregate.process(command.correlationId, command.causationId);

      // -----------------------------------------------------------------------
      // 4. Conditionally Persist PENDING → PROCESSING
      // -----------------------------------------------------------------------
      //
      // Only one concurrent request can successfully update a withdrawal
      // whose persisted status is still PENDING.
      //
      // A false result means another operation changed its lifecycle state
      // before this request could persist its transition.
      // -----------------------------------------------------------------------

      const saved = await this.withdrawalRepository.saveIfPending(aggregate);

      if (!saved) {
        // ---------------------------------------------------------------------
        // 4.1 Reload the Latest Persisted Aggregate
        // ---------------------------------------------------------------------

        const latestAggregate = await this.withdrawalRepository.findByPublicId(
          command.withdrawalId,
        );

        if (latestAggregate === null) {
          throw new FinancialAccountWithdrawalNotFoundException(
            command.withdrawalId.value,
          );
        }

        // ---------------------------------------------------------------------
        // 4.2 Return Without Publishing Losing Domain Events
        // ---------------------------------------------------------------------

        return {
          aggregate: latestAggregate,
          transitioned: false,
        };
      }

      // -----------------------------------------------------------------------
      // 5. Persist Domain Events into Transactional Outbox
      // -----------------------------------------------------------------------

      const domainEvents = aggregate.pullDomainEvents();

      if (domainEvents.length > 0) {
        await this.eventPublisher.publishAll(domainEvents);
      }

      return {
        aggregate,
        transitioned: true,
      };
    });

    // -------------------------------------------------------------------------
    // 6. Log After Successful Transaction Completion
    // -------------------------------------------------------------------------

    if (result.transitioned) {
      this.logger.log(
        `Financial Account Withdrawal entered PROCESSING: ${result.aggregate.publicId.value}`,
      );
    }

    // -------------------------------------------------------------------------
    // 7. Return Updated Aggregate
    // -------------------------------------------------------------------------

    return result.aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ProcessFinancialAccountWithdrawalHandler;
