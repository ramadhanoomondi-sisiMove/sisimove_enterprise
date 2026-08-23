// -----------------------------------------------------------------------------
// Financial Transaction Aggregate
// -----------------------------------------------------------------------------
//
// Aggregate boundary:
//
// FinancialTransactionAggregate
// ├── FinancialTransactionEntity
// └── FinancialTransactionEntryEntity[]
//
// The Financial Transaction aggregate is the authoritative domain boundary for:
//
// - transaction identity;
// - transaction type;
// - transaction lifecycle;
// - transaction amount;
// - transaction currency;
// - source/destination account references;
// - business reference;
// - transaction entries;
// - debit/credit integrity;
// - transaction lifecycle transitions;
// - transaction event emission.
//
// The aggregate does NOT own:
//
// - Financial Account lifecycle;
// - Financial Account balances;
// - payment lifecycle;
// - settlement lifecycle;
// - withdrawal lifecycle;
// - disbursement lifecycle;
// - accounting journal entries.
//
// Account balance mutations remain within the Financial Account domain.
//
// Accounting semantics remain within the Accounting bounded context.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import { FinancialTransactionEntity } from '../entities/financial-transaction.entity';

import { FinancialTransactionEntryEntity } from '../entities/financial-transaction-entry.entity';

// -----------------------------------------------------------------------------
// Domain Events
// -----------------------------------------------------------------------------

import { FinancialTransactionCreatedEvent } from '../events/financial-transaction-created.event';

import { FinancialTransactionCompletedEvent } from '../events/financial-transaction-completed.event';

import { FinancialTransactionFailedEvent } from '../events/financial-transaction-failed.event';

import { FinancialTransactionReversedEvent } from '../events/financial-transaction-reversed.event';

import { FinancialTransactionCancelledEvent } from '../events/financial-transaction-cancelled.event';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import { FinancialInvariantException } from '../exceptions/financial-invariant.exception';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type {
  Currency,
  FinancialAccountReference,
  FinancialTransactionEntryPublicId,
  FinancialTransactionEntryType,
  FinancialTransactionReference,
  FinancialTransactionStatus,
  FinancialTransactionType,
  FinancialBalanceType,
} from '../value-objects';
import { Money } from '../value-objects';

import {
  FinancialTransactionEntryPublicId as FinancialTransactionEntryPublicIdVO,
  FinancialTransactionPublicId as FinancialTransactionPublicIdVO,
  FinancialTransactionStatus as FinancialTransactionStatusVO,
} from '../value-objects';

// -----------------------------------------------------------------------------
// Creation Props
// -----------------------------------------------------------------------------

/**
 * Business inputs required to create a Financial Transaction aggregate.
 *
 * The aggregate owns:
 *
 * - transaction public identity;
 * - transaction lifecycle;
 * - transaction entity;
 * - transaction entries;
 * - transaction creation event.
 */
export interface CreateFinancialTransactionAggregateProps {
  /**
   * Business classification of the transaction.
   */
  type: FinancialTransactionType;

  /**
   * Source account involved in the transaction.
   *
   * Optional because some transactions originate outside the platform.
   */
  sourceAccount?: FinancialAccountReference;

  /**
   * Destination account involved in the transaction.
   *
   * Optional because some transactions terminate outside the platform.
   */
  destinationAccount?: FinancialAccountReference;

  /**
   * Transaction amount.
   *
   * Amount is represented in integer minor units.
   */
  amount: Money;

  /**
   * Business operation that caused or is associated with the transaction.
   */
  reference?: FinancialTransactionReference;
}

// -----------------------------------------------------------------------------
// Transaction Entry Input
// -----------------------------------------------------------------------------

/**
 * Business input used when adding an entry to a Financial Transaction.
 *
 * The account is represented as an opaque FinancialAccountReference.
 *
 * The Financial Transaction aggregate does not own the referenced
 * FinancialAccountAggregate.
 */
export interface AddFinancialTransactionEntryProps {
  /**
   * Financial account affected by this entry.
   */
  account: FinancialAccountReference;

  /**
   * Debit or credit direction.
   */
  type: FinancialTransactionEntryType;

  /**
   * Balance classification affected by the entry.
   *
   * Examples:
   *
   * - AVAILABLE
   * - PENDING
   * - HELD
   */
  balanceType: FinancialBalanceType;

  /**
   * Entry amount.
   *
   * Currency must match the transaction currency.
   */
  amount: Money;
}

// -----------------------------------------------------------------------------
// Aggregate Props
// -----------------------------------------------------------------------------

interface FinancialTransactionAggregateProps {
  transaction: FinancialTransactionEntity;

  entries: FinancialTransactionEntryEntity[];
}

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

export class FinancialTransactionAggregate extends AggregateRoot<FinancialTransactionAggregateProps> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(props: FinancialTransactionAggregateProps) {
    super(props, props.transaction.id, props.transaction.publicId);
  }

  // ===========================================================================
  // Factory — Create
  // ===========================================================================

  /**
   * Creates a new Financial Transaction aggregate.
   *
   * A newly-created transaction always starts in PENDING state.
   *
   * A transaction may initially have zero entries.
   *
   * Entries are subsequently added through addEntry().
   */
  public static create(
    props: CreateFinancialTransactionAggregateProps,
    correlationId: string,
    createdAt: Date = new Date(),
  ): FinancialTransactionAggregate {
    // -------------------------------------------------------------------------
    // Required transaction type
    // -------------------------------------------------------------------------

    if (props.type === undefined) {
      throw new FinancialInvariantException(
        'Financial transaction type is required.',
      );
    }

    // -------------------------------------------------------------------------
    // Required amount
    // -------------------------------------------------------------------------

    if (props.amount === undefined) {
      throw new FinancialInvariantException(
        'Financial transaction amount is required.',
      );
    }

    // -------------------------------------------------------------------------
    // Positive amount
    // -------------------------------------------------------------------------

    if (!props.amount.isPositive()) {
      throw new FinancialInvariantException(
        'Financial transaction amount must be greater than zero.',
      );
    }

    // -------------------------------------------------------------------------
    // Account configuration
    // -------------------------------------------------------------------------

    FinancialTransactionAggregate.ensureAccountConfiguration(
      props.sourceAccount,
      props.destinationAccount,
    );

    // -------------------------------------------------------------------------
    // Initial lifecycle
    // -------------------------------------------------------------------------

    const status = FinancialTransactionStatusVO.create('PENDING');

    // -------------------------------------------------------------------------
    // Generate transaction identity
    // -------------------------------------------------------------------------

    const publicId = new FinancialTransactionPublicIdVO();

    // -------------------------------------------------------------------------
    // Create transaction entity
    // -------------------------------------------------------------------------

    const transaction = FinancialTransactionEntity.create({
      publicId,

      type: props.type,

      status,

      sourceAccount: props.sourceAccount,

      destinationAccount: props.destinationAccount,

      amount: props.amount,

      reference: props.reference,

      accountingJournalPublicId: undefined,

      completedAt: undefined,

      failedAt: undefined,

      reversedAt: undefined,

      cancelledAt: undefined,

      createdAt,

      updatedAt: createdAt,
    });

    // -------------------------------------------------------------------------
    // Construct aggregate
    // -------------------------------------------------------------------------

    const aggregate = new FinancialTransactionAggregate({
      transaction,

      entries: [],
    });

    // -------------------------------------------------------------------------
    // Validate aggregate
    // -------------------------------------------------------------------------

    aggregate.ensureAggregateConsistency();

    // -------------------------------------------------------------------------
    // Record creation event
    // -------------------------------------------------------------------------

    aggregate.addDomainEvent(
      new FinancialTransactionCreatedEvent(
        aggregate.id.value,
        aggregate.publicId,
        aggregate.type,
        aggregate.status,
        aggregate.amount,
        aggregate.sourceAccount,
        aggregate.destinationAccount,
        aggregate.reference,
        aggregate.accountingJournalPublicId,
        correlationId,
      ),
    );

    return aggregate;
  }

  // ===========================================================================
  // Factory — Rehydrate
  // ===========================================================================

  /**
   * Rehydrates an existing Financial Transaction aggregate.
   *
   * Rehydration never creates domain events.
   */
  public static rehydrate(
    transaction: FinancialTransactionEntity,
    entries: FinancialTransactionEntryEntity[],
  ): FinancialTransactionAggregate {
    const aggregate = new FinancialTransactionAggregate({
      transaction,

      entries: [...entries],
    });

    aggregate.ensureAggregateConsistency();

    return aggregate;
  }

  // ===========================================================================
  // Aggregate State
  // ===========================================================================

  /**
   * Returns the transaction entity owned by this aggregate.
   *
   * Consumers should prefer aggregate behavior over direct entity mutation.
   */
  public get transaction(): FinancialTransactionEntity {
    return this.props.transaction;
  }

  /**
   * Returns an immutable view of the transaction entries.
   */
  public get entries(): readonly FinancialTransactionEntryEntity[] {
    return this.props.entries;
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  override get id(): typeof this.transaction.id {
    return this.transaction.id;
  }

  override get publicId(): typeof this.transaction.publicId {
    return this.transaction.publicId;
  }

  // ===========================================================================
  // Transaction Properties
  // ===========================================================================

  public get type(): FinancialTransactionType {
    return this.transaction.type;
  }

  public get status(): FinancialTransactionStatus {
    return this.transaction.status;
  }

  public get amount(): Money {
    return this.transaction.amount;
  }

  /**
   * Currency is derived from Money.
   *
   * Currency is intentionally not duplicated on the transaction entity.
   */
  public get currency(): Currency {
    return this.transaction.amount.currency;
  }

  public get sourceAccount(): FinancialAccountReference | undefined {
    return this.transaction.sourceAccount;
  }

  public get destinationAccount(): FinancialAccountReference | undefined {
    return this.transaction.destinationAccount;
  }

  public get reference(): FinancialTransactionReference | undefined {
    return this.transaction.reference;
  }

  public get accountingJournalPublicId(): string | undefined {
    return this.transaction.accountingJournalPublicId;
  }

  public get createdAt(): Date {
    return this.transaction.createdAt;
  }

  public get updatedAt(): Date {
    return this.transaction.updatedAt;
  }

  // ===========================================================================
  // Account Queries
  // ===========================================================================

  public hasSourceAccount(): boolean {
    return this.transaction.hasSourceAccount();
  }

  public hasDestinationAccount(): boolean {
    return this.transaction.hasDestinationAccount();
  }

  public hasAccountReference(): boolean {
    return this.transaction.hasAccountReference();
  }

  public isBetweenAccounts(): boolean {
    return this.transaction.isBetweenAccounts();
  }

  public involvesAccount(account: FinancialAccountReference): boolean {
    return this.transaction.involvesAccount(account);
  }

  // ===========================================================================
  // Business Reference
  // ===========================================================================

  public hasReference(): boolean {
    return this.transaction.hasReference();
  }

  // ===========================================================================
  // Accounting Reference
  // ===========================================================================

  /**
   * Returns whether Accounting has associated a journal with this transaction.
   */
  public hasAccountingJournal(): boolean {
    return this.transaction.hasAccountingJournal();
  }

  /**
   * Associates this transaction with an Accounting Journal.
   *
   * This is intentionally only an opaque cross-domain reference.
   *
   * The Financial domain does not own the Accounting Journal.
   */
  public setAccountingJournalPublicId(
    accountingJournalPublicId: string | undefined,
  ): void {
    this.ensurePending();

    this.transaction.setAccountingJournalPublicId(accountingJournalPublicId);
  }

  // ===========================================================================
  // Lifecycle Queries
  // ===========================================================================

  public isPending(): boolean {
    return this.status.isPending();
  }

  public isCompleted(): boolean {
    return this.status.isCompleted();
  }

  public isFailed(): boolean {
    return this.status.isFailed();
  }

  public isReversed(): boolean {
    return this.status.isReversed();
  }

  public isCancelled(): boolean {
    return this.status.isCancelled();
  }

  public isTerminal(): boolean {
    return this.status.isTerminal();
  }

  public isSuccessful(): boolean {
    return this.status.isSuccessful();
  }

  // ===========================================================================
  // Entry Queries
  // ===========================================================================

  /**
   * Number of entries belonging to this transaction.
   */
  public get entryCount(): number {
    return this.props.entries.length;
  }

  /**
   * Total debit amount.
   */
  public get totalDebits(): Money {
    return this.sumEntries('DEBIT');
  }

  /**
   * Total credit amount.
   */
  public get totalCredits(): Money {
    return this.sumEntries('CREDIT');
  }

  /**
   * Determines whether debit and credit totals are equal.
   */
  public isBalanced(): boolean {
    return this.totalDebits.amount === this.totalCredits.amount;
  }

  /**
   * Determines whether the transaction contains at least one debit
   * and one credit entry.
   */
  public hasDoubleEntry(): boolean {
    return this.hasDebitEntry() && this.hasCreditEntry();
  }

  public hasDebitEntry(): boolean {
    return this.props.entries.some((entry) => entry.type.isDebit());
  }

  public hasCreditEntry(): boolean {
    return this.props.entries.some((entry) => entry.type.isCredit());
  }

  // ===========================================================================
  // Entry Queries — Account
  // ===========================================================================

  /**
   * Returns all entries belonging to an account.
   */
  public entriesForAccount(
    account: FinancialAccountReference,
  ): readonly FinancialTransactionEntryEntity[] {
    return this.props.entries.filter((entry) =>
      entry.belongsToAccount(account),
    );
  }

  /**
   * Determines whether an account has an entry in this transaction.
   */
  public hasEntryForAccount(account: FinancialAccountReference): boolean {
    return this.props.entries.some((entry) => entry.belongsToAccount(account));
  }

  // ===========================================================================
  // Entry Management — Add
  // ===========================================================================

  /**
   * Adds a transaction entry.
   *
   * Entries may only be added while the transaction is PENDING.
   */
  public addEntry(
    props: AddFinancialTransactionEntryProps,
    at: Date = new Date(),
  ): FinancialTransactionEntryEntity {
    this.ensurePending();

    // -------------------------------------------------------------------------
    // Required account
    // -------------------------------------------------------------------------

    if (props.account === undefined) {
      throw new FinancialInvariantException(
        'Financial transaction entry account is required.',
      );
    }

    // -------------------------------------------------------------------------
    // Required type
    // -------------------------------------------------------------------------

    if (props.type === undefined) {
      throw new FinancialInvariantException(
        'Financial transaction entry type is required.',
      );
    }

    // -------------------------------------------------------------------------
    // Required balance type
    // -------------------------------------------------------------------------

    if (props.balanceType === undefined) {
      throw new FinancialInvariantException(
        'Financial transaction entry balance type is required.',
      );
    }

    // -------------------------------------------------------------------------
    // Required amount
    // -------------------------------------------------------------------------

    if (props.amount === undefined) {
      throw new FinancialInvariantException(
        'Financial transaction entry amount is required.',
      );
    }

    // -------------------------------------------------------------------------
    // Positive amount
    // -------------------------------------------------------------------------

    if (!props.amount.isPositive()) {
      throw new FinancialInvariantException(
        'Financial transaction entry amount must be greater than zero.',
      );
    }

    // -------------------------------------------------------------------------
    // Currency consistency
    // -------------------------------------------------------------------------

    if (!props.amount.currency.equals(this.currency)) {
      throw new FinancialInvariantException(
        'Financial transaction entry currency does not match transaction currency.',
      );
    }

    // -------------------------------------------------------------------------
    // Generate entry identity
    // -------------------------------------------------------------------------

    const publicId = new FinancialTransactionEntryPublicIdVO();

    // -------------------------------------------------------------------------
    // Create entry
    // -------------------------------------------------------------------------

    const entry = FinancialTransactionEntryEntity.create({
      publicId,

      transactionId: this.id,

      account: props.account,

      type: props.type,

      balanceType: props.balanceType,

      amount: props.amount,

      createdAt: at,
    });

    // -------------------------------------------------------------------------
    // Add entry
    // -------------------------------------------------------------------------

    this.props.entries.push(entry);

    // -------------------------------------------------------------------------
    // Update transaction timestamp
    // -------------------------------------------------------------------------

    this.transaction.setUpdatedAt(at);

    // -------------------------------------------------------------------------
    // Validate aggregate
    // -------------------------------------------------------------------------

    this.ensureAggregateConsistency();

    return entry;
  }

  // ===========================================================================
  // Entry Management — Remove
  // ===========================================================================

  /**
   * Removes an entry while the transaction remains PENDING.
   *
   * Historical transaction entries become immutable once the transaction
   * reaches a terminal state.
   */
  public removeEntry(
    entryPublicId: FinancialTransactionEntryPublicId,
    at: Date = new Date(),
  ): void {
    this.ensurePending();

    const index = this.props.entries.findIndex((entry) =>
      entry.publicId.equals(entryPublicId),
    );

    if (index === -1) {
      throw new FinancialInvariantException(
        'Financial transaction entry does not belong to this transaction.',
      );
    }

    this.props.entries.splice(index, 1);

    this.transaction.setUpdatedAt(at);

    this.ensureAggregateConsistency();
  }

  // ===========================================================================
  // Lifecycle — Complete
  // ===========================================================================

  /**
   * Completes the Financial Transaction.
   *
   * Completion requires:
   *
   * - at least one entry;
   * - at least one debit;
   * - at least one credit;
   * - balanced debit and credit totals;
   * - debit total equal to transaction amount;
   * - credit total equal to transaction amount.
   *
   * Once completed, transaction entries are immutable.
   */
  public complete(correlationId: string, completedAt: Date = new Date()): void {
    this.ensurePending();

    // -------------------------------------------------------------------------
    // Entries required
    // -------------------------------------------------------------------------

    if (this.props.entries.length === 0) {
      throw new FinancialInvariantException(
        'Financial transaction cannot be completed without entries.',
      );
    }

    // -------------------------------------------------------------------------
    // Double-entry required
    // -------------------------------------------------------------------------

    if (!this.hasDoubleEntry()) {
      throw new FinancialInvariantException(
        'Financial transaction must contain at least one debit and one credit entry.',
      );
    }

    // -------------------------------------------------------------------------
    // Debit/credit balance
    // -------------------------------------------------------------------------

    if (!this.isBalanced()) {
      throw new FinancialInvariantException(
        'Financial transaction debits and credits must balance.',
      );
    }

    // -------------------------------------------------------------------------
    // Debit total
    // -------------------------------------------------------------------------

    if (this.totalDebits.amount !== this.amount.amount) {
      throw new FinancialInvariantException(
        'Financial transaction debit total must equal transaction amount.',
      );
    }

    // -------------------------------------------------------------------------
    // Credit total
    // -------------------------------------------------------------------------

    if (this.totalCredits.amount !== this.amount.amount) {
      throw new FinancialInvariantException(
        'Financial transaction credit total must equal transaction amount.',
      );
    }

    // -------------------------------------------------------------------------
    // Apply lifecycle transition
    // -------------------------------------------------------------------------

    this.transaction.setStatus(
      FinancialTransactionStatusVO.create('COMPLETED'),
    );

    this.transaction.setUpdatedAt(completedAt);

    // -------------------------------------------------------------------------
    // Record event
    // -------------------------------------------------------------------------

    this.addDomainEvent(
      new FinancialTransactionCompletedEvent(
        this.id.value,
        this.publicId,
        this.type,
        this.amount,
        this.sourceAccount,
        this.destinationAccount,
        this.reference,
        completedAt,
        this.accountingJournalPublicId,
        correlationId,
      ),
    );
  }

  // ===========================================================================
  // Lifecycle — Fail
  // ===========================================================================

  /**
   * Marks a pending transaction as failed.
   *
   * Failure is terminal.
   */
  public fail(
    correlationId: string,
    failedAt: Date = new Date(),
    reason?: string,
  ): void {
    this.ensurePending();

    this.transaction.setStatus(FinancialTransactionStatusVO.create('FAILED'));

    this.transaction.setUpdatedAt(failedAt);

    // -------------------------------------------------------------------------
    // Record event
    // -------------------------------------------------------------------------

    this.addDomainEvent(
      new FinancialTransactionFailedEvent(
        this.id.value,
        this.publicId,
        this.type,
        this.amount,
        this.sourceAccount,
        this.destinationAccount,
        this.reference,
        failedAt,
        reason,
        correlationId,
      ),
    );
  }

  // ===========================================================================
  // Lifecycle — Cancel
  // ===========================================================================

  /**
   * Cancels a pending transaction.
   *
   * Cancellation is terminal.
   */
  public cancel(
    correlationId: string,
    cancelledAt: Date = new Date(),
    reason?: string,
  ): void {
    this.ensurePending();

    this.transaction.setStatus(
      FinancialTransactionStatusVO.create('CANCELLED'),
    );

    this.transaction.setUpdatedAt(cancelledAt);

    // -------------------------------------------------------------------------
    // Record event
    // -------------------------------------------------------------------------

    this.addDomainEvent(
      new FinancialTransactionCancelledEvent(
        this.id.value,
        this.publicId,
        this.type,
        this.amount,
        this.sourceAccount,
        this.destinationAccount,
        this.reference,
        cancelledAt,
        reason,
        correlationId,
      ),
    );
  }

  // ===========================================================================
  // Lifecycle — Reverse
  // ===========================================================================

  /**
   * Reverses a completed transaction.
   *
   * Historical transaction entries are never mutated.
   *
   * The compensating movement must be represented by a separate financial
   * transaction.
   */
  public reverse(
    correlationId: string,
    reversedAt: Date = new Date(),
    reason?: string,
  ): void {
    if (!this.isCompleted()) {
      throw new FinancialInvariantException(
        'Only a completed financial transaction can be reversed.',
      );
    }

    this.transaction.setStatus(FinancialTransactionStatusVO.create('REVERSED'));

    this.transaction.setUpdatedAt(reversedAt);

    // -------------------------------------------------------------------------
    // Record event
    // -------------------------------------------------------------------------

    this.addDomainEvent(
      new FinancialTransactionReversedEvent(
        this.id.value,
        this.publicId,
        this.type,
        this.amount,
        this.sourceAccount,
        this.destinationAccount,
        this.reference,
        reversedAt,
        this.accountingJournalPublicId,
        reason,
        correlationId,
      ),
    );
  }

  // ===========================================================================
  // Lifecycle Guards
  // ===========================================================================

  /**
   * Ensures transaction mutations are allowed.
   */
  private ensurePending(): void {
    if (!this.isPending()) {
      throw new FinancialInvariantException(
        'Financial transaction can only be modified while pending.',
      );
    }
  }

  // ===========================================================================
  // Aggregate Consistency
  // ===========================================================================

  /**
   * Validates the internal consistency of the aggregate.
   *
   * Invariants:
   *
   * - transaction amount is positive;
   * - source and destination accounts cannot be identical;
   * - every entry belongs to this transaction;
   * - every entry has a valid account reference;
   * - every entry amount is positive;
   * - every entry uses the transaction currency;
   * - all monetary values use the same currency.
   *
   * Balance equality is required at completion, not while PENDING.
   */
  private ensureAggregateConsistency(): void {
    // -------------------------------------------------------------------------
    // Transaction amount
    // -------------------------------------------------------------------------

    if (!this.amount.isPositive()) {
      throw new FinancialInvariantException(
        'Financial transaction amount must be greater than zero.',
      );
    }

    // -------------------------------------------------------------------------
    // Source/destination account integrity
    // -------------------------------------------------------------------------

    FinancialTransactionAggregate.ensureAccountConfiguration(
      this.sourceAccount,
      this.destinationAccount,
    );

    // -------------------------------------------------------------------------
    // Entry integrity
    // -------------------------------------------------------------------------

    for (const entry of this.props.entries) {
      // -----------------------------------------------------------------------
      // Ownership
      // -----------------------------------------------------------------------

      if (!entry.transactionId.equals(this.id)) {
        throw new FinancialInvariantException(
          'Financial transaction entry does not belong to its transaction.',
        );
      }

      // -----------------------------------------------------------------------
      // Currency
      // -----------------------------------------------------------------------

      if (!entry.amount.currency.equals(this.currency)) {
        throw new FinancialInvariantException(
          'Financial transaction entry currency does not match transaction currency.',
        );
      }

      // -----------------------------------------------------------------------
      // Amount
      // -----------------------------------------------------------------------

      if (!entry.amount.isPositive()) {
        throw new FinancialInvariantException(
          'Financial transaction entry amount must be greater than zero.',
        );
      }

      // -----------------------------------------------------------------------
      // Account
      // -----------------------------------------------------------------------

      if (entry.account === undefined) {
        throw new FinancialInvariantException(
          'Financial transaction entry account reference is required.',
        );
      }
    }
  }

  // ===========================================================================
  // Entry Summation
  // ===========================================================================

  /**
   * Calculates the total amount for entries of the supplied direction.
   */
  private sumEntries(direction: 'DEBIT' | 'CREDIT'): Money {
    let total = Money.zero(this.currency);

    for (const entry of this.props.entries) {
      const matchesDirection =
        direction === 'DEBIT' ? entry.type.isDebit() : entry.type.isCredit();

      if (matchesDirection) {
        total = total.add(entry.amount);
      }
    }

    return total;
  }

  // ===========================================================================
  // Static Guards
  // ===========================================================================

  /**
   * Validates the source/destination account configuration.
   *
   * Both accounts may be absent because some transactions originate from or
   * terminate outside the platform.
   *
   * When both are present, they must identify different accounts.
   */
  private static ensureAccountConfiguration(
    sourceAccount: FinancialAccountReference | undefined,
    destinationAccount: FinancialAccountReference | undefined,
  ): void {
    if (
      sourceAccount !== undefined &&
      destinationAccount !== undefined &&
      sourceAccount.equals(destinationAccount)
    ) {
      throw new FinancialInvariantException(
        'Financial transaction source and destination accounts cannot be the same.',
      );
    }
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { FinancialTransactionAggregateProps };
