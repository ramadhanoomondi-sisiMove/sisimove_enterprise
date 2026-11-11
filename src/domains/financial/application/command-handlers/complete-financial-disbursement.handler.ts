// -----------------------------------------------------------------------------
// Financial Disbursement — Complete Command Handler
// -----------------------------------------------------------------------------
//
// Completes a provider-confirmed M-PESA B2C business payout.
//
// Atomic workflow:
// 1. Validate the successful disbursement and originating withdrawal.
// 2. Recover or create the successful Financial Transaction.
// 3. Capture the customer's withdrawal hold.
// 4. Update the operational M-PESA disbursement account.
// 5. Complete the originating withdrawal.
// 6. Recover or post the General Ledger journal.
// 7. Link and complete the disbursement.
// 8. Persist all changes and publish domain events in one UnitOfWork.
//
// General Ledger:
//   DR 2111 — User Wallet Balances Payable
//   CR 1112 — M-PESA Operating Float
//
// Provider ACCEPTED is not sufficient. A successful provider callback must
// already have moved an attempt into its successful terminal state.
//
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import { UNIT_OF_WORK } from '../../../../foundation/persistence/unit-of-work.token';
import type { UnitOfWork } from '../../../../foundation/persistence/unit-of-work.interface';

import { EVENT_PUBLISHER } from '../../../../foundation/events/event-publisher.token';
import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';

// -----------------------------------------------------------------------------
// Application Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_DISBURSEMENT_TOKENS } from '../financial-disbursement.tokens';

import { FINANCIAL_ACCOUNT_TOKENS } from '../../application/financial-account.tokens';

import { FINANCIAL_ACCOUNT_HOLD_TOKENS } from '../../application/financial-account-hold.tokens';

import { FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS } from '../../application/financial-account-withdrawal.tokens';

import { FINANCIAL_TRANSACTION_TOKENS } from '../../application/financial-transaction.tokens';

import { ACCOUNTING_TOKENS } from '../../../accounting/application/accounting.tokens';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { CompleteFinancialDisbursementCommand } from '../commands/complete-financial-disbursement.command';

// -----------------------------------------------------------------------------
// Financial Repositories
// -----------------------------------------------------------------------------

import type { FinancialDisbursementRepository } from '../../domain/repositories/financial-disbursement.repository';

import type { FinancialAccountRepository } from '../../domain/repositories/financial-account.repository';

import type { FinancialAccountHoldRepository } from '../../domain/repositories/financial-account-hold.repository';

import type { FinancialAccountWithdrawalRepository } from '../../domain/repositories/financial-account-withdrawal.repository';

import type { FinancialTransactionRepository } from '../../domain/repositories/financial-transaction.repository';

// -----------------------------------------------------------------------------
// Accounting Repositories
// -----------------------------------------------------------------------------

import type { AccountingAccountRepository } from '../../../accounting/domain/repositories/accounting-account.repository';

import type { AccountingPeriodRepository } from '../../../accounting/domain/repositories/accounting-period.repository';

import type { AccountingJournalRepository } from '../../../accounting/domain/repositories/accounting-journal.repository';

// -----------------------------------------------------------------------------
// Financial Aggregates
// -----------------------------------------------------------------------------

import type { FinancialDisbursementAggregate } from '../../domain/aggregates/financial-disbursement.aggregate';

import { FinancialTransactionAggregate } from '../../domain/aggregates/financial-transaction.aggregate';

// -----------------------------------------------------------------------------
// Financial Value Objects
// -----------------------------------------------------------------------------

import { FinancialAccountPublicId } from '../../domain/value-objects/financial-account-public-id.vo';

import { FinancialAccountOwnerPublicId } from '../../domain/value-objects/financial-account-owner-public-id.vo';

import { FinancialAccountWithdrawalPublicId } from '../../domain/value-objects/financial-account-withdrawal-public-id.vo';

import { FinancialAccountReference } from '../../domain/value-objects/financial-account-reference.vo';

import { FinancialHoldReference } from '../../domain/value-objects/financial-hold-reference.vo';

import { FinancialTransactionReference } from '../../domain/value-objects/financial-transaction-reference.vo';

import { FinancialTransactionType } from '../../domain/value-objects/financial-transaction-type.vo';

import { FinancialTransactionEntryType } from '../../domain/value-objects/financial-transaction-entry-type.vo';

import { FinancialBalanceType } from '../../domain/value-objects/financial-balance-type.vo';

// -----------------------------------------------------------------------------
// Accounting Aggregates and Entities
// -----------------------------------------------------------------------------

import { AccountingJournalAggregate } from '../../../accounting/domain/aggregates/accounting-journal.aggregate';

import { AccountingJournalEntity } from '../../../accounting/domain/entities/accounting-journal.entity';

import { AccountingJournalEntryEntity } from '../../../accounting/domain/entities/accounting-journal-entry.entity';

import { AccountingJournalLineEntity } from '../../../accounting/domain/entities/accounting-journal-line.entity';

import { AccountingPostingReferenceEntity } from '../../../accounting/domain/entities/accounting-posting-reference.entity';

// -----------------------------------------------------------------------------
// Accounting Value Objects
// -----------------------------------------------------------------------------

import { AccountingAmount } from '../../../accounting/domain/value-objects/accounting-amount.vo';

import { AccountingCurrency } from '../../../accounting/domain/value-objects/accounting-currency.vo';

import { AccountingAccountCode } from '../../../accounting/domain/value-objects/accounting-account-code.vo';

import { AccountingJournalLineType } from '../../../accounting/domain/value-objects/accounting-journal-line-type.vo';

import { AccountingSourceType } from '../../../accounting/domain/value-objects/accounting-source-type.vo';
import { FinancialReferencePublicId } from '../../domain/value-objects';

// =============================================================================
// Constants
// =============================================================================

const MPESA_DISBURSEMENT_ACCOUNT_OWNER = 'SYSTEM-MPESA-DISBURSEMENT';

const WITHDRAWAL_HOLD_REFERENCE_TYPE = 'FINANCIAL_ACCOUNT_WITHDRAWAL';

const WITHDRAWAL_CAPTURE_REFERENCE_TYPE =
  'FINANCIAL_ACCOUNT_WITHDRAWAL_CAPTURE';

const WITHDRAWAL_TRANSACTION_TYPE = 'WITHDRAWAL';

const ACCOUNTING_SOURCE_TYPE = 'FINANCIAL_DISBURSEMENT';

const USER_WALLET_PAYABLE_GL_CODE = '2111';

const MPESA_OPERATING_FLOAT_GL_CODE = '1112';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class CompleteFinancialDisbursementHandler implements CommandHandler<
  CompleteFinancialDisbursementCommand,
  FinancialDisbursementAggregate
> {
  public constructor(
    @Inject(FINANCIAL_DISBURSEMENT_TOKENS.REPOSITORY)
    private readonly disbursementRepository: FinancialDisbursementRepository,

    @Inject(FINANCIAL_ACCOUNT_TOKENS.REPOSITORY)
    private readonly accountRepository: FinancialAccountRepository,

    @Inject(FINANCIAL_ACCOUNT_HOLD_TOKENS.REPOSITORY)
    private readonly holdRepository: FinancialAccountHoldRepository,

    @Inject(FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS.REPOSITORY)
    private readonly withdrawalRepository: FinancialAccountWithdrawalRepository,

    @Inject(FINANCIAL_TRANSACTION_TOKENS.REPOSITORY)
    private readonly transactionRepository: FinancialTransactionRepository,

    @Inject(ACCOUNTING_TOKENS.REPOSITORIES.ACCOUNTING_ACCOUNT)
    private readonly accountingAccountRepository: AccountingAccountRepository,

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
    command: CompleteFinancialDisbursementCommand,
  ): Promise<FinancialDisbursementAggregate> {
    return this.unitOfWork.execute(async () => {
      const now = new Date();

      // -----------------------------------------------------------------------
      // 1. Load and validate the Financial Disbursement.
      // -----------------------------------------------------------------------

      const disbursement = await this.disbursementRepository.findByPublicId(
        command.disbursementPublicId,
      );

      if (disbursement === null) {
        throw new Error(
          `Financial Disbursement "${command.disbursementPublicId.value}" was not found.`,
        );
      }

      if (!disbursement.hasSuccessfulAttempt()) {
        throw new Error(
          `Financial Disbursement "${disbursement.publicId.value}" has no successful attempt.`,
        );
      }

      const successfulAttempt = disbursement.attempts.find((attempt) =>
        attempt.isSuccessful(),
      );

      if (
        successfulAttempt === undefined ||
        successfulAttempt.completedAt === undefined
      ) {
        throw new Error(
          `Financial Disbursement "${disbursement.publicId.value}" has an invalid successful attempt.`,
        );
      }

      const entryDate = successfulAttempt.completedAt;

      const amount = disbursement.amount.amount;
      const currency = disbursement.amount.currency;

      if (!disbursement.amount.isPositive()) {
        throw new Error('Disbursement amount must be positive.');
      }

      if (currency.value !== 'KES') {
        throw new Error(
          `B2C disbursements support KES only. Received "${currency.value}".`,
        );
      }

      // -----------------------------------------------------------------------
      // 2. Resolve the originating withdrawal.
      // -----------------------------------------------------------------------

      const withdrawalPublicId = disbursement.disbursement.withdrawalPublicId;

      if (
        withdrawalPublicId === undefined ||
        withdrawalPublicId.trim().length === 0
      ) {
        throw new Error(
          `Disbursement "${disbursement.publicId.value}" has no originating withdrawal.`,
        );
      }

      const withdrawal = await this.withdrawalRepository.findByPublicId(
        new FinancialAccountWithdrawalPublicId(withdrawalPublicId),
      );

      if (withdrawal === null) {
        throw new Error(
          `Originating withdrawal "${withdrawalPublicId}" was not found.`,
        );
      }

      if (withdrawal.disbursementPublicId !== disbursement.publicId.value) {
        throw new Error(
          'The originating withdrawal does not reference this disbursement.',
        );
      }

      if (
        withdrawal.amountValue !== amount ||
        withdrawal.currency !== currency.value
      ) {
        throw new Error(
          'Withdrawal amount or currency does not match the disbursement.',
        );
      }

      if (
        withdrawal.accountPublicId.value !==
        disbursement.sourceAccountPublicId.value
      ) {
        throw new Error(
          'Withdrawal account does not match the disbursement source account.',
        );
      }

      if (!withdrawal.isProcessing && !withdrawal.isCompleted) {
        throw new Error(
          `Withdrawal "${withdrawal.publicId.value}" is not in a completable state.`,
        );
      }

      // -----------------------------------------------------------------------
      // 3. Resolve the stable Financial Transaction reference.
      // -----------------------------------------------------------------------

      const transactionReference = FinancialTransactionReference.create(
        WITHDRAWAL_CAPTURE_REFERENCE_TYPE,
        withdrawal.publicId.value,
      );

      const existingTransactions =
        await this.transactionRepository.findByReference(transactionReference);

      if (existingTransactions.length > 1) {
        throw new Error(
          `Multiple capture transactions exist for withdrawal "${withdrawal.publicId.value}".`,
        );
      }

      let transaction: FinancialTransactionAggregate;

      if (existingTransactions.length === 1) {
        const existingTransaction = existingTransactions[0];

        if (existingTransaction === undefined) {
          throw new Error(
            'Unable to retrieve the existing withdrawal capture transaction.',
          );
        }

        if (
          !existingTransaction.type.isDisbursement() ||
          !existingTransaction.isCompleted()
        ) {
          throw new Error(
            'The existing B2C payout transaction is not a completed DISBURSEMENT transaction.',
          );
        }
        if (
          existingTransaction.amount.amount !== amount ||
          existingTransaction.amount.currency.value !== currency.value
        ) {
          throw new Error(
            'Existing capture transaction amount or currency does not match the disbursement.',
          );
        }

        if (
          disbursement.hasTransaction() &&
          disbursement.transactionPublicId?.value !==
            existingTransaction.publicId.value
        ) {
          throw new Error(
            'Disbursement references a different Financial Transaction.',
          );
        }

        transaction = existingTransaction;
      } else {
        if (disbursement.hasTransaction()) {
          throw new Error(
            'Disbursement references a Financial Transaction that could not be found.',
          );
        }

        if (!withdrawal.isProcessing) {
          throw new Error(
            'A new capture transaction cannot be created for a withdrawal that is not PROCESSING.',
          );
        }

        // ---------------------------------------------------------------------
        // 4. Load the customer's Financial Account.
        // ---------------------------------------------------------------------

        const customerAccount = await this.accountRepository.findByPublicId(
          new FinancialAccountPublicId(
            disbursement.sourceAccountPublicId.value,
          ),
        );

        if (customerAccount === null) {
          throw new Error(
            `Source Financial Account "${disbursement.sourceAccountPublicId.value}" was not found.`,
          );
        }

        // ---------------------------------------------------------------------
        // 5. Load the operational M-PESA disbursement account.
        // ---------------------------------------------------------------------

        const mpesaAccount = await this.accountRepository.findByOwnerPublicId(
          FinancialAccountOwnerPublicId.create(
            MPESA_DISBURSEMENT_ACCOUNT_OWNER,
          ),
        );

        if (mpesaAccount === null) {
          throw new Error(
            'SYSTEM-MPESA-DISBURSEMENT Financial Account was not found.',
          );
        }

        if (customerAccount.publicId.value === mpesaAccount.publicId.value) {
          throw new Error(
            'Customer account cannot be the M-PESA disbursement account.',
          );
        }

        if (
          customerAccount.ownerPublicId === undefined ||
          mpesaAccount.ownerPublicId === undefined
        ) {
          throw new Error(
            'Both Financial Accounts must have owner public identities.',
          );
        }

        customerAccount.ensureOperational();
        mpesaAccount.ensureOperational();

        customerAccount.ensureCurrency(currency);
        mpesaAccount.ensureCurrency(currency);

        // ---------------------------------------------------------------------
        // 6. Resolve the active withdrawal hold.
        // ---------------------------------------------------------------------

        const holdReference = FinancialHoldReference.create(
          WITHDRAWAL_HOLD_REFERENCE_TYPE,
          withdrawal.publicId.value,
        );

        const activeHolds =
          await this.holdRepository.findActiveByReference(holdReference);

        if (activeHolds.length !== 1) {
          throw new Error(
            `Expected exactly one active withdrawal hold for "${withdrawal.publicId.value}", found ${activeHolds.length}.`,
          );
        }

        const hold = activeHolds[0];

        if (hold === undefined) {
          throw new Error('Unable to retrieve the active withdrawal hold.');
        }

        if (
          hold.accountPublicId.value !== customerAccount.publicId.value ||
          hold.amountValue !== amount ||
          hold.currency !== currency.value
        ) {
          throw new Error(
            'Withdrawal hold account, amount, or currency does not match the disbursement.',
          );
        }

        if (!hold.canCapture(now)) {
          throw new Error(
            `Withdrawal hold "${withdrawal.publicId.value}" cannot be captured.`,
          );
        }

        // ---------------------------------------------------------------------
        // 7. Build operational Financial Account references.
        // ---------------------------------------------------------------------

        const customerAccountReference = FinancialAccountReference.create(
          customerAccount.type.value,
          customerAccount.ownerPublicId.value,
        );

        const mpesaAccountReference = FinancialAccountReference.create(
          mpesaAccount.type.value,
          mpesaAccount.ownerPublicId.value,
        );

        // ---------------------------------------------------------------------
        // 8. Apply operational balance movements.
        // ---------------------------------------------------------------------
        //
        // The customer withdrawal reservation is captured.
        //
        // The operational M-PESA disbursement account records the counterpart
        // of the captured withdrawal. Its operational balance is distinct
        // from GL account 1112.
        // ---------------------------------------------------------------------

        customerAccount.captureHeldFunds(amount, currency, entryDate);

        mpesaAccount.creditAvailable(amount, currency, entryDate);

        // ---------------------------------------------------------------------
        // 9. Create the successful Financial Transaction.
        // ---------------------------------------------------------------------

        transaction = FinancialTransactionAggregate.create(
          {
            type: FinancialTransactionType.create(WITHDRAWAL_TRANSACTION_TYPE),
            sourceAccount: customerAccountReference,
            destinationAccount: mpesaAccountReference,
            amount: disbursement.amount,
            reference: transactionReference,
          },
          command.correlationId,
          entryDate,
        );

        transaction.addEntry(
          {
            account: customerAccountReference,
            type: FinancialTransactionEntryType.create('DEBIT'),
            balanceType: FinancialBalanceType.create('HELD'),
            amount: disbursement.amount,
          },
          entryDate,
        );

        transaction.addEntry(
          {
            account: mpesaAccountReference,
            type: FinancialTransactionEntryType.create('CREDIT'),
            balanceType: FinancialBalanceType.create('AVAILABLE'),
            amount: disbursement.amount,
          },
          entryDate,
        );

        transaction.complete(command.correlationId, entryDate);

        // ---------------------------------------------------------------------
        // 10. Capture the hold and link the transaction.
        // ---------------------------------------------------------------------

        hold.capture(
          transaction.publicId.value,
          entryDate,
          command.correlationId,
          command.causationId,
        );

        disbursement.setTransactionPublicId(
          FinancialReferencePublicId.create(transaction.publicId.value),
        );
        // ---------------------------------------------------------------------
        // 11. Complete the originating withdrawal.
        // ---------------------------------------------------------------------

        withdrawal.complete(
          entryDate,
          command.correlationId,
          command.causationId,
        );

        // ---------------------------------------------------------------------
        // 12. Persist operational Financial aggregates.
        // ---------------------------------------------------------------------

        await this.transactionRepository.save(transaction);

        await this.accountRepository.save(customerAccount);

        await this.accountRepository.save(mpesaAccount);

        await this.holdRepository.save(hold);

        await this.withdrawalRepository.save(withdrawal);

        // ---------------------------------------------------------------------
        // 13. Publish operational Financial domain events.
        // ---------------------------------------------------------------------

        const financialEvents = [
          ...transaction.pullDomainEvents(),
          ...customerAccount.pullDomainEvents(),
          ...mpesaAccount.pullDomainEvents(),
          ...hold.pullDomainEvents(),
          ...withdrawal.pullDomainEvents(),
        ];

        if (financialEvents.length > 0) {
          await this.eventPublisher.publishAll(financialEvents);
        }
      }

      // -----------------------------------------------------------------------
      // 14. Validate and associate the disbursement transaction reference.
      // -----------------------------------------------------------------------

      if (
        disbursement.hasTransaction() &&
        disbursement.transactionPublicId?.value !== transaction.publicId.value
      ) {
        throw new Error(
          'Disbursement is already linked to a different Financial Transaction.',
        );
      }

      if (!disbursement.hasTransaction()) {
        disbursement.setTransactionPublicId(
          FinancialReferencePublicId.create(transaction.publicId.value),
        );
      }

      // -----------------------------------------------------------------------
      // 15. Resolve the Accounting Journal by posting source.
      // -----------------------------------------------------------------------

      const sourceType = AccountingSourceType.create(ACCOUNTING_SOURCE_TYPE);

      const existingJournals =
        await this.accountingJournalRepository.findByPostingSource(
          sourceType.value,
          disbursement.publicId.value,
        );

      if (existingJournals.length > 1) {
        throw new Error(
          `Multiple Accounting Journals exist for disbursement "${disbursement.publicId.value}".`,
        );
      }

      if (existingJournals.length === 1) {
        const existingJournal = existingJournals[0];

        if (existingJournal === undefined || !existingJournal.isPosted()) {
          throw new Error(
            'An existing disbursement Accounting Journal is not POSTED.',
          );
        }

        if (
          existingJournal.postingReference === undefined ||
          !existingJournal.postingReference.references(
            sourceType,
            disbursement.publicId.value,
          )
        ) {
          throw new Error(
            'Existing Accounting Journal has an invalid posting reference.',
          );
        }

        if (
          existingJournal.currency.value !== currency.value ||
          existingJournal.totalDebit !== amount ||
          existingJournal.totalCredit !== amount
        ) {
          throw new Error(
            'Existing Accounting Journal amount or currency does not match the disbursement.',
          );
        }

        if (
          transaction.hasAccountingJournal() &&
          transaction.accountingJournalPublicId !==
            existingJournal.publicId.value
        ) {
          throw new Error(
            'Financial Transaction references a different Accounting Journal.',
          );
        }

        if (!transaction.hasAccountingJournal()) {
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
      } else {
        // ---------------------------------------------------------------------
        // 16. Ensure no unresolved journal link exists.
        // ---------------------------------------------------------------------

        if (transaction.hasAccountingJournal()) {
          throw new Error(
            'Financial Transaction references an Accounting Journal that was not found by its disbursement posting source.',
          );
        }

        // ---------------------------------------------------------------------
        // 17. Resolve the Accounting Period.
        // ---------------------------------------------------------------------

        const containingPeriods =
          await this.accountingPeriodRepository.findContainingDate(entryDate);

        if (containingPeriods.length !== 1) {
          throw new Error(
            `Expected exactly one Accounting Period for disbursement date ${entryDate.toISOString()}, found ${containingPeriods.length}.`,
          );
        }

        const accountingPeriod = containingPeriods[0];

        if (accountingPeriod === undefined) {
          throw new Error(
            'Unable to retrieve the Accounting Period for the disbursement date.',
          );
        }

        if (!accountingPeriod.contains(entryDate)) {
          throw new Error(
            'Resolved Accounting Period does not contain the disbursement date.',
          );
        }

        if (
          !accountingPeriod.isUsable() ||
          !accountingPeriod.canAcceptJournals()
        ) {
          throw new Error(
            `Accounting Period "${accountingPeriod.publicId.value}" cannot accept journals.`,
          );
        }

        // ---------------------------------------------------------------------
        // 18. Resolve General Ledger accounts.
        // ---------------------------------------------------------------------

        const walletPayableGlAccount =
          await this.accountingAccountRepository.findByCode(
            AccountingAccountCode.create(USER_WALLET_PAYABLE_GL_CODE),
          );

        if (walletPayableGlAccount === null) {
          throw new Error(
            `General Ledger account ${USER_WALLET_PAYABLE_GL_CODE} was not found.`,
          );
        }

        const mpesaFloatGlAccount =
          await this.accountingAccountRepository.findByCode(
            AccountingAccountCode.create(MPESA_OPERATING_FLOAT_GL_CODE),
          );

        if (mpesaFloatGlAccount === null) {
          throw new Error(
            `General Ledger account ${MPESA_OPERATING_FLOAT_GL_CODE} was not found.`,
          );
        }

        // ---------------------------------------------------------------------
        // 19. Validate General Ledger account classifications and availability.
        // ---------------------------------------------------------------------

        if (!walletPayableGlAccount.type.isLiability()) {
          throw new Error(
            `General Ledger account ${USER_WALLET_PAYABLE_GL_CODE} must be a LIABILITY account.`,
          );
        }

        if (!mpesaFloatGlAccount.type.isAsset()) {
          throw new Error(
            `General Ledger account ${MPESA_OPERATING_FLOAT_GL_CODE} must be an ASSET account.`,
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

        if (
          !mpesaFloatGlAccount.isUsable() ||
          !mpesaFloatGlAccount.canReceivePostings()
        ) {
          throw new Error(
            `General Ledger account ${MPESA_OPERATING_FLOAT_GL_CODE} cannot receive postings.`,
          );
        }

        if (walletPayableGlAccount.id.equals(mpesaFloatGlAccount.id)) {
          throw new Error(
            'Wallet payable and M-PESA operating float GL accounts must be different.',
          );
        }

        // ---------------------------------------------------------------------
        // 20. Build the Accounting Journal.
        // ---------------------------------------------------------------------

        const accountingCurrency = AccountingCurrency.create(currency.value);

        if (!accountingCurrency.isKes()) {
          throw new Error(
            `Disbursement accounting supports KES only. Received "${currency.value}".`,
          );
        }

        // AccountingAmount uses the Financial Money integer amount directly.
        const accountingAmount = AccountingAmount.create(amount);

        const journalEntity = AccountingJournalEntity.create(
          accountingCurrency,
          accountingPeriod.id,
          accountingPeriod.publicId,
          now,
        );

        const journalAggregate =
          AccountingJournalAggregate.create(journalEntity);

        const journalEntry = AccountingJournalEntryEntity.create(
          entryDate,
          `M-PESA successful B2C disbursement ${disbursement.publicId.value}`,
          [],
          now,
        );

        // DR 2111 — Reduce the wallet liability.
        const walletPayableDebitLine = AccountingJournalLineEntity.create(
          walletPayableGlAccount.id,
          AccountingJournalLineType.debit(),
          accountingAmount,
          accountingCurrency,
          'User wallet balances payable',
          now,
        );

        // CR 1112 — Reduce the M-PESA operating float asset.
        const mpesaFloatCreditLine = AccountingJournalLineEntity.create(
          mpesaFloatGlAccount.id,
          AccountingJournalLineType.credit(),
          accountingAmount,
          accountingCurrency,
          'M-PESA operating float',
          now,
        );

        journalEntry.addLine(walletPayableDebitLine);
        journalEntry.addLine(mpesaFloatCreditLine);

        journalAggregate.addEntry(journalEntry);

        // ---------------------------------------------------------------------
        // 21. Attach the Accounting posting reference.
        // ---------------------------------------------------------------------

        const postingReference = AccountingPostingReferenceEntity.create(
          sourceType,
          disbursement.publicId.value,
          now,
        );

        journalAggregate.setPostingReference(postingReference);

        // ---------------------------------------------------------------------
        // 22. Validate and post the Accounting Journal.
        // ---------------------------------------------------------------------

        if (!journalAggregate.canPost()) {
          throw new Error(
            `Accounting Journal for disbursement "${disbursement.publicId.value}" is not ready for posting.`,
          );
        }

        if (!journalAggregate.isBalanced()) {
          throw new Error(
            `Accounting Journal for disbursement "${disbursement.publicId.value}" is not balanced.`,
          );
        }

        journalAggregate.post(command.correlationId, command.causationId, now);

        if (!journalAggregate.isPosted()) {
          throw new Error('Disbursement Accounting Journal was not posted.');
        }

        // ---------------------------------------------------------------------
        // 23. Associate the posted journal with the completed transaction.
        // ---------------------------------------------------------------------

        transaction.associateAccountingJournalAfterCompletion(
          journalAggregate.publicId.value,
          now,
        );

        // ---------------------------------------------------------------------
        // 24. Persist the Accounting Journal and transaction link.
        // ---------------------------------------------------------------------

        await this.accountingJournalRepository.save(journalAggregate);

        await this.transactionRepository.save(transaction);

        // ---------------------------------------------------------------------
        // 25. Publish Accounting and transaction domain events.
        // ---------------------------------------------------------------------

        const accountingEvents = [
          ...journalAggregate.pullDomainEvents(),
          ...transaction.pullDomainEvents(),
        ];

        if (accountingEvents.length > 0) {
          await this.eventPublisher.publishAll(accountingEvents);
        }
      }

      // -----------------------------------------------------------------------
      // 26. Complete the Financial Disbursement.
      // -----------------------------------------------------------------------

      if (!disbursement.isCompleted()) {
        if (!disbursement.canComplete()) {
          throw new Error(
            `Disbursement "${disbursement.publicId.value}" cannot be completed from its current state.`,
          );
        }

        disbursement.complete(now, command.correlationId, command.causationId);

        await this.disbursementRepository.save(disbursement);

        const disbursementEvents = disbursement.pullDomainEvents();

        if (disbursementEvents.length > 0) {
          await this.eventPublisher.publishAll(disbursementEvents);
        }
      }

      return disbursement;
    });
  }
}

export default CompleteFinancialDisbursementHandler;
