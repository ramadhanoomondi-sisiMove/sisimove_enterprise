// -----------------------------------------------------------------------------
// Financial Account Balance
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';
import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { Currency } from '../value-objects';
import {
  FinancialAccountAvailableAmount,
  FinancialAccountPendingAmount,
  FinancialAccountHeldAmount,
  FinancialAccountBalanceVersion,
} from '../value-objects';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialAccountBalanceProps {
  /**
   * Internal identity of the owning FinancialAccount.
   *
   * Corresponds to FinancialAccountBalance.accountId in persistence.
   */
  accountId: UniqueEntityId;

  publicId: PublicEntityId;

  availableAmount: FinancialAccountAvailableAmount;
  pendingAmount: FinancialAccountPendingAmount;
  heldAmount: FinancialAccountHeldAmount;

  currency: Currency;

  version: FinancialAccountBalanceVersion;

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

/**
 * Financial Account Balance Entity.
 *
 * Represents the monetary state belonging to a Financial Account aggregate.
 *
 * The entity owns balance mutations.
 * The aggregate owns business rules and invariants.
 */
export class FinancialAccountBalanceEntity extends Entity<FinancialAccountBalanceProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(
    props: FinancialAccountBalanceProps,
    id?: UniqueEntityId,
  ) {
    super(props, id);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(
    props: FinancialAccountBalanceProps,
  ): FinancialAccountBalanceEntity {
    return new FinancialAccountBalanceEntity(props);
  }

  public static rehydrate(
    props: FinancialAccountBalanceProps,
    id: UniqueEntityId,
  ): FinancialAccountBalanceEntity {
    return new FinancialAccountBalanceEntity(props, id);
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  public get accountId(): UniqueEntityId {
    return this.props.accountId;
  }

  override get publicId(): PublicEntityId {
    return this.props.publicId;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  public get availableAmount(): FinancialAccountAvailableAmount {
    return this.props.availableAmount;
  }

  public get pendingAmount(): FinancialAccountPendingAmount {
    return this.props.pendingAmount;
  }

  public get heldAmount(): FinancialAccountHeldAmount {
    return this.props.heldAmount;
  }

  public get currency(): Currency {
    return this.props.currency;
  }

  public get version(): FinancialAccountBalanceVersion {
    return this.props.version;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // ---------------------------------------------------------------------------
  // Available Balance
  // ---------------------------------------------------------------------------

  public increaseAvailable(amount: number): void {
    this.ensurePositiveAmount(amount);

    this.props.availableAmount = FinancialAccountAvailableAmount.create(
      this.props.availableAmount.value + amount,
    );

    this.incrementVersion();
  }

  public decreaseAvailable(amount: number): void {
    this.ensurePositiveAmount(amount);

    if (this.props.availableAmount.value < amount) {
      throw new Error(
        'Financial account available balance cannot become negative.',
      );
    }

    this.props.availableAmount = FinancialAccountAvailableAmount.create(
      this.props.availableAmount.value - amount,
    );

    this.incrementVersion();
  }

  // ---------------------------------------------------------------------------
  // Pending Balance
  // ---------------------------------------------------------------------------

  public increasePending(amount: number): void {
    this.ensurePositiveAmount(amount);

    this.props.pendingAmount = FinancialAccountPendingAmount.create(
      this.props.pendingAmount.value + amount,
    );

    this.incrementVersion();
  }

  public decreasePending(amount: number): void {
    this.ensurePositiveAmount(amount);

    if (this.props.pendingAmount.value < amount) {
      throw new Error(
        'Financial account pending balance cannot become negative.',
      );
    }

    this.props.pendingAmount = FinancialAccountPendingAmount.create(
      this.props.pendingAmount.value - amount,
    );

    this.incrementVersion();
  }

  // ---------------------------------------------------------------------------
  // Held Balance
  // ---------------------------------------------------------------------------

  public increaseHeld(amount: number): void {
    this.ensurePositiveAmount(amount);

    this.props.heldAmount = FinancialAccountHeldAmount.create(
      this.props.heldAmount.value + amount,
    );

    this.incrementVersion();
  }

  public decreaseHeld(amount: number): void {
    this.ensurePositiveAmount(amount);

    if (this.props.heldAmount.value < amount) {
      throw new Error('Financial account held balance cannot become negative.');
    }

    this.props.heldAmount = FinancialAccountHeldAmount.create(
      this.props.heldAmount.value - amount,
    );

    this.incrementVersion();
  }

  // ---------------------------------------------------------------------------
  // Version
  // ---------------------------------------------------------------------------

  private incrementVersion(): void {
    this.props.version = FinancialAccountBalanceVersion.create(
      this.props.version.value + 1,
    );
  }

  // ---------------------------------------------------------------------------
  // Updated At
  // ---------------------------------------------------------------------------

  public setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = updatedAt;
  }

  // ---------------------------------------------------------------------------
  // Queries
  // ---------------------------------------------------------------------------

  public totalAmount(): number {
    return (
      this.props.availableAmount.value +
      this.props.pendingAmount.value +
      this.props.heldAmount.value
    );
  }

  public hasAvailableFunds(amount: number): boolean {
    return this.props.availableAmount.value >= amount;
  }

  public hasPendingFunds(amount: number): boolean {
    return this.props.pendingAmount.value >= amount;
  }

  public hasHeldFunds(amount: number): boolean {
    return this.props.heldAmount.value >= amount;
  }

  public isZero(): boolean {
    return this.totalAmount() === 0;
  }

  public usesCurrency(currency: Currency): boolean {
    return this.props.currency.equals(currency);
  }

  // ---------------------------------------------------------------------------
  // Equality
  // ---------------------------------------------------------------------------

  override equals(other?: FinancialAccountBalanceEntity): boolean {
    if (other === undefined) {
      return false;
    }

    return this.id.equals(other.id);
  }

  // ---------------------------------------------------------------------------
  // Guards
  // ---------------------------------------------------------------------------

  private ensurePositiveAmount(amount: number): void {
    if (!Number.isSafeInteger(amount) || amount <= 0) {
      throw new Error(
        'Financial account balance amount must be a positive integer.',
      );
    }
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { FinancialAccountBalanceProps };
