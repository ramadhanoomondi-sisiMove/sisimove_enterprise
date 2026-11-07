// -----------------------------------------------------------------------------
// Financial Payment — Post Successful Payment Handler
// -----------------------------------------------------------------------------
//
// Posts a successfully confirmed Financial Payment into:
//
// 1. Financial Transaction and Financial Account aggregates.
// 2. Accounting Journal and General Ledger.
//
// Operational balance movement:
//
//   1. Recognise the externally received M-PESA funds:
//      SYSTEM-MPESA-CLEARING
//          CREDIT AVAILABLE
//
//   2. Transfer those funds to the receiving wallet:
//      SYSTEM-MPESA-CLEARING
//          DEBIT AVAILABLE
//                 |
//                 v
//          Receiving Account
//          CREDIT AVAILABLE
//
// The clearing account is a transit account for this wallet-credit flow.
// It does not need a pre-funded balance. The receipt and transfer are
// applied atomically, so the clearing balance returns to its prior value.
//
// General ledger posting:
//
//   1121 — M-PESA Clearing Receivable       DEBIT
//   2111 — User Wallet Balances Payable     CREDIT
//
// Both postings, aggregate links, and outbox events are committed atomically
// inside the same UnitOfWork.
//
// Idempotency:
// - Existing Financial Transactions never reapply account balance movements.
// - Existing journals are recovered by their posting source.
// - Duplicate journals are rejected.
// - A completed transaction is linked to its journal without reopening it.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UNIT_OF_WORK } from '../../../../foundation/persistence/unit-of-work.token';
import type { UnitOfWork } from '../../../../foundation/persistence/unit-of-work.interface';

import { EVENT_PUBLISHER } from '../../../../foundation/events/event-publisher.token';
import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Financial — Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_PAYMENT_TOKENS } from '../financial-payment.tokens';
import { FINANCIAL_ACCOUNT_TOKENS } from '../../application/financial-account.tokens';
import { FINANCIAL_TRANSACTION_TOKENS } from '../../application/financial-transaction.tokens';

// -----------------------------------------------------------------------------
// Accounting — Tokens
// -----------------------------------------------------------------------------

import { ACCOUNTING_TOKENS } from '../../../accounting/application/accounting.tokens';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { PostSuccessfulFinancialPaymentCommand } from '../commands/post-successful-financial-payment.command';

// -----------------------------------------------------------------------------
// Financial — Repositories
// -----------------------------------------------------------------------------

import type { FinancialPaymentRepository } from '../../domain/repositories/financial-payment.repository';
import type { FinancialAccountRepository } from '../../domain/repositories/financial-account.repository';
import type { FinancialTransactionRepository } from '../../domain/repositories/financial-transaction.repository';

// -----------------------------------------------------------------------------
// Financial — Aggregates and Value Objects
// -----------------------------------------------------------------------------

import { FinancialAccountPublicId } from '../../domain/value-objects/financial-account-public-id.vo';
import { FinancialAccountOwnerPublicId } from '../../domain/value-objects/financial-account-owner-public-id.vo';
import { FinancialAccountReference } from '../../domain/value-objects/financial-account-reference.vo';

import { FinancialTransactionAggregate } from '../../domain/aggregates/financial-transaction.aggregate';
import { FinancialTransactionReference } from '../../domain/value-objects/financial-transaction-reference.vo';
import { FinancialTransactionType } from '../../domain/value-objects/financial-transaction-type.vo';
import { FinancialTransactionEntryType } from '../../domain/value-objects/financial-transaction-entry-type.vo';
import { FinancialBalanceType } from '../../domain/value-objects/financial-balance-type.vo';

// -----------------------------------------------------------------------------
// Accounting — Repositories
// -----------------------------------------------------------------------------

import type { AccountingAccountRepository } from '../../../accounting/domain/repositories/accounting-account.repository';
import type { AccountingCalendarRepository } from '../../../accounting/domain/repositories/accounting-calendar.repository';
import type { AccountingPeriodRepository } from '../../../accounting/domain/repositories/accounting-period.repository';
import type { AccountingJournalRepository } from '../../../accounting/domain/repositories/accounting-journal.repository';

// -----------------------------------------------------------------------------
// Accounting — Aggregates and Entities
// -----------------------------------------------------------------------------

import { AccountingJournalAggregate } from '../../../accounting/domain/aggregates/accounting-journal.aggregate';

import { AccountingJournalEntity } from '../../../accounting/domain/entities/accounting-journal.entity';
import { AccountingJournalEntryEntity } from '../../../accounting/domain/entities/accounting-journal-entry.entity';
import { AccountingJournalLineEntity } from '../../../accounting/domain/entities/accounting-journal-line.entity';
import { AccountingPostingReferenceEntity } from '../../../accounting/domain/entities/accounting-posting-reference.entity';

// -----------------------------------------------------------------------------
// Accounting — Value Objects
// -----------------------------------------------------------------------------

import { AccountingAmount } from '../../../accounting/domain/value-objects/accounting-amount.vo';
import { AccountingCurrency } from '../../../accounting/domain/value-objects/accounting-currency.vo';
import { AccountingAccountCode } from '../../../accounting/domain/value-objects/accounting-account-code.vo';
import { AccountingCalendarCode } from '../../../accounting/domain/value-objects/accounting-calendar-code.vo';
import { AccountingJournalLineType } from '../../../accounting/domain/value-objects/accounting-journal-line-type.vo';
import { AccountingSourceType } from '../../../accounting/domain/value-objects/accounting-source-type.vo';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MPESA_CLEARING_ACCOUNT_OWNER = 'SYSTEM-MPESA-CLEARING';

const PAYMENT_REFERENCE_TYPE = 'FINANCIAL_PAYMENT';

const ACCOUNTING_SOURCE_TYPE = 'FINANCIAL_PAYMENT';

const PLATFORM_ACCOUNTING_CALENDAR_CODE = 'PLATFORM';

const MPESA_CLEARING_GL_CODE = '1121';

const USER_WALLET_PAYABLE_GL_CODE = '2111';

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

    @Inject(ACCOUNTING_TOKENS.REPOSITORIES.ACCOUNTING_ACCOUNT)
    private readonly accountingAccountRepository: AccountingAccountRepository,

    @Inject(ACCOUNTING_TOKENS.REPOSITORIES.ACCOUNTING_CALENDAR)
    private readonly accountingCalendarRepository: AccountingCalendarRepository,

    @Inject(ACCOUNTING_TOKENS.REPOSITORIES.ACCOUNTING_PERIOD)
    private readonly accountingPeriodRepository: AccountingPeriodRepository,

    @Inject(ACCOUNTING_TOKENS.REPOSITORIES.ACCOUNTING_JOURNAL)
    private readonly accountingJournalRepository: AccountingJournalRepository,

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
      // 1. Load and Validate Financial Payment
      // -----------------------------------------------------------------------

      const payment = await this.paymentRepository.findByPublicId(
        command.paymentPublicId,
      );

      if (payment === null) {
        throw new Error(
          `Financial Payment not found: ${command.paymentPublicId.value}`,
        );
      }

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

      const successfulAttempt = payment.getSuccessfulAttempt();

      if (
        successfulAttempt === undefined ||
        !successfulAttempt.isSuccessful()
      ) {
        throw new Error(
          `Financial Payment ${payment.publicId.value} has an invalid successful attempt.`,
        );
      }

      const entryDate = successfulAttempt.completedAt;

      if (entryDate === undefined) {
        throw new Error(
          `Successful attempt for payment ${payment.publicId.value} has no completion timestamp.`,
        );
      }

      if (
        payment.completedAt === undefined ||
        payment.completedAt.getTime() !== entryDate.getTime()
      ) {
        throw new Error(
          `Payment completion timestamp does not match its successful attempt: ${payment.publicId.value}.`,
        );
      }

      const amount = payment.amount.amount;
      const currency = payment.amount.currency;
      const now = new Date();

      // -----------------------------------------------------------------------
      // 2. Establish Stable Financial Transaction Reference
      // -----------------------------------------------------------------------

      const reference = FinancialTransactionReference.create(
        PAYMENT_REFERENCE_TYPE,
        payment.publicId.value,
      );

      // -----------------------------------------------------------------------
      // 3. Find Existing Financial Transaction
      // -----------------------------------------------------------------------

      const existingTransactions =
        await this.transactionRepository.findByReference(reference);

      if (existingTransactions.length > 1) {
        throw new Error(
          `Multiple Financial Transactions exist for payment ${payment.publicId.value}.`,
        );
      }

      let transaction: FinancialTransactionAggregate;

      if (existingTransactions.length === 1) {
        const existingTransaction = existingTransactions[0];

        if (existingTransaction === undefined) {
          throw new Error(
            'Unable to retrieve the existing Financial Transaction.',
          );
        }

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

        if (
          payment.transactionPublicId !== undefined &&
          payment.transactionPublicId !== existingTransaction.publicId.value
        ) {
          throw new Error(
            'Financial Payment is linked to a different Financial Transaction.',
          );
        }

        if (payment.transactionPublicId === undefined) {
          payment.linkTransaction(
            existingTransaction.publicId.value,
            command.correlationId,
            command.causationId,
          );

          await this.paymentRepository.save(payment);

          const paymentEvents = payment.pullDomainEvents();

          if (paymentEvents.length > 0) {
            await this.eventPublisher.publishAll(paymentEvents);
          }
        }

        // Do not repeat the account balance movements.
        transaction = existingTransaction;
      } else {
        // ---------------------------------------------------------------------
        // 4. Validate Payment Does Not Reference a Missing Transaction
        // ---------------------------------------------------------------------

        if (payment.transactionPublicId !== undefined) {
          throw new Error(
            `Payment ${payment.publicId.value} references transaction ` +
              `${payment.transactionPublicId}, but that transaction was not found.`,
          );
        }

        // ---------------------------------------------------------------------
        // 5. Load Receiving Financial Account
        // ---------------------------------------------------------------------

        const receivingAccount = await this.accountRepository.findByPublicId(
          new FinancialAccountPublicId(payment.accountId.value),
        );

        if (receivingAccount === null) {
          throw new Error(
            `Receiving Financial Account not found: ${payment.accountId.value}`,
          );
        }

        // ---------------------------------------------------------------------
        // 6. Load M-PESA Clearing Financial Account
        // ---------------------------------------------------------------------

        const clearingAccount =
          await this.accountRepository.findByOwnerPublicId(
            FinancialAccountOwnerPublicId.create(MPESA_CLEARING_ACCOUNT_OWNER),
          );

        if (clearingAccount === null) {
          throw new Error(
            'SYSTEM-MPESA-CLEARING Financial Account was not found.',
          );
        }

        // ---------------------------------------------------------------------
        // 7. Validate Financial Account Identity and State
        // ---------------------------------------------------------------------

        if (
          clearingAccount.publicId.value === receivingAccount.publicId.value
        ) {
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

        clearingAccount.ensureOperational();
        receivingAccount.ensureOperational();

        clearingAccount.ensureCurrency(currency);
        receivingAccount.ensureCurrency(currency);

        // ---------------------------------------------------------------------
        // 8. Build Financial Account References
        // ---------------------------------------------------------------------

        const clearingAccountReference = FinancialAccountReference.create(
          clearingAccount.type.value,
          clearingAccount.publicId.value,
        );

        const receivingAccountReference = FinancialAccountReference.create(
          receivingAccount.type.value,
          receivingAccount.publicId.value,
        );

        // ---------------------------------------------------------------------
        // 9. Apply Operational Balance Movements
        // ---------------------------------------------------------------------

        // M-PESA has already confirmed receipt of these funds externally.
        // Recognise that receipt in the clearing account first. This prevents
        // a valid wallet top-up from requiring the system clearing account to
        // have been pre-funded.
        clearingAccount.creditAvailable(amount, currency, now);

        // Transfer the received amount from clearing into the customer's
        // available wallet balance. Both movements are inside this UnitOfWork.
        clearingAccount.debitAvailable(amount, currency, now);

        receivingAccount.creditAvailable(amount, currency, now);

        // ---------------------------------------------------------------------
        // 10. Create Financial Transaction
        // ---------------------------------------------------------------------

        transaction = FinancialTransactionAggregate.create(
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

        transaction.addEntry({
          account: clearingAccountReference,

          type: FinancialTransactionEntryType.create('DEBIT'),

          balanceType: FinancialBalanceType.create('AVAILABLE'),

          amount: payment.amount,
        });

        transaction.addEntry({
          account: receivingAccountReference,

          type: FinancialTransactionEntryType.create('CREDIT'),

          balanceType: FinancialBalanceType.create('AVAILABLE'),

          amount: payment.amount,
        });

        transaction.complete(command.correlationId, now);

        // ---------------------------------------------------------------------
        // 11. Link Financial Transaction to Payment
        // ---------------------------------------------------------------------

        payment.linkTransaction(
          transaction.publicId.value,
          command.correlationId,
          command.causationId,
        );

        // ---------------------------------------------------------------------
        // 12. Persist Financial Aggregates
        // ---------------------------------------------------------------------

        await this.transactionRepository.save(transaction);

        await this.accountRepository.save(clearingAccount);

        await this.accountRepository.save(receivingAccount);

        await this.paymentRepository.save(payment);

        // ---------------------------------------------------------------------
        // 13. Persist Financial Domain Events
        // ---------------------------------------------------------------------

        const financialEvents = [
          ...transaction.pullDomainEvents(),
          ...clearingAccount.pullDomainEvents(),
          ...receivingAccount.pullDomainEvents(),
          ...payment.pullDomainEvents(),
        ];

        if (financialEvents.length > 0) {
          await this.eventPublisher.publishAll(financialEvents);
        }
      }

      // -----------------------------------------------------------------------
      // 14. Resolve Existing Accounting Journal by Posting Source
      // -----------------------------------------------------------------------

      const sourceType = AccountingSourceType.create(ACCOUNTING_SOURCE_TYPE);

      const existingJournals =
        await this.accountingJournalRepository.findByPostingSource(
          sourceType.value,
          payment.publicId.value,
        );

      if (existingJournals.length > 1) {
        throw new Error(
          `Multiple Accounting Journals exist for Financial Payment ${payment.publicId.value}.`,
        );
      }

      if (existingJournals.length === 1) {
        const existingJournal = existingJournals[0];

        if (existingJournal === undefined) {
          throw new Error(
            'Unable to retrieve the existing Accounting Journal.',
          );
        }

        if (!existingJournal.isPosted()) {
          throw new Error(
            `Accounting Journal for payment ${payment.publicId.value} exists but is not POSTED.`,
          );
        }

        if (
          existingJournal.postingReference === undefined ||
          !existingJournal.postingReference.references(
            sourceType,
            payment.publicId.value,
          )
        ) {
          throw new Error(
            'Existing Accounting Journal has an invalid payment posting reference.',
          );
        }

        if (
          existingJournal.currency.value !== currency.value ||
          existingJournal.totalDebit !== amount ||
          existingJournal.totalCredit !== amount
        ) {
          throw new Error(
            'Existing Accounting Journal does not match the Financial Payment amount or currency.',
          );
        }

        if (transaction.hasAccountingJournal()) {
          if (
            transaction.accountingJournalPublicId !==
            existingJournal.publicId.value
          ) {
            throw new Error(
              'Financial Transaction references a different Accounting Journal.',
            );
          }
        } else {
          transaction.associateAccountingJournalAfterCompletion(
            existingJournal.publicId.value,
            now,
          );

          await this.transactionRepository.save(transaction);

          const transactionEvents = transaction.pullDomainEvents();

          if (transactionEvents.length > 0) {
            await this.eventPublisher.publishAll(transactionEvents);
          }
        }

        return;
      }

      // -----------------------------------------------------------------------
      // 15. Validate Existing Transaction Journal Link
      // -----------------------------------------------------------------------

      if (transaction.hasAccountingJournal()) {
        throw new Error(
          `Financial Transaction ${transaction.publicId.value} references an Accounting Journal that was not found by its payment posting source.`,
        );
      }

      // -----------------------------------------------------------------------
      // 16. Resolve Platform Accounting Calendar and Period
      // -----------------------------------------------------------------------

      const platformCalendar =
        await this.accountingCalendarRepository.findByCode(
          AccountingCalendarCode.create(PLATFORM_ACCOUNTING_CALENDAR_CODE),
        );

      if (platformCalendar === null) {
        throw new Error(
          'Platform Accounting Calendar was not found while posting the Financial Payment.',
        );
      }

      if (platformCalendar.status.value !== 'ACTIVE') {
        throw new Error(
          'Platform Accounting Calendar is inactive and cannot accept Financial Payment postings.',
        );
      }

      // Resolve periods only from the platform calendar. This prevents a
      // period belonging to another calendar from being selected merely
      // because its date range contains the payment completion timestamp.
      const platformPeriods =
        await this.accountingPeriodRepository.findByCalendarId(
          platformCalendar.id,
        );

      const containingPeriods = platformPeriods.filter((period) =>
        period.contains(entryDate),
      );

      if (containingPeriods.length !== 1) {
        throw new Error(
          `Expected exactly one PLATFORM Accounting Period for payment date ${entryDate.toISOString()}, found ${containingPeriods.length}.`,
        );
      }

      const accountingPeriod = containingPeriods[0];

      if (accountingPeriod === undefined) {
        throw new Error(
          'Unable to retrieve the PLATFORM Accounting Period for the payment date.',
        );
      }

      if (!accountingPeriod.belongsToCalendar()) {
        throw new Error(
          'Resolved Accounting Period does not have calendar ownership.',
        );
      }

      if (
        accountingPeriod.calendarId === undefined ||
        !accountingPeriod.calendarId.equals(platformCalendar.id)
      ) {
        throw new Error(
          'Resolved Accounting Period does not belong to the PLATFORM Accounting Calendar.',
        );
      }

      if (!accountingPeriod.contains(entryDate)) {
        throw new Error(
          'Resolved Accounting Period does not contain the payment date.',
        );
      }

      if (
        !accountingPeriod.isUsable() ||
        !accountingPeriod.canAcceptJournals()
      ) {
        throw new Error(
          `Accounting Period ${accountingPeriod.publicId.value} cannot accept journals.`,
        );
      }

      // -----------------------------------------------------------------------
      // 17. Resolve General Ledger Accounts
      // -----------------------------------------------------------------------

      const clearingGlAccount =
        await this.accountingAccountRepository.findByCode(
          AccountingAccountCode.create(MPESA_CLEARING_GL_CODE),
        );

      if (clearingGlAccount === null) {
        throw new Error(
          `General Ledger account ${MPESA_CLEARING_GL_CODE} was not found.`,
        );
      }

      const walletPayableGlAccount =
        await this.accountingAccountRepository.findByCode(
          AccountingAccountCode.create(USER_WALLET_PAYABLE_GL_CODE),
        );

      if (walletPayableGlAccount === null) {
        throw new Error(
          `General Ledger account ${USER_WALLET_PAYABLE_GL_CODE} was not found.`,
        );
      }

      // -----------------------------------------------------------------------
      // 18. Validate General Ledger Account Classification and Availability
      // -----------------------------------------------------------------------

      if (!clearingGlAccount.type.isAsset()) {
        throw new Error(
          `General Ledger account ${MPESA_CLEARING_GL_CODE} must be an ASSET account.`,
        );
      }

      if (!walletPayableGlAccount.type.isLiability()) {
        throw new Error(
          `General Ledger account ${USER_WALLET_PAYABLE_GL_CODE} must be a LIABILITY account.`,
        );
      }

      if (
        !clearingGlAccount.isUsable() ||
        !clearingGlAccount.canReceivePostings()
      ) {
        throw new Error(
          `General Ledger account ${MPESA_CLEARING_GL_CODE} cannot receive postings.`,
        );
      }

      if (
        !walletPayableGlAccount.isUsable() ||
        !walletPayableGlAccount.canReceivePostings()
      ) {
        throw new Error(
          `General Ledger account ${USER_WALLET_PAYABLE_GL_CODE} cannot receive postings.`,
        );
      }

      if (clearingGlAccount.id.equals(walletPayableGlAccount.id)) {
        throw new Error(
          'M-PESA clearing and wallet payable GL accounts must be different.',
        );
      }

      // -----------------------------------------------------------------------
      // 19. Build Accounting Journal
      // -----------------------------------------------------------------------

      const accountingCurrency = AccountingCurrency.create(currency.value);

      if (!accountingCurrency.isKes()) {
        throw new Error(
          `Financial Payment accounting currently supports KES only; received ${currency.value}.`,
        );
      }

      // AccountingAmount uses the same integer minor-unit amount.
      // Do not multiply the payment amount by 100.

      const accountingAmount = AccountingAmount.create(amount);

      const journal = AccountingJournalEntity.create(
        accountingCurrency,
        accountingPeriod.id,
        accountingPeriod.publicId,
        now,
      );

      const journalAggregate = AccountingJournalAggregate.create(journal);

      const journalEntry = AccountingJournalEntryEntity.create(
        entryDate,
        `M-PESA successful payment ${payment.publicId.value}`,
        [],
        now,
      );

      const clearingDebitLine = AccountingJournalLineEntity.create(
        clearingGlAccount.id,
        AccountingJournalLineType.debit(),
        accountingAmount,
        accountingCurrency,
        'M-PESA clearing receivable',
        now,
      );

      const walletPayableCreditLine = AccountingJournalLineEntity.create(
        walletPayableGlAccount.id,
        AccountingJournalLineType.credit(),
        accountingAmount,
        accountingCurrency,
        'User wallet balance payable',
        now,
      );

      journalEntry.addLine(clearingDebitLine);
      journalEntry.addLine(walletPayableCreditLine);

      journalAggregate.addEntry(journalEntry);

      // -----------------------------------------------------------------------
      // 20. Attach Accounting Posting Reference
      // -----------------------------------------------------------------------

      const postingReference = AccountingPostingReferenceEntity.create(
        sourceType,
        payment.publicId.value,
        now,
      );

      journalAggregate.setPostingReference(postingReference);

      // -----------------------------------------------------------------------
      // 21. Validate and Post Accounting Journal
      // -----------------------------------------------------------------------

      if (!journalAggregate.canPost()) {
        throw new Error(
          `Accounting Journal for payment ${payment.publicId.value} is not ready for posting.`,
        );
      }

      if (!journalAggregate.isBalanced()) {
        throw new Error(
          `Accounting Journal for payment ${payment.publicId.value} is not balanced.`,
        );
      }

      journalAggregate.post(command.correlationId, command.causationId, now);

      if (!journalAggregate.isPosted()) {
        throw new Error(
          `Accounting Journal for payment ${payment.publicId.value} was not posted.`,
        );
      }

      // -----------------------------------------------------------------------
      // 22. Associate Journal with Completed Financial Transaction
      // -----------------------------------------------------------------------

      transaction.associateAccountingJournalAfterCompletion(
        journalAggregate.publicId.value,
        now,
      );

      // -----------------------------------------------------------------------
      // 23. Persist Accounting Journal and Transaction Link
      // -----------------------------------------------------------------------

      await this.accountingJournalRepository.save(journalAggregate);

      await this.transactionRepository.save(transaction);

      // -----------------------------------------------------------------------
      // 24. Persist Accounting and Transaction Domain Events
      // -----------------------------------------------------------------------

      const accountingEvents = [
        ...journalAggregate.pullDomainEvents(),
        ...transaction.pullDomainEvents(),
      ];

      if (accountingEvents.length > 0) {
        await this.eventPublisher.publishAll(accountingEvents);
      }
    });
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default PostSuccessfulFinancialPaymentHandler;
