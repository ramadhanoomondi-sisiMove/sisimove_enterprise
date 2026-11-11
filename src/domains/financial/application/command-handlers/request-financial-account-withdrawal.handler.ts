import { Inject, Injectable } from '@nestjs/common';

import { UNIT_OF_WORK } from '../../../../foundation/persistence/unit-of-work.token';
import type { UnitOfWork } from '../../../../foundation/persistence/unit-of-work.interface';

import { EVENT_PUBLISHER } from '../../../../foundation/events/event-publisher.token';
import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import { FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS } from '../financial-account-withdrawal.tokens';
import { FINANCIAL_ACCOUNT_TOKENS } from '../financial-account.tokens';
import { FINANCIAL_ACCOUNT_HOLD_TOKENS } from '../financial-account-hold.tokens';
import { FINANCIAL_TRANSACTION_TOKENS } from '../financial-transaction.tokens';

import type { RequestFinancialAccountWithdrawalCommand } from '../commands/request-financial-account-withdrawal.command';

import { FinancialAccountWithdrawalAggregate } from '../../domain/aggregates/financial-account-withdrawal.aggregate';
import { FinancialAccountWithdrawalEntity } from '../../domain/entities/financial-account-withdrawal.entity';

import { FinancialAccountHoldAggregate } from '../../domain/aggregates/financial-account-hold.aggregate';
import { FinancialAccountHoldEntity } from '../../domain/entities/financial-account-hold.entity';

import { FinancialTransactionAggregate } from '../../domain/aggregates/financial-transaction.aggregate';

import type { FinancialAccountWithdrawalRepository } from '../../domain/repositories/financial-account-withdrawal.repository';
import type { FinancialAccountRepository } from '../../domain/repositories/financial-account.repository';
import type { FinancialAccountHoldRepository } from '../../domain/repositories/financial-account-hold.repository';
import type { FinancialTransactionRepository } from '../../domain/repositories/financial-transaction.repository';

import {
  FinancialAccountConcurrencyException,
  FinancialAccountNotFoundException,
} from '../../domain/exceptions';

import { FinancialAccountWithdrawalException } from '../../domain/exceptions/financial-account-withdrawal.exception';
import { FinancialAccountWithdrawalIdempotencyConflictException } from '../../domain/exceptions/financial-account-withdrawal-idempotency-conflict.exception';

import { FinancialAccountReference } from '../../domain/value-objects/financial-account-reference.vo';
import { FinancialAccountHeldAmount } from '../../domain/value-objects/financial-account-held-amount.vo';
import { FinancialHoldReference } from '../../domain/value-objects/financial-hold-reference.vo';

import { FinancialTransactionReference } from '../../domain/value-objects/financial-transaction-reference.vo';
import { FinancialTransactionType } from '../../domain/value-objects/financial-transaction-type.vo';
import { FinancialTransactionEntryType } from '../../domain/value-objects/financial-transaction-entry-type.vo';
import { FinancialBalanceType } from '../../domain/value-objects/financial-balance-type.vo';

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

    @Inject(FINANCIAL_ACCOUNT_HOLD_TOKENS.REPOSITORY)
    private readonly holdRepository: FinancialAccountHoldRepository,

    @Inject(FINANCIAL_TRANSACTION_TOKENS.REPOSITORY)
    private readonly transactionRepository: FinancialTransactionRepository,

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
        // 1. Check for an existing withdrawal request.
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

        const requestedAt = new Date();

        // ---------------------------------------------------------------------
        // 3. Create the withdrawal aggregate.
        // ---------------------------------------------------------------------

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
        // 4. Reserve the withdrawal amount.
        //
        // AVAILABLE decreases.
        // HELD increases.
        // ---------------------------------------------------------------------

        account.holdFunds(
          command.amount.amount,
          command.amount.currency,
          requestedAt,
        );

        // ---------------------------------------------------------------------
        // 5. Build the Financial Account reference.
        // ---------------------------------------------------------------------

        const accountReference = FinancialAccountReference.create(
          'FINANCIAL_ACCOUNT',
          account.publicId.value,
        );

        // ---------------------------------------------------------------------
        // 6. Create a stable HOLD transaction reference.
        //
        // The operation-specific reference type allows this withdrawal to
        // have separate HOLD, RELEASE and CAPTURE transactions.
        // ---------------------------------------------------------------------

        const transactionReference = FinancialTransactionReference.create(
          'FINANCIAL_ACCOUNT_WITHDRAWAL_HOLD',
          withdrawal.publicId.value,
        );

        // ---------------------------------------------------------------------
        // 7. Create the HOLD Financial Transaction.
        // ---------------------------------------------------------------------

        const transaction = FinancialTransactionAggregate.create(
          {
            type: FinancialTransactionType.create('HOLD'),
            amount: command.amount,
            reference: transactionReference,
          },
          command.correlationId,
          requestedAt,
        );

        // AVAILABLE -> DEBIT
        transaction.addEntry(
          {
            account: accountReference,
            type: FinancialTransactionEntryType.create('DEBIT'),
            balanceType: FinancialBalanceType.create('AVAILABLE'),
            amount: command.amount,
          },
          requestedAt,
        );

        // HELD -> CREDIT
        transaction.addEntry(
          {
            account: accountReference,
            type: FinancialTransactionEntryType.create('CREDIT'),
            balanceType: FinancialBalanceType.create('HELD'),
            amount: command.amount,
          },
          requestedAt,
        );

        transaction.complete(command.correlationId, requestedAt);

        // ---------------------------------------------------------------------
        // 8. Create the Financial Account Hold record.
        // ---------------------------------------------------------------------

        const holdAmount = FinancialAccountHeldAmount.create(
          command.amount.amount,
        );

        const holdReference = FinancialHoldReference.create(
          'FINANCIAL_ACCOUNT_WITHDRAWAL',
          withdrawal.publicId.value,
        );

        const holdEntity = FinancialAccountHoldEntity.create(
          account.id,
          account.publicId,
          holdAmount,
          command.amount.currency.toString(),
          holdReference,
        );

        const hold = FinancialAccountHoldAggregate.create(holdEntity);

        // Link the hold to its initial HOLD transaction.
        hold.setHoldTransactionPublicId(transaction.publicId.value);

        hold.recordCreated(command.correlationId, command.causationId);

        // ---------------------------------------------------------------------
        // 9. Persist all aggregates inside the same UnitOfWork.
        // ---------------------------------------------------------------------

        await this.transactionRepository.save(transaction);

        await this.holdRepository.create(hold);

        await this.accountRepository.save(account);

        await this.withdrawalRepository.save(withdrawal);

        // ---------------------------------------------------------------------
        // 10. Publish domain events inside the ambient transaction.
        // ---------------------------------------------------------------------

        const events = [
          ...withdrawal.pullDomainEvents(),
          ...transaction.pullDomainEvents(),
          ...hold.pullDomainEvents(),
          ...account.pullDomainEvents(),
        ];

        if (events.length > 0) {
          await this.eventPublisher.publishAll(events);
        }

        return withdrawal;
      });
    } catch (error: unknown) {
      // -----------------------------------------------------------------------
      // Recover concurrent idempotent requests and account version conflicts.
      // -----------------------------------------------------------------------

      if (!this.isRecoverableConcurrencyError(error)) {
        throw error;
      }

      // This lookup happens after the failed UnitOfWork has rolled back.
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
