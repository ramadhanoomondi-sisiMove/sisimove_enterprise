// -----------------------------------------------------------------------------
// Financial Transaction
// -----------------------------------------------------------------------------
//
// Financial Transaction Entity.
//
// Aggregate boundary:
//
// FinancialTransactionAggregate
// ├── FinancialTransactionEntity
// └── FinancialTransactionEntryEntity[]
//
// The Financial Transaction aggregate is the authoritative domain boundary
// for transaction lifecycle and transaction-entry integrity.
//
// FinancialTransactionEntity owns the transaction's state:
//
// - transaction identity;
// - transaction type;
// - transaction status;
// - source account reference;
// - destination account reference;
// - transaction amount;
// - business reference;
// - accounting journal reference;
// - lifecycle timestamps;
// - audit timestamps.
//
// FinancialTransactionEntryEntity represents the individual account movement
// produced by the transaction.
//
// Important:
//
// This entity does NOT independently enforce transaction lifecycle rules.
// Lifecycle transitions are controlled by FinancialTransactionAggregate.
//
// Accounting remains outside this aggregate and belongs to the Accounting
// bounded context.
//
// The accountingJournalPublicId is therefore only an opaque cross-domain
// reference and does not establish a persistence relation.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type {
  FinancialTransactionPublicId,
  FinancialTransactionType,
  FinancialTransactionStatus,
  FinancialTransactionReference,
  FinancialAccountReference,
  Money,
} from '../value-objects';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import {
  FinancialTransactionInvalidAmountException,
  FinancialTransactionAccountConflictException,
  FinancialInvariantException,
} from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialTransactionProps {
  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Public identity of the Financial Transaction.
   *
   * Independent from the persistence-layer entity ID.
   */
  publicId: FinancialTransactionPublicId;

  // ===========================================================================
  // Transaction Classification
  // ===========================================================================

  /**
   * Business classification of the transaction.
   *
   * This describes what the transaction represents, not its debit/credit
   * direction.
   */
  type: FinancialTransactionType;

  // ===========================================================================
  // Lifecycle
  // ===========================================================================

  /**
   * Current lifecycle status of the transaction.
   */
  status: FinancialTransactionStatus;

  // ===========================================================================
  // Account References
  // ===========================================================================

  /**
   * Source financial account.
   *
   * Optional because the transaction may represent:
   *
   * - external funding;
   * - external payment;
   * - adjustment;
   * - refund;
   * - other one-sided financial movement.
   *
   * This is an opaque reference to FinancialAccountAggregate.
   */
  sourceAccount: FinancialAccountReference | undefined;

  /**
   * Destination financial account.
   *
   * Optional for the same reasons as sourceAccount.
   */
  destinationAccount: FinancialAccountReference | undefined;

  // ===========================================================================
  // Amount
  // ===========================================================================

  /**
   * Total transaction amount.
   *
   * Money contains both amount and currency.
   */
  amount: Money;

  // ===========================================================================
  // Business Reference
  // ===========================================================================

  /**
   * Opaque reference to the business operation that caused this transaction.
   *
   * Examples:
   *
   * - JOURNEY_BOOKING
   * - COMMERCIAL_BOOKING_COMMISSION
   * - PAYMENT
   * - WITHDRAWAL
   * - SETTLEMENT
   * - DISBURSEMENT
   */
  reference: FinancialTransactionReference | undefined;

  // ===========================================================================
  // Accounting Reference
  // ===========================================================================

  /**
   * Public identifier of the Accounting Journal associated with this
   * transaction.
   *
   * This is intentionally an opaque cross-domain reference.
   *
   * The Financial domain does not own the Accounting Journal.
   */
  accountingJournalPublicId: string | undefined;

  // ===========================================================================
  // Lifecycle Timestamps
  // ===========================================================================

  /**
   * Timestamp at which the transaction completed.
   */
  completedAt: Date | undefined;

  /**
   * Timestamp at which the transaction failed.
   */
  failedAt: Date | undefined;

  /**
   * Timestamp at which the transaction was reversed.
   */
  reversedAt: Date | undefined;

  /**
   * Timestamp at which the transaction was cancelled.
   */
  cancelledAt: Date | undefined;

  // ===========================================================================
  // Audit
  // ===========================================================================

  createdAt: Date;

  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

export class FinancialTransactionEntity extends Entity<FinancialTransactionProps> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(props: FinancialTransactionProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // ===========================================================================
  // Factory — Create
  // ===========================================================================

  /**
   * Creates a new Financial Transaction entity.
   *
   * The aggregate is responsible for deciding when this entity may be
   * created and what lifecycle state it should start in.
   *
   * The entity validates only intrinsic state invariants.
   */
  public static create(
    props: FinancialTransactionProps,
  ): FinancialTransactionEntity {
    FinancialTransactionEntity.ensureValidAmount(props.amount);

    FinancialTransactionEntity.ensureAccountConfiguration(
      props.sourceAccount,
      props.destinationAccount,
    );

    FinancialTransactionEntity.ensureLifecycleTimestampConsistency(props);

    return new FinancialTransactionEntity(props);
  }

  // ===========================================================================
  // Factory — Rehydrate
  // ===========================================================================

  /**
   * Rehydrates a persisted Financial Transaction entity.
   *
   * Rehydration does not create domain events.
   */
  public static rehydrate(
    props: FinancialTransactionProps,
    id: UniqueEntityId,
  ): FinancialTransactionEntity {
    FinancialTransactionEntity.ensureValidAmount(props.amount);

    FinancialTransactionEntity.ensureAccountConfiguration(
      props.sourceAccount,
      props.destinationAccount,
    );

    FinancialTransactionEntity.ensureLifecycleTimestampConsistency(props);

    return new FinancialTransactionEntity(props, id);
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  override get publicId(): FinancialTransactionPublicId {
    return this.props.publicId;
  }

  // ===========================================================================
  // Transaction
  // ===========================================================================

  public get type(): FinancialTransactionType {
    return this.props.type;
  }

  public get status(): FinancialTransactionStatus {
    return this.props.status;
  }

  public get amount(): Money {
    return this.props.amount;
  }

  // ===========================================================================
  // Accounts
  // ===========================================================================

  /**
   * Returns the source account reference.
   */
  public get sourceAccount(): FinancialAccountReference | undefined {
    return this.props.sourceAccount;
  }

  /**
   * Returns the destination account reference.
   */
  public get destinationAccount(): FinancialAccountReference | undefined {
    return this.props.destinationAccount;
  }

  public hasSourceAccount(): boolean {
    return this.props.sourceAccount !== undefined;
  }

  public hasDestinationAccount(): boolean {
    return this.props.destinationAccount !== undefined;
  }

  public hasAccountReference(): boolean {
    return this.hasSourceAccount() || this.hasDestinationAccount();
  }

  public involvesAccount(account: FinancialAccountReference): boolean {
    return (
      (this.props.sourceAccount !== undefined &&
        this.props.sourceAccount.equals(account)) ||
      (this.props.destinationAccount !== undefined &&
        this.props.destinationAccount.equals(account))
    );
  }

  public isBetweenAccounts(): boolean {
    return (
      this.props.sourceAccount !== undefined &&
      this.props.destinationAccount !== undefined
    );
  }

  // ===========================================================================
  // Business Reference
  // ===========================================================================

  public get reference(): FinancialTransactionReference | undefined {
    return this.props.reference;
  }

  public hasReference(): boolean {
    return this.props.reference !== undefined;
  }

  // ===========================================================================
  // Accounting Reference
  // ===========================================================================

  public get accountingJournalPublicId(): string | undefined {
    return this.props.accountingJournalPublicId;
  }

  public hasAccountingJournal(): boolean {
    return this.props.accountingJournalPublicId !== undefined;
  }

  /**
   * Associates the transaction with an Accounting Journal.
   *
   * The journal itself belongs to the Accounting domain.
   *
   * The aggregate/application workflow controls when this reference may be
   * established.
   */
  public setAccountingJournalPublicId(
    accountingJournalPublicId: string | undefined,
    updatedAt: Date = new Date(),
  ): void {
    if (
      accountingJournalPublicId !== undefined &&
      accountingJournalPublicId.trim().length === 0
    ) {
      throw new FinancialInvariantException(
        'Accounting journal public ID cannot be empty.',
      );
    }

    this.props.accountingJournalPublicId = accountingJournalPublicId?.trim();

    this.props.updatedAt = updatedAt;
  }

  // ===========================================================================
  // Lifecycle State
  // ===========================================================================

  /**
   * Changes the lifecycle status.
   *
   * Lifecycle transition rules belong to FinancialTransactionAggregate.
   *
   * This method is therefore intentionally a low-level state mutation used
   * only by the aggregate.
   */
  public setStatus(
    status: FinancialTransactionStatus,
    updatedAt: Date = new Date(),
  ): void {
    this.props.status = status;

    this.props.updatedAt = updatedAt;
  }

  // ===========================================================================
  // Lifecycle Timestamps
  // ===========================================================================

  /**
   * Records the completion timestamp.
   *
   * Lifecycle authorization remains with the aggregate.
   */
  public setCompletedAt(completedAt: Date): void {
    this.props.completedAt = completedAt;
    this.props.updatedAt = completedAt;
  }

  /**
   * Records the failure timestamp.
   */
  public setFailedAt(failedAt: Date): void {
    this.props.failedAt = failedAt;
    this.props.updatedAt = failedAt;
  }

  /**
   * Records the reversal timestamp.
   */
  public setReversedAt(reversedAt: Date): void {
    this.props.reversedAt = reversedAt;
    this.props.updatedAt = reversedAt;
  }

  /**
   * Records the cancellation timestamp.
   */
  public setCancelledAt(cancelledAt: Date): void {
    this.props.cancelledAt = cancelledAt;
    this.props.updatedAt = cancelledAt;
  }

  // ===========================================================================
  // Lifecycle Queries
  // ===========================================================================

  public isPending(): boolean {
    return this.props.status.isPending();
  }

  public isCompleted(): boolean {
    return this.props.status.isCompleted();
  }

  public isFailed(): boolean {
    return this.props.status.isFailed();
  }

  public isReversed(): boolean {
    return this.props.status.isReversed();
  }

  public isCancelled(): boolean {
    return this.props.status.isCancelled();
  }

  public isTerminal(): boolean {
    return this.props.status.isTerminal();
  }

  public isSuccessful(): boolean {
    return this.props.status.isSuccessful();
  }

  // ===========================================================================
  // Amount
  // ===========================================================================

  /**
   * Determines whether this transaction uses the supplied currency.
   */
  public usesCurrency(currency: Money['currency']): boolean {
    return this.props.amount.currency.equals(currency);
  }

  // ===========================================================================
  // Lifecycle Timestamps
  // ===========================================================================

  /**
   * Timestamp at which the transaction completed.
   *
   * Read-only access for persistence mapping and domain queries.
   */
  public get completedAt(): Date | undefined {
    return this.props.completedAt;
  }

  /**
   * Timestamp at which the transaction failed.
   *
   * Read-only access for persistence mapping and domain queries.
   */
  public get failedAt(): Date | undefined {
    return this.props.failedAt;
  }

  /**
   * Timestamp at which the transaction was reversed.
   *
   * Read-only access for persistence mapping and domain queries.
   */
  public get reversedAt(): Date | undefined {
    return this.props.reversedAt;
  }

  /**
   * Timestamp at which the transaction was cancelled.
   *
   * Read-only access for persistence mapping and domain queries.
   */
  public get cancelledAt(): Date | undefined {
    return this.props.cancelledAt;
  }

  // ===========================================================================
  // Audit
  // ===========================================================================

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  /**
   * Updates the audit timestamp.
   *
   * Lifecycle authorization remains with the aggregate.
   */
  public setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = updatedAt;
  }

  // ===========================================================================
  // Equality
  // ===========================================================================

  override equals(other?: FinancialTransactionEntity): boolean {
    if (other === undefined) {
      return false;
    }

    return this.id.equals(other.id);
  }

  // ===========================================================================
  // Intrinsic Guards
  // ===========================================================================

  /**
   * Transaction amounts must always be strictly positive.
   *
   * Zero-value transactions do not represent financial movements.
   */
  private static ensureValidAmount(amount: Money): void {
    if (amount.amount <= 0) {
      throw new FinancialTransactionInvalidAmountException();
    }
  }

  /**
   * Source and destination accounts cannot refer to the same account.
   *
   * A same-account adjustment is a different business operation and should
   * not be represented as a transfer between source and destination.
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
      throw new FinancialTransactionAccountConflictException();
    }
  }

  /**
   * Ensures lifecycle timestamps are compatible with the current status.
   *
   * Pending transactions must not have terminal timestamps.
   *
   * Terminal transactions must have the corresponding lifecycle timestamp.
   */
  private static ensureLifecycleTimestampConsistency(
    props: FinancialTransactionProps,
  ): void {
    if (props.status.isPending()) {
      if (
        props.completedAt !== undefined ||
        props.failedAt !== undefined ||
        props.reversedAt !== undefined ||
        props.cancelledAt !== undefined
      ) {
        throw new FinancialInvariantException(
          'Pending financial transaction cannot contain terminal lifecycle timestamps.',
        );
      }

      return;
    }

    if (props.status.isCompleted() && props.completedAt === undefined) {
      throw new FinancialInvariantException(
        'Completed financial transaction must have completedAt.',
      );
    }

    if (props.status.isFailed() && props.failedAt === undefined) {
      throw new FinancialInvariantException(
        'Failed financial transaction must have failedAt.',
      );
    }

    if (props.status.isReversed() && props.reversedAt === undefined) {
      throw new FinancialInvariantException(
        'Reversed financial transaction must have reversedAt.',
      );
    }

    if (props.status.isCancelled() && props.cancelledAt === undefined) {
      throw new FinancialInvariantException(
        'Cancelled financial transaction must have cancelledAt.',
      );
    }
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { FinancialTransactionProps };
