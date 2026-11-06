// -----------------------------------------------------------------------------
// Financial Payment — Post Successful Payment Handler
// -----------------------------------------------------------------------------
//
// Application command handler responsible for posting a successfully confirmed
// Financial Payment into the Financial Transaction and Financial Account
// aggregates.
//
// Posting model:
//
//   SYSTEM-MPESA-CLEARING
//       DEBIT AVAILABLE
//              |
//              v
//       Receiving Account
//       CREDIT AVAILABLE
//
// Responsibilities:
//
// 1. Load and validate the succeeded Financial Payment.
// 2. Prevent duplicate transaction posting.
// 3. Load the M-PESA clearing and receiving accounts.
// 4. Debit the clearing account.
// 5. Credit the receiving account.
// 6. Create and complete a balanced Financial Transaction.
// 7. Link the transaction to the Financial Payment.
// 8. Persist all aggregates atomically.
// 9. Persist resulting domain events into the transactional outbox.
//
// All persistence and event publication occur inside one UnitOfWork.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

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

import { FINANCIAL_PAYMENT_TOKENS } from '../financial-payment.tokens';

import { FINANCIAL_ACCOUNT_TOKENS } from '../../application/financial-account.tokens';

import { FINANCIAL_TRANSACTION_TOKENS } from '../../application/financial-transaction.tokens';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { PostSuccessfulFinancialPaymentCommand } from '../commands/post-successful-financial-payment.command';

// -----------------------------------------------------------------------------
// Financial Payment
// -----------------------------------------------------------------------------

import type { FinancialPaymentRepository } from '../../domain/repositories/financial-payment.repository';

// -----------------------------------------------------------------------------
// Financial Account
// -----------------------------------------------------------------------------

import type { FinancialAccountRepository } from '../../domain/repositories/financial-account.repository';

import { FinancialAccountPublicId } from '../../domain/value-objects/financial-account-public-id.vo';

import { FinancialAccountOwnerPublicId } from '../../domain/value-objects/financial-account-owner-public-id.vo';

import { FinancialAccountReference } from '../../domain/value-objects/financial-account-reference.vo';

// -----------------------------------------------------------------------------
// Financial Transaction
// -----------------------------------------------------------------------------

import type { FinancialTransactionRepository } from '../../domain/repositories/financial-transaction.repository';

import { FinancialTransactionAggregate } from '../../domain/aggregates/financial-transaction.aggregate';

import { FinancialTransactionReference } from '../../domain/value-objects/financial-transaction-reference.vo';

import { FinancialTransactionType } from '../../domain/value-objects/financial-transaction-type.vo';

import { FinancialTransactionEntryType } from '../../domain/value-objects/financial-transaction-entry-type.vo';

import { FinancialBalanceType } from '../../domain/value-objects/financial-balance-type.vo';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MPESA_CLEARING_ACCOUNT_OWNER = 'SYSTEM-MPESA-CLEARING';

const PAYMENT_REFERENCE_TYPE = 'FINANCIAL_PAYMENT';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

@Injectable()
export class PostSuccessfulFinancialPaymentHandler implements CommandHandler<
  PostSuccessfulFinancialPaymentCommand,
  void
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(FINANCIAL_PAYMENT_TOKENS.REPOSITORY)
    private readonly paymentRepository: FinancialPaymentRepository,

    @Inject(FINANCIAL_ACCOUNT_TOKENS.REPOSITORY)
    private readonly accountRepository: FinancialAccountRepository,

    @Inject(FINANCIAL_TRANSACTION_TOKENS.REPOSITORY)
    private readonly transactionRepository: FinancialTransactionRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: UnitOfWork,

    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    command: PostSuccessfulFinancialPaymentCommand,
  ): Promise<void> {
    await this.unitOfWork.execute(async () => {
      // -----------------------------------------------------------------------
      // 1. Load Financial Payment
      // -----------------------------------------------------------------------

      const payment = await this.paymentRepository.findByPublicId(
        command.paymentPublicId,
      );

      if (payment === null) {
        throw new Error(
          `Financial Payment not found: ${command.paymentPublicId.value}`,
        );
      }

      // -----------------------------------------------------------------------
      // 2. Validate Payment State
      // -----------------------------------------------------------------------

      if (!payment.isSucceeded()) {
        throw new Error(
          `Financial Payment ${payment.publicId.value} is not SUCCEEDED.`,
        );
      }

      if (!payment.hasSuccessfulAttempt()) {
        throw new Error(
          `Financial Payment ${payment.publicId.value} has no successful attempt.`,
        );
      }

      if (!payment.amount.isPositive()) {
        throw new Error(
          `Financial Payment ${payment.publicId.value} has an invalid amount.`,
        );
      }

      const amount = payment.amount.amount;
      const currency = payment.amount.currency;
      const now = new Date();

      // -----------------------------------------------------------------------
      // 3. Establish Stable Transaction Reference
      // -----------------------------------------------------------------------

      const reference = FinancialTransactionReference.create(
        PAYMENT_REFERENCE_TYPE,
        payment.publicId.value,
      );

      // -----------------------------------------------------------------------
      // 4. Check Existing Transaction
      // -----------------------------------------------------------------------
      //
      // This check protects against:
      //
      // - duplicate outbox delivery;
      // - subscriber retries;
      // - a successful posting followed by a failed idempotency update;
      // - repeated command execution.
      //
      // The database composite unique constraint provides the final
      // concurrency protection.
      //
      // -----------------------------------------------------------------------

      const existingTransactions =
        await this.transactionRepository.findByReference(reference);

      if (existingTransactions.length > 1) {
        throw new Error(
          `Multiple Financial Transactions exist for payment ${payment.publicId.value}.`,
        );
      }

      if (existingTransactions.length === 1) {
        const existingTransaction = existingTransactions[0];

        if (existingTransaction === undefined) {
          throw new Error(
            'Unable to retrieve the existing Financial Transaction.',
          );
        }

        // ---------------------------------------------------------------------
        // Verify the existing transaction
        // ---------------------------------------------------------------------

        if (existingTransaction.type.value !== 'PAYMENT') {
          throw new Error(
            'Existing payment reference belongs to a non-PAYMENT transaction.',
          );
        }

        if (existingTransaction.status.value !== 'COMPLETED') {
          throw new Error(
            'An existing Financial Payment transaction is not COMPLETED.',
          );
        }

        if (
          existingTransaction.amount.amount !== amount ||
          existingTransaction.amount.currency.value !== currency.value
        ) {
          throw new Error(
            'Existing Financial Transaction amount or currency does not match the payment.',
          );
        }

        // ---------------------------------------------------------------------
        // Verify existing payment link
        // ---------------------------------------------------------------------

        if (
          payment.transactionPublicId !== undefined &&
          payment.transactionPublicId !== existingTransaction.publicId.value
        ) {
          throw new Error(
            'Financial Payment is linked to a different Financial Transaction.',
          );
        }

        // ---------------------------------------------------------------------
        // Repair a missing payment link if necessary
        // ---------------------------------------------------------------------

        if (payment.transactionPublicId === undefined) {
          payment.linkTransaction(
            existingTransaction.publicId.value,
            command.correlationId,
            command.causationId,
          );

          await this.paymentRepository.save(payment);

          const domainEvents = payment.pullDomainEvents();

          if (domainEvents.length > 0) {
            await this.eventPublisher.publishAll(domainEvents);
          }
        }

        // The existing completed transaction has already been posted.
        // Never apply the account balance movements again.

        return;
      }

      // -----------------------------------------------------------------------
      // 5. Validate Existing Payment Link
      // -----------------------------------------------------------------------

      if (payment.transactionPublicId !== undefined) {
        throw new Error(
          `Payment ${payment.publicId.value} references transaction ` +
            `${payment.transactionPublicId}, but that transaction was not found.`,
        );
      }

      // -----------------------------------------------------------------------
      // 6. Load Receiving Account
      // -----------------------------------------------------------------------

      const receivingAccountPublicId = new FinancialAccountPublicId(
        payment.accountId.value,
      );

      const receivingAccount = await this.accountRepository.findByPublicId(
        receivingAccountPublicId,
      );

      if (receivingAccount === null) {
        throw new Error(
          `Receiving Financial Account not found: ${payment.accountId.value}`,
        );
      }

      // -----------------------------------------------------------------------
      // 7. Load M-PESA Clearing Account
      // -----------------------------------------------------------------------

      const clearingAccount = await this.accountRepository.findByOwnerPublicId(
        FinancialAccountOwnerPublicId.create(MPESA_CLEARING_ACCOUNT_OWNER),
      );

      if (clearingAccount === null) {
        throw new Error(
          'SYSTEM-MPESA-CLEARING Financial Account was not found.',
        );
      }

      // -----------------------------------------------------------------------
      // 8. Validate Account Identity
      // -----------------------------------------------------------------------

      if (clearingAccount.publicId.value === receivingAccount.publicId.value) {
        throw new Error(
          'M-PESA clearing account cannot be the receiving account.',
        );
      }

      if (!clearingAccount.ownerPublicId) {
        throw new Error(
          'M-PESA clearing account has no owner public identity.',
        );
      }

      if (!receivingAccount.ownerPublicId) {
        throw new Error('Receiving account has no owner public identity.');
      }

      // -----------------------------------------------------------------------
      // 9. Validate Account Operational State and Currency
      // -----------------------------------------------------------------------

      clearingAccount.ensureOperational();
      receivingAccount.ensureOperational();

      clearingAccount.ensureCurrency(currency);
      receivingAccount.ensureCurrency(currency);

      // -----------------------------------------------------------------------
      // 10. Build Transaction Account References
      // -----------------------------------------------------------------------
      //
      // Account references use the account type and owner public identity.
      // They do not use the Financial Account's own public ID.
      //
      // -----------------------------------------------------------------------

      const clearingAccountReference = FinancialAccountReference.create(
        clearingAccount.type.value,
        clearingAccount.ownerPublicId.value,
      );

      const receivingAccountReference = FinancialAccountReference.create(
        receivingAccount.type.value,
        receivingAccount.ownerPublicId.value,
      );

      // -----------------------------------------------------------------------
      // 11. Update Account Balances
      // -----------------------------------------------------------------------
      //
      // Amount is already represented in integer minor units.
      // Do not multiply it by 100.
      //
      // M-PESA incoming payment:
      //
      // Clearing Account: DEBIT AVAILABLE
      // Receiving Account: CREDIT AVAILABLE
      //
      // -----------------------------------------------------------------------

      clearingAccount.debitAvailable(amount, currency, now);

      receivingAccount.creditAvailable(amount, currency, now);

      // -----------------------------------------------------------------------
      // 12. Create Financial Transaction
      // -----------------------------------------------------------------------

      const transaction = FinancialTransactionAggregate.create(
        {
          type: FinancialTransactionType.create('PAYMENT'),

          sourceAccount: clearingAccountReference,

          destinationAccount: receivingAccountReference,

          amount: payment.amount,

          reference,
        },
        command.correlationId,
        now,
      );

      // -----------------------------------------------------------------------
      // 13. Add Clearing Account Debit Entry
      // -----------------------------------------------------------------------

      transaction.addEntry({
        account: clearingAccountReference,

        type: FinancialTransactionEntryType.create('DEBIT'),

        balanceType: FinancialBalanceType.create('AVAILABLE'),

        amount: payment.amount,
      });

      // -----------------------------------------------------------------------
      // 14. Add Receiving Account Credit Entry
      // -----------------------------------------------------------------------

      transaction.addEntry({
        account: receivingAccountReference,

        type: FinancialTransactionEntryType.create('CREDIT'),

        balanceType: FinancialBalanceType.create('AVAILABLE'),

        amount: payment.amount,
      });

      // -----------------------------------------------------------------------
      // 15. Complete Balanced Transaction
      // -----------------------------------------------------------------------

      transaction.complete(command.correlationId, now);

      // -----------------------------------------------------------------------
      // 16. Link Transaction to Payment
      // -----------------------------------------------------------------------

      payment.linkTransaction(
        transaction.publicId.value,
        command.correlationId,
        command.causationId,
      );

      // -----------------------------------------------------------------------
      // 17. Persist Transaction
      // -----------------------------------------------------------------------
      //
      // The unique transaction reference prevents a second transaction
      // from being created for the same Financial Payment.
      //
      // -----------------------------------------------------------------------

      await this.transactionRepository.save(transaction);

      // -----------------------------------------------------------------------
      // 18. Persist Both Account Aggregates
      // -----------------------------------------------------------------------
      //
      // Optimistic concurrency checks protect against concurrent balance
      // modifications.
      //
      // Any failure must roll back the entire UnitOfWork.
      //
      // -----------------------------------------------------------------------

      await this.accountRepository.save(clearingAccount);

      await this.accountRepository.save(receivingAccount);

      // -----------------------------------------------------------------------
      // 19. Persist Linked Payment
      // -----------------------------------------------------------------------

      await this.paymentRepository.save(payment);

      // -----------------------------------------------------------------------
      // 20. Persist Domain Events
      // -----------------------------------------------------------------------
      //
      // Transaction events:
      // - FinancialTransactionCreated
      // - FinancialTransactionCompleted
      //
      // Payment event:
      // - FinancialPaymentTransactionLinked
      //
      // Account domain events, if any, are also included.
      //
      // All events are persisted through the transactional outbox.
      //
      // -----------------------------------------------------------------------

      const domainEvents = [
        ...transaction.pullDomainEvents(),
        ...clearingAccount.pullDomainEvents(),
        ...receivingAccount.pullDomainEvents(),
        ...payment.pullDomainEvents(),
      ];

      if (domainEvents.length > 0) {
        await this.eventPublisher.publishAll(domainEvents);
      }
    });
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default PostSuccessfulFinancialPaymentHandler;
