import { Inject, Injectable } from '@nestjs/common';

import { UNIT_OF_WORK } from '../../../../foundation/persistence/unit-of-work.token';
import type { UnitOfWork } from '../../../../foundation/persistence/unit-of-work.interface';

import { EVENT_PUBLISHER } from '../../../../foundation/events/event-publisher.token';
import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import { FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS } from '../financial-account-withdrawal.tokens';
import { FINANCIAL_ACCOUNT_TOKENS } from '../financial-account.tokens';

import type { RequestFinancialAccountWithdrawalCommand } from '../commands/request-financial-account-withdrawal.command';

import { FinancialAccountWithdrawalAggregate } from '../../domain/aggregates/financial-account-withdrawal.aggregate';
import { FinancialAccountWithdrawalEntity } from '../../domain/entities/financial-account-withdrawal.entity';

import type { FinancialAccountWithdrawalRepository } from '../../domain/repositories/financial-account-withdrawal.repository';
import type { FinancialAccountRepository } from '../../domain/repositories/financial-account.repository';

import {
  FinancialAccountConcurrencyException,
  FinancialAccountNotFoundException,
} from '../../domain/exceptions';

import { FinancialAccountWithdrawalException } from '../../domain/exceptions/financial-account-withdrawal.exception';
import { FinancialAccountWithdrawalIdempotencyConflictException } from '../../domain/exceptions/financial-account-withdrawal-idempotency-conflict.exception';

@Injectable()
export class RequestFinancialAccountWithdrawalHandler implements CommandHandler<
  RequestFinancialAccountWithdrawalCommand,
  FinancialAccountWithdrawalAggregate
> {
  public constructor(
    @Inject(FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS.REPOSITORY)
    private readonly withdrawalRepository: FinancialAccountWithdrawalRepository,

    @Inject(FINANCIAL_ACCOUNT_TOKENS.REPOSITORY)
    private readonly accountRepository: FinancialAccountRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: UnitOfWork,

    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  public async execute(
    command: RequestFinancialAccountWithdrawalCommand,
  ): Promise<FinancialAccountWithdrawalAggregate> {
    const idempotencyKey = command.idempotencyKey?.trim();

    if (!idempotencyKey || idempotencyKey.length > 128) {
      throw new FinancialAccountWithdrawalException(
        'A valid idempotency key is required for a withdrawal request.',
      );
    }

    try {
      return await this.unitOfWork.execute(async () => {
        // ---------------------------------------------------------------------
        // 1. Check for an existing request using its account and idempotency key.
        // ---------------------------------------------------------------------

        const existing =
          await this.withdrawalRepository.findByAccountPublicIdAndIdempotencyKey(
            command.accountId,
            idempotencyKey,
          );

        if (existing !== null) {
          this.ensureSameRequest(existing, command);
          return existing;
        }

        // ---------------------------------------------------------------------
        // 2. Load and validate the source Financial Account.
        // ---------------------------------------------------------------------

        const account = await this.accountRepository.findByPublicId(
          command.accountId,
        );

        if (account === null) {
          throw new FinancialAccountNotFoundException(command.accountId.value);
        }

        account.ensureOperational();
        account.ensureCurrency(command.amount.currency);

        // ---------------------------------------------------------------------
        // 3. Create the withdrawal entity and aggregate.
        // ---------------------------------------------------------------------

        const requestedAt = new Date();

        const entity = FinancialAccountWithdrawalEntity.create(
          account.id,
          account.publicId,
          command.amount,
          command.destination,
          command.referenceType,
          command.referencePublicId,
          requestedAt,
          idempotencyKey,
        );

        const withdrawal = FinancialAccountWithdrawalAggregate.create(entity);

        withdrawal.recordRequested(command.correlationId, command.causationId);

        // ---------------------------------------------------------------------
        // 4. Persist the withdrawal request.
        // ---------------------------------------------------------------------
        //
        // This stage only records the request.
        //
        // It does NOT:
        // - deduct availableAmount;
        // - modify pendingAmount or heldAmount;
        // - create a Financial Account Hold;
        // - create a Financial Transaction;
        // - create a Financial Disbursement;
        // - submit an external payment.
        //
        // The customer's Financial Account balance remains unchanged.
        // ---------------------------------------------------------------------

        await this.withdrawalRepository.save(withdrawal);

        // ---------------------------------------------------------------------
        // 5. Publish domain events through the transactional event publisher.
        // ---------------------------------------------------------------------
        //
        // EVENT_PUBLISHER uses the transactional outbox within the ambient
        // UNIT_OF_WORK transaction.
        //
        // The withdrawal and its requested event therefore commit or roll
        // back together.
        // ---------------------------------------------------------------------

        const events = withdrawal.pullDomainEvents();

        if (events.length > 0) {
          await this.eventPublisher.publishAll(events);
        }

        return withdrawal;
      });
    } catch (error: unknown) {
      // -----------------------------------------------------------------------
      // 6. Recover concurrent idempotent request creation.
      // -----------------------------------------------------------------------
      //
      // A concurrent request may win the unique idempotency constraint.
      // Reload the committed request and return it only if its payload matches.
      // -----------------------------------------------------------------------

      if (!this.isRecoverableConcurrencyError(error)) {
        throw error;
      }

      const existing =
        await this.withdrawalRepository.findByAccountPublicIdAndIdempotencyKey(
          command.accountId,
          idempotencyKey,
        );

      if (existing === null) {
        throw error;
      }

      this.ensureSameRequest(existing, command);

      return existing;
    }
  }

  // ===========================================================================
  // Concurrency Recovery
  // ===========================================================================

  private isRecoverableConcurrencyError(error: unknown): boolean {
    return (
      error instanceof FinancialAccountConcurrencyException ||
      error instanceof FinancialAccountWithdrawalIdempotencyConflictException
    );
  }

  // ===========================================================================
  // Idempotency Validation
  // ===========================================================================

  private ensureSameRequest(
    existing: FinancialAccountWithdrawalAggregate,
    command: RequestFinancialAccountWithdrawalCommand,
  ): void {
    const sameRequest =
      existing.accountPublicId.value === command.accountId.value &&
      existing.amountValue === command.amount.amount &&
      existing.currency === command.amount.currency.value &&
      existing.destinationType === command.destination.type &&
      existing.destinationValue === command.destination.value &&
      existing.referenceType?.value === command.referenceType?.value &&
      existing.referencePublicId?.value === command.referencePublicId?.value;

    if (!sameRequest) {
      throw new FinancialAccountWithdrawalException(
        'This idempotency key has already been used for a different withdrawal request.',
      );
    }
  }
}

export default RequestFinancialAccountWithdrawalHandler;
