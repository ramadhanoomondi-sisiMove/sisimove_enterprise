// -----------------------------------------------------------------------------
// Financial Transaction Repository
// -----------------------------------------------------------------------------
//
// Domain repository contract for the Financial Transaction aggregate.
//
// Aggregate boundary:
//
// FinancialTransactionAggregate
// ├── FinancialTransactionEntity
// └── FinancialTransactionEntryEntity[]
//
// The Financial Transaction aggregate is the authoritative domain boundary
// for transaction lifecycle, transaction identity, transaction amount,
// account references, business reference, and transaction entries.
//
// Responsibilities:
//
// - Financial Transaction aggregate persistence and rehydration
// - Aggregate identity lookup
// - Transaction lifecycle queries
// - Transaction classification queries
// - Transaction currency queries
// - Account-reference queries
// - Business-reference queries
// - Accounting-reference queries
// - Aggregate-owned entry queries
// - Transaction integrity queries
// - Transaction counting
//
// Persistence concerns such as:
//
// - Prisma models
// - relations/includes
// - joins
// - database transactions
// - pagination
// - indexing
// - optimistic concurrency
// - query optimization
//
// belong to infrastructure.
//
// FinancialTransactionEntryEntity is an entity owned by the
// FinancialTransactionAggregate.
//
// It is therefore NOT an independent aggregate root.
//
// Entry persistence MUST occur atomically with its owning transaction
// aggregate.
//
// The repository MUST NOT expose independent entry persistence operations
// such as:
//
// - saveEntry()
// - deleteEntry()
//
// The following are separate aggregate roots and are intentionally NOT
// managed by this repository:
//
// - FinancialAccountAggregate
// - FinancialPaymentAggregate
// - FinancialAccountHoldAggregate
// - FinancialSettlementAggregate
// - FinancialAccountWithdrawalAggregate
// - FinancialDisbursementAggregate
//
// Cross-domain account references remain opaque domain references.
// They do not create domain relations.
//
// Accounting remains a separate bounded context.
// Accounting journal references are represented only by opaque identifiers.
//
// Financial Transaction history is lifecycle-driven and should not be
// physically deleted as part of normal domain behavior.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { FinancialTransactionAggregate } from '../aggregates/financial-transaction.aggregate';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import type { FinancialTransactionEntity } from '../entities/financial-transaction.entity';

import type { FinancialTransactionEntryEntity } from '../entities/financial-transaction-entry.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type {
  Currency,
  FinancialAccountReference,
  FinancialTransactionEntryPublicId,
  FinancialTransactionEntryType,
  FinancialTransactionPublicId,
  FinancialTransactionReference,
  FinancialTransactionStatus,
  FinancialTransactionType,
  Money,
} from '../value-objects';

// =============================================================================
// Financial Transaction Repository
// =============================================================================

/**
 * Domain repository contract for the Financial Transaction aggregate.
 *
 * Aggregate boundary:
 *
 * FinancialTransactionAggregate
 * ├── FinancialTransactionEntity
 * └── FinancialTransactionEntryEntity[]
 *
 * FinancialTransactionEntryEntity is aggregate-owned and is persisted as
 * part of the Financial Transaction aggregate.
 *
 * The repository exposes persistence and domain-level retrieval capabilities.
 *
 * It does not own or manage:
 *
 * - Financial Account lifecycle
 * - Financial Account balances
 * - Payment lifecycle
 * - Settlement lifecycle
 * - Withdrawal lifecycle
 * - Disbursement lifecycle
 * - Accounting journals
 */
export interface FinancialTransactionRepository {
  // ===========================================================================
  // Aggregate Persistence
  // ===========================================================================

  /**
   * Persists the complete Financial Transaction aggregate.
   *
   * The transaction root and all aggregate-owned entries must be persisted
   * atomically by infrastructure.
   *
   * Infrastructure is responsible for optimistic concurrency control where
   * applicable.
   */
  save(aggregate: FinancialTransactionAggregate): Promise<void>;

  /**
   * Finds and rehydrates a Financial Transaction aggregate by internal
   * identity.
   */
  findById(id: UniqueEntityId): Promise<FinancialTransactionAggregate | null>;

  /**
   * Finds and rehydrates a Financial Transaction aggregate by public
   * identity.
   */
  findByPublicId(
    publicId: FinancialTransactionPublicId,
  ): Promise<FinancialTransactionAggregate | null>;

  /**
   * Determines whether a Financial Transaction exists by internal identity.
   */
  exists(id: UniqueEntityId): Promise<boolean>;

  /**
   * Determines whether a Financial Transaction exists by public identity.
   */
  existsByPublicId(publicId: FinancialTransactionPublicId): Promise<boolean>;

  // ===========================================================================
  // Lifecycle Queries
  // ===========================================================================

  /**
   * Finds transactions by lifecycle status.
   */
  findByStatus(
    status: FinancialTransactionStatus,
  ): Promise<FinancialTransactionAggregate[]>;

  /**
   * Determines whether the specified transaction has the supplied lifecycle
   * status.
   */
  hasStatus(
    id: UniqueEntityId,
    status: FinancialTransactionStatus,
  ): Promise<boolean>;

  /**
   * Finds pending transactions.
   */
  findPending(): Promise<FinancialTransactionAggregate[]>;

  /**
   * Finds completed transactions.
   */
  findCompleted(): Promise<FinancialTransactionAggregate[]>;

  /**
   * Finds failed transactions.
   */
  findFailed(): Promise<FinancialTransactionAggregate[]>;

  /**
   * Finds cancelled transactions.
   */
  findCancelled(): Promise<FinancialTransactionAggregate[]>;

  /**
   * Finds reversed transactions.
   */
  findReversed(): Promise<FinancialTransactionAggregate[]>;

  /**
   * Finds transactions in a terminal lifecycle state.
   */
  findTerminal(): Promise<FinancialTransactionAggregate[]>;

  /**
   * Counts transactions by lifecycle status.
   */
  countByStatus(status: FinancialTransactionStatus): Promise<number>;

  /**
   * Counts all Financial Transactions.
   */
  count(): Promise<number>;

  // ===========================================================================
  // Transaction Classification
  // ===========================================================================

  /**
   * Finds transactions by Financial Transaction type.
   */
  findByType(
    type: FinancialTransactionType,
  ): Promise<FinancialTransactionAggregate[]>;

  /**
   * Finds transactions by type and lifecycle status.
   */
  findByTypeAndStatus(
    type: FinancialTransactionType,
    status: FinancialTransactionStatus,
  ): Promise<FinancialTransactionAggregate[]>;

  /**
   * Counts transactions by type.
   */
  countByType(type: FinancialTransactionType): Promise<number>;

  /**
   * Counts transactions by type and lifecycle status.
   */
  countByTypeAndStatus(
    type: FinancialTransactionType,
    status: FinancialTransactionStatus,
  ): Promise<number>;

  // ===========================================================================
  // Currency Queries
  // ===========================================================================

  /**
   * Finds transactions using the specified currency.
   */
  findByCurrency(currency: Currency): Promise<FinancialTransactionAggregate[]>;

  /**
   * Finds transactions using the specified currency and lifecycle status.
   */
  findByCurrencyAndStatus(
    currency: Currency,
    status: FinancialTransactionStatus,
  ): Promise<FinancialTransactionAggregate[]>;

  /**
   * Determines whether a transaction uses the specified currency.
   */
  usesCurrency(id: UniqueEntityId, currency: Currency): Promise<boolean>;

  /**
   * Determines whether a transaction identified by public identity uses
   * the specified currency.
   */
  usesCurrencyByPublicId(
    publicId: FinancialTransactionPublicId,
    currency: Currency,
  ): Promise<boolean>;

  // ===========================================================================
  // Account Reference Queries
  // ===========================================================================

  /**
   * Finds transactions involving an account.
   *
   * The account is represented by an opaque FinancialAccountReference.
   */
  findByAccount(
    account: FinancialAccountReference,
  ): Promise<FinancialTransactionAggregate[]>;

  /**
   * Finds transactions where the specified account is the source account.
   */
  findBySourceAccount(
    account: FinancialAccountReference,
  ): Promise<FinancialTransactionAggregate[]>;

  /**
   * Finds transactions where the specified account is the destination
   * account.
   */
  findByDestinationAccount(
    account: FinancialAccountReference,
  ): Promise<FinancialTransactionAggregate[]>;

  /**
   * Determines whether a transaction involves an account.
   */
  involvesAccount(
    id: UniqueEntityId,
    account: FinancialAccountReference,
  ): Promise<boolean>;

  /**
   * Determines whether a transaction identified by public identity involves
   * an account.
   */
  involvesAccountByPublicId(
    publicId: FinancialTransactionPublicId,
    account: FinancialAccountReference,
  ): Promise<boolean>;

  /**
   * Counts transactions involving an account.
   */
  countByAccount(account: FinancialAccountReference): Promise<number>;

  /**
   * Counts transactions where the account is the source.
   */
  countBySourceAccount(account: FinancialAccountReference): Promise<number>;

  /**
   * Counts transactions where the account is the destination.
   */
  countByDestinationAccount(
    account: FinancialAccountReference,
  ): Promise<number>;

  // ===========================================================================
  // Business Reference Queries
  // ===========================================================================

  /**
   * Finds transactions associated with a business reference.
   *
   * The FinancialTransactionReference remains opaque to the repository.
   */
  findByReference(
    reference: FinancialTransactionReference,
  ): Promise<FinancialTransactionAggregate[]>;

  /**
   * Determines whether a transaction exists for the supplied business
   * reference.
   */
  existsByReference(reference: FinancialTransactionReference): Promise<boolean>;

  // ===========================================================================
  // Accounting Reference Queries
  // ===========================================================================

  /**
   * Finds the transaction associated with an Accounting Journal.
   *
   * The Accounting Journal remains outside the Financial bounded context.
   */
  findByAccountingJournalPublicId(
    accountingJournalPublicId: string,
  ): Promise<FinancialTransactionAggregate | null>;

  /**
   * Determines whether a transaction has an associated Accounting Journal.
   */
  hasAccountingJournal(id: UniqueEntityId): Promise<boolean>;

  /**
   * Determines whether a transaction identified by public identity has an
   * associated Accounting Journal.
   */
  hasAccountingJournalByPublicId(
    publicId: FinancialTransactionPublicId,
  ): Promise<boolean>;

  /**
   * Finds completed transactions that do not yet have an Accounting Journal
   * reference.
   *
   * This supports asynchronous Financial → Accounting integration.
   */
  findCompletedWithoutAccountingJournal(): Promise<
    FinancialTransactionAggregate[]
  >;

  // ===========================================================================
  // Entry Queries
  // ===========================================================================

  /**
   * Finds all entries belonging to a transaction.
   *
   * Entries remain aggregate-owned entities.
   */
  findEntriesByTransactionId(
    transactionId: UniqueEntityId,
  ): Promise<FinancialTransactionEntryEntity[]>;

  /**
   * Finds all entries belonging to a transaction identified by public
   * identity.
   */
  findEntriesByTransactionPublicId(
    transactionPublicId: FinancialTransactionPublicId,
  ): Promise<FinancialTransactionEntryEntity[]>;

  /**
   * Finds an aggregate-owned transaction entry by public identity.
   */
  findEntryByPublicId(
    entryPublicId: FinancialTransactionEntryPublicId,
  ): Promise<FinancialTransactionEntryEntity | null>;

  /**
   * Determines whether an entry with the supplied public identity exists.
   */
  existsEntryByPublicId(
    entryPublicId: FinancialTransactionEntryPublicId,
  ): Promise<boolean>;

  /**
   * Counts entries belonging to a transaction.
   */
  countEntries(transactionId: UniqueEntityId): Promise<number>;

  // ===========================================================================
  // Entry Account Queries
  // ===========================================================================

  /**
   * Finds transaction entries affecting an account.
   *
   * This is a read operation only. It does not make entries aggregate roots.
   */
  findEntriesByAccount(
    account: FinancialAccountReference,
  ): Promise<FinancialTransactionEntryEntity[]>;

  /**
   * Finds transaction entries affecting an account with the specified
   * debit/credit direction.
   */
  findEntriesByAccountAndType(
    account: FinancialAccountReference,
    type: FinancialTransactionEntryType,
  ): Promise<FinancialTransactionEntryEntity[]>;

  /**
   * Determines whether a transaction contains an entry affecting an account.
   */
  hasEntryForAccount(
    transactionId: UniqueEntityId,
    account: FinancialAccountReference,
  ): Promise<boolean>;

  /**
   * Determines whether a transaction identified by public identity contains
   * an entry affecting an account.
   */
  hasEntryForAccountByPublicId(
    transactionPublicId: FinancialTransactionPublicId,
    account: FinancialAccountReference,
  ): Promise<boolean>;

  /**
   * Counts transaction entries affecting an account.
   */
  countEntriesByAccount(account: FinancialAccountReference): Promise<number>;

  /**
   * Counts transaction entries affecting an account by direction.
   */
  countEntriesByAccountAndType(
    account: FinancialAccountReference,
    type: FinancialTransactionEntryType,
  ): Promise<number>;

  // ===========================================================================
  // Entry Direction Queries
  // ===========================================================================

  /**
   * Finds debit entries belonging to a transaction.
   */
  findDebitEntries(
    transactionId: UniqueEntityId,
  ): Promise<FinancialTransactionEntryEntity[]>;

  /**
   * Finds credit entries belonging to a transaction.
   */
  findCreditEntries(
    transactionId: UniqueEntityId,
  ): Promise<FinancialTransactionEntryEntity[]>;

  /**
   * Determines whether a transaction contains at least one debit entry.
   */
  hasDebitEntry(transactionId: UniqueEntityId): Promise<boolean>;

  /**
   * Determines whether a transaction contains at least one credit entry.
   */
  hasCreditEntry(transactionId: UniqueEntityId): Promise<boolean>;

  /**
   * Determines whether a transaction contains at least one debit and one
   * credit entry.
   */
  hasDoubleEntry(transactionId: UniqueEntityId): Promise<boolean>;

  // ===========================================================================
  // Entry Balance Queries
  // ===========================================================================

  /**
   * Calculates the total debit amount for a transaction.
   *
   * The returned Money uses the transaction currency.
   */
  calculateTotalDebits(transactionId: UniqueEntityId): Promise<Money>;

  /**
   * Calculates the total credit amount for a transaction.
   *
   * The returned Money uses the transaction currency.
   */
  calculateTotalCredits(transactionId: UniqueEntityId): Promise<Money>;

  /**
   * Determines whether transaction debit and credit totals balance.
   */
  isBalanced(transactionId: UniqueEntityId): Promise<boolean>;

  /**
   * Determines whether a transaction identified by public identity is
   * balanced.
   */
  isBalancedByPublicId(
    transactionPublicId: FinancialTransactionPublicId,
  ): Promise<boolean>;

  // ===========================================================================
  // Transaction Amount Queries
  // ===========================================================================

  /**
   * Finds transactions with the specified monetary amount.
   *
   * Money includes both amount and currency.
   */
  findByAmount(amount: Money): Promise<FinancialTransactionAggregate[]>;

  /**
   * Finds transactions using the specified currency and amount.
   */
  findByCurrencyAndAmount(
    currency: Currency,
    amount: Money,
  ): Promise<FinancialTransactionAggregate[]>;

  // ===========================================================================
  // Transaction Integrity Queries
  // ===========================================================================

  /**
   * Finds pending transactions that contain entries.
   *
   * Useful for detecting transactions that have started entry construction
   * but have not yet completed.
   */
  findPendingWithEntries(): Promise<FinancialTransactionAggregate[]>;

  /**
   * Finds pending transactions without entries.
   */
  findPendingWithoutEntries(): Promise<FinancialTransactionAggregate[]>;

  /**
   * Finds completed transactions whose persisted entries are unbalanced.
   *
   * Under normal operation this should return no records.
   */
  findCompletedWithUnbalancedEntries(): Promise<
    FinancialTransactionAggregate[]
  >;

  /**
   * Finds completed transactions whose entry totals do not equal the
   * transaction amount.
   *
   * Under normal operation this should return no records.
   */
  findCompletedWithAmountMismatch(): Promise<FinancialTransactionAggregate[]>;

  /**
   * Finds transactions whose persisted entry currencies do not match the
   * transaction currency.
   *
   * Under normal operation this should return no records.
   */
  findWithEntryCurrencyMismatch(): Promise<FinancialTransactionAggregate[]>;
}
