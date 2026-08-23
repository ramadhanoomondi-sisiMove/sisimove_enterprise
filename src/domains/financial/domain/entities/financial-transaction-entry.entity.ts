// -----------------------------------------------------------------------------
// Financial Transaction Entry
// -----------------------------------------------------------------------------
//
// Financial Transaction Entry Entity.
//
// Represents one account-level movement belonging to a
// FinancialTransactionAggregate.
//
// Example:
//
// FinancialTransaction
// amount = KES 1,000
//
// Entries:
//
// Account A
// DEBIT
// AVAILABLE
// KES 1,000
//
// Account B
// CREDIT
// AVAILABLE
// KES 1,000
//
// The entry does NOT own the transaction lifecycle.
//
// The parent FinancialTransactionAggregate owns:
//
// - transaction lifecycle;
// - transaction status;
// - transaction-level invariants;
// - entry collection;
// - debit/credit balancing;
// - account movement orchestration.
//
// The entry owns only the immutable description of one account-level
// financial movement.
//
// Accounting remains outside this entity and belongs to the Accounting Domain.
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
  FinancialTransactionEntryPublicId,
  FinancialTransactionEntryType,
  FinancialBalanceType,
  FinancialAccountReference,
  Money,
} from '../value-objects';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { FinancialTransactionInvalidEntryException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialTransactionEntryProps {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identity of this transaction entry.
   *
   * This is separate from the persistence-layer entity ID.
   */
  publicId: FinancialTransactionEntryPublicId;

  // ---------------------------------------------------------------------------
  // Parent Transaction
  // ---------------------------------------------------------------------------

  /**
   * Internal identity of the owning Financial Transaction aggregate.
   *
   * Corresponds to FinancialTransactionEntry.transactionId in persistence.
   *
   * The entry does not own the transaction and does not contain the
   * FinancialTransactionEntity itself.
   */
  transactionId: UniqueEntityId;

  // ---------------------------------------------------------------------------
  // Account
  // ---------------------------------------------------------------------------

  /**
   * Financial account affected by this entry.
   *
   * The account is represented through an opaque domain reference rather than
   * embedding or directly owning FinancialAccountEntity.
   */
  account: FinancialAccountReference;

  // ---------------------------------------------------------------------------
  // Entry Classification
  // ---------------------------------------------------------------------------

  /**
   * Debit or credit direction of this entry.
   */
  type: FinancialTransactionEntryType;

  /**
   * Balance bucket affected by this entry.
   *
   * Examples:
   *
   * - AVAILABLE
   * - PENDING
   * - HELD
   */
  balanceType: FinancialBalanceType;

  // ---------------------------------------------------------------------------
  // Amount
  // ---------------------------------------------------------------------------

  /**
   * Monetary amount represented by this entry.
   *
   * Currency is inseparable from the amount through the Money value object.
   */
  amount: Money;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  /**
   * Time at which the entry was created.
   *
   * Transaction entries are immutable after creation.
   */
  createdAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

export class FinancialTransactionEntryEntity extends Entity<FinancialTransactionEntryProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(
    props: FinancialTransactionEntryProps,
    id?: UniqueEntityId,
  ) {
    super(props, id);
  }

  // ---------------------------------------------------------------------------
  // Factory — Create
  // ---------------------------------------------------------------------------

  /**
   * Creates a new Financial Transaction Entry.
   *
   * Entry construction is normally controlled by the
   * FinancialTransactionAggregate.
   */
  public static create(
    props: FinancialTransactionEntryProps,
  ): FinancialTransactionEntryEntity {
    FinancialTransactionEntryEntity.ensureValid(props);

    return new FinancialTransactionEntryEntity(props);
  }

  // ---------------------------------------------------------------------------
  // Factory — Rehydrate
  // ---------------------------------------------------------------------------

  /**
   * Rehydrates an existing Financial Transaction Entry.
   *
   * Rehydration does not perform lifecycle changes and does not create
   * domain events.
   */
  public static rehydrate(
    props: FinancialTransactionEntryProps,
    id: UniqueEntityId,
  ): FinancialTransactionEntryEntity {
    FinancialTransactionEntryEntity.ensureValid(props);

    return new FinancialTransactionEntryEntity(props, id);
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Public identity of the transaction entry.
   */
  override get publicId(): FinancialTransactionEntryPublicId {
    return this.props.publicId;
  }

  // ===========================================================================
  // Parent Transaction
  // ===========================================================================

  /**
   * Internal identity of the owning Financial Transaction aggregate.
   */
  public get transactionId(): UniqueEntityId {
    return this.props.transactionId;
  }

  /**
   * Determines whether this entry belongs to the supplied transaction.
   */
  public belongsToTransaction(transactionId: UniqueEntityId): boolean {
    return this.props.transactionId.equals(transactionId);
  }

  // ===========================================================================
  // Account
  // ===========================================================================

  /**
   * Financial account affected by this entry.
   */
  public get account(): FinancialAccountReference {
    return this.props.account;
  }

  /**
   * Determines whether this entry affects the supplied account.
   */
  public belongsToAccount(account: FinancialAccountReference): boolean {
    return this.props.account.equals(account);
  }

  /**
   * Determines whether this entry references the supplied account public ID.
   */
  public referencesAccount(accountPublicId: string): boolean {
    return this.props.account.publicId === accountPublicId.trim();
  }

  // ===========================================================================
  // Entry Classification
  // ===========================================================================

  /**
   * Debit or credit direction.
   */
  public get type(): FinancialTransactionEntryType {
    return this.props.type;
  }

  /**
   * Balance bucket affected by this entry.
   */
  public get balanceType(): FinancialBalanceType {
    return this.props.balanceType;
  }

  // ===========================================================================
  // Amount
  // ===========================================================================

  /**
   * Monetary amount represented by this entry.
   */
  public get amount(): Money {
    return this.props.amount;
  }

  /**
   * Numeric amount in the currency's smallest supported unit.
   */
  public get amountValue(): number {
    return this.props.amount.amount;
  }

  /**
   * Currency of the entry.
   */
  public get currency(): Money['currency'] {
    return this.props.amount.currency;
  }

  /**
   * Determines whether the entry uses the supplied currency.
   */
  public usesCurrency(currency: Money['currency']): boolean {
    return this.props.amount.currency.equals(currency);
  }

  // ===========================================================================
  // Entry Direction Queries
  // ===========================================================================

  /**
   * Determines whether this is a debit entry.
   */
  public isDebit(): boolean {
    return this.props.type.isDebit();
  }

  /**
   * Determines whether this is a credit entry.
   */
  public isCredit(): boolean {
    return this.props.type.isCredit();
  }

  // ===========================================================================
  // Balance Classification Queries
  // ===========================================================================

  /**
   * Determines whether the entry affects available balance.
   */
  public affectsAvailableBalance(): boolean {
    return this.props.balanceType.isAvailable();
  }

  /**
   * Determines whether the entry affects pending balance.
   */
  public affectsPendingBalance(): boolean {
    return this.props.balanceType.isPending();
  }

  /**
   * Determines whether the entry affects held balance.
   */
  public affectsHeldBalance(): boolean {
    return this.props.balanceType.isHeld();
  }

  // ===========================================================================
  // Balance Movement Queries
  // ===========================================================================

  /**
   * Determines whether this entry increases the affected balance bucket.
   *
   * CREDIT increases the affected account balance.
   */
  public increasesBalance(): boolean {
    return this.isCredit();
  }

  /**
   * Determines whether this entry decreases the affected balance bucket.
   *
   * DEBIT decreases the affected account balance.
   */
  public decreasesBalance(): boolean {
    return this.isDebit();
  }

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * Time at which the entry was created.
   */
  public get createdAt(): Date {
    return this.props.createdAt;
  }

  // ===========================================================================
  // Equality
  // ===========================================================================

  override equals(other?: FinancialTransactionEntryEntity): boolean {
    if (other === undefined) {
      return false;
    }

    return this.id.equals(other.id);
  }

  // ===========================================================================
  // Guards
  // ===========================================================================

  /**
   * Validates the structural invariants of a transaction entry.
   *
   * The aggregate remains responsible for transaction-level invariants such
   * as:
   *
   * - total debit == total credit;
   * - entry currencies matching the transaction currency;
   * - valid account participation;
   * - duplicate account-entry rules;
   * - transaction-level balance semantics.
   */
  private static ensureValid(props: FinancialTransactionEntryProps): void {
    // -------------------------------------------------------------------------
    // Public Identity
    // -------------------------------------------------------------------------

    if (props.publicId === undefined) {
      throw new FinancialTransactionInvalidEntryException();
    }

    // -------------------------------------------------------------------------
    // Parent Transaction
    // -------------------------------------------------------------------------

    if (props.transactionId === undefined) {
      throw new FinancialTransactionInvalidEntryException();
    }

    // -------------------------------------------------------------------------
    // Account
    // -------------------------------------------------------------------------

    if (props.account === undefined) {
      throw new FinancialTransactionInvalidEntryException();
    }

    // -------------------------------------------------------------------------
    // Entry Type
    // -------------------------------------------------------------------------

    if (props.type === undefined) {
      throw new FinancialTransactionInvalidEntryException();
    }

    // -------------------------------------------------------------------------
    // Balance Type
    // -------------------------------------------------------------------------

    if (props.balanceType === undefined) {
      throw new FinancialTransactionInvalidEntryException();
    }

    // -------------------------------------------------------------------------
    // Amount
    // -------------------------------------------------------------------------

    if (props.amount === undefined) {
      throw new FinancialTransactionInvalidEntryException();
    }

    if (props.amount.amount <= 0) {
      throw new FinancialTransactionInvalidEntryException();
    }

    // -------------------------------------------------------------------------
    // Created At
    // -------------------------------------------------------------------------

    if (!(props.createdAt instanceof Date)) {
      throw new FinancialTransactionInvalidEntryException();
    }

    if (Number.isNaN(props.createdAt.getTime())) {
      throw new FinancialTransactionInvalidEntryException();
    }
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { FinancialTransactionEntryProps };
