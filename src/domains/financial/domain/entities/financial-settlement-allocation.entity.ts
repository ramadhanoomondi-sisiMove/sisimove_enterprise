// -----------------------------------------------------------------------------
// Financial Settlement Allocation Entity
// -----------------------------------------------------------------------------
//
// Represents one allocation of a Financial Settlement Item to a Financial
// Account.
//
// Aggregate ownership:
//
// FinancialSettlementAggregate
// └── FinancialSettlementEntity
//     └── FinancialSettlementItemEntity
//         └── FinancialSettlementAllocationEntity[]
//
// FinancialSettlementEntity remains the aggregate root.
//
// FinancialSettlementItemEntity is a child entity of the Settlement aggregate.
//
// FinancialSettlementAllocationEntity is a child entity of the
// FinancialSettlementItemEntity and must not be treated as an independent
// aggregate root.
//
// Responsibilities:
// - Maintain allocation identity.
// - Maintain owning Financial Settlement Item identity.
// - Maintain destination Financial Account identity.
// - Maintain allocation type.
// - Maintain allocated monetary amount.
// - Maintain optional resulting Financial Transaction reference.
// - Maintain audit timestamps.
// - Enforce allocation-local invariants.
//
// This entity does NOT:
// - Calculate settlement totals.
// - Decide how a Settlement Item is allocated.
// - Coordinate sibling allocations.
// - Modify Financial Account balances.
// - Create Financial Transactions.
// - Execute transfers.
// - Persist itself.
// - Communicate with external providers.
// - Decide whether a Settlement Item may be settled.
//
// Those responsibilities belong to the parent aggregate and application
// orchestration.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';
import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { FinancialSettlementAllocationPublicId } from '../value-objects/financial-settlement-allocation-public-id.vo';

import type { FinancialSettlementAllocationType } from '../value-objects/financial-settlement-allocation-type.vo';

import type { Money } from '../value-objects/money.vo';

import type { FinancialTransactionPublicId } from '../value-objects/financial-transaction-public-id.vo';
import { Currency } from '../value-objects';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface FinancialSettlementAllocationProps {
  /**
   * Internal identity of the owning Financial Settlement Item.
   *
   * This is intentionally an internal entity identity because the parent
   * Settlement aggregate uses it to enforce ownership.
   */
  settlementItemId: UniqueEntityId;

  /**
   * Internal identity of the Financial Account receiving this allocation.
   *
   * The Financial Account itself belongs to a separate Financial Account
   * aggregate and is therefore represented here only by its internal
   * identity.
   */
  accountId: UniqueEntityId;

  /**
   * Classification of the allocation.
   *
   * Examples:
   * - PRINCIPAL
   * - COMMISSION
   * - FEE
   * - ADJUSTMENT
   */
  type: FinancialSettlementAllocationType;

  /**
   * Monetary value allocated to the destination account.
   *
   * Money keeps amount and currency inseparable.
   *
   * The parent FinancialSettlementItemEntity is responsible for enforcing
   * aggregate-level rules such as:
   *
   * - total allocations do not exceed the settlement item amount;
   * - allocation currency matches the settlement item currency;
   * - allocation composition is valid;
   * - allocation is permitted for the item lifecycle.
   */
  amount: Money;

  /**
   * Public identity of the Financial Transaction created as a consequence
   * of applying this allocation.
   *
   * This is intentionally optional because an allocation may exist before
   * its corresponding transaction has been posted.
   *
   * The allocation stores only the transaction's public identity and does
   * not establish a domain object relationship to the transaction.
   */
  transactionPublicId: FinancialTransactionPublicId | undefined;

  /**
   * Audit timestamp.
   */
  createdAt: Date;

  /**
   * Last modification timestamp.
   */
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

export class FinancialSettlementAllocationEntity extends Entity<
  FinancialSettlementAllocationProps,
  FinancialSettlementAllocationPublicId
> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    props: FinancialSettlementAllocationProps,
    id?: UniqueEntityId,
    publicId?: FinancialSettlementAllocationPublicId,
  ) {
    super(props, id, publicId);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a new Financial Settlement Allocation.
   *
   * New allocations must contain a strictly positive monetary amount.
   *
   * Allocation-level aggregate rules remain the responsibility of the parent
   * FinancialSettlementItemEntity.
   */
  public static create(
    settlementItemId: UniqueEntityId,
    accountId: UniqueEntityId,
    type: FinancialSettlementAllocationType,
    amount: Money,
    transactionPublicId?: FinancialTransactionPublicId,
  ): FinancialSettlementAllocationEntity {
    if (!amount.isPositive()) {
      throw new Error(
        'Financial Settlement Allocation amount must be greater than zero',
      );
    }

    const now = new Date();

    return new FinancialSettlementAllocationEntity(
      {
        settlementItemId,

        accountId,

        type,

        amount,

        transactionPublicId: transactionPublicId ?? undefined,

        createdAt: now,
        updatedAt: now,
      },

      new UniqueEntityId(),

      new FinancialSettlementAllocationPublicId(),
    );
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  public override get publicId(): FinancialSettlementAllocationPublicId {
    return super.publicId;
  }

  // ---------------------------------------------------------------------------
  // Settlement Item Reference
  // ---------------------------------------------------------------------------

  /**
   * Internal identity of the owning Financial Settlement Item.
   */
  public get settlementItemId(): UniqueEntityId {
    return this.props.settlementItemId;
  }

  // ---------------------------------------------------------------------------
  // Account Reference
  // ---------------------------------------------------------------------------

  /**
   * Internal identity of the Financial Account receiving this allocation.
   */
  public get accountId(): UniqueEntityId {
    return this.props.accountId;
  }

  // ---------------------------------------------------------------------------
  // Allocation
  // ---------------------------------------------------------------------------

  public get type(): FinancialSettlementAllocationType {
    return this.props.type;
  }

  public get amount(): Money {
    return this.props.amount;
  }

  // ---------------------------------------------------------------------------
  // Transaction Reference
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Financial Transaction associated with this
   * allocation.
   *
   * The transaction itself is managed by the Financial Transaction aggregate.
   */
  public get transactionPublicId(): FinancialTransactionPublicId | undefined {
    return this.props.transactionPublicId;
  }

  /**
   * Returns whether this allocation has been associated with a Financial
   * Transaction.
   */
  public hasTransaction(): boolean {
    return this.props.transactionPublicId !== undefined;
  }

  /**
   * Associates the allocation with the Financial Transaction created for it.
   *
   * Transaction creation and posting remain outside this entity.
   *
   * A transaction reference may only be assigned once. Replacing an existing
   * transaction reference would make the allocation's financial history
   * ambiguous.
   */
  public assignTransaction(
    transactionPublicId: FinancialTransactionPublicId,
  ): void {
    if (this.props.transactionPublicId !== undefined) {
      throw new Error(
        'Financial Settlement Allocation already has an associated Financial Transaction',
      );
    }

    this.props.transactionPublicId = transactionPublicId;

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Allocation Type
  // ---------------------------------------------------------------------------

  /**
   * Returns whether this allocation represents the specified allocation type.
   */
  public hasType(type: FinancialSettlementAllocationType): boolean {
    return this.props.type.equals(type);
  }

  public isPrincipal(): boolean {
    return this.props.type.isPrincipal();
  }

  public isCommission(): boolean {
    return this.props.type.isCommission();
  }

  public isFee(): boolean {
    return this.props.type.isFee();
  }

  public isAdjustment(): boolean {
    return this.props.type.isAdjustment();
  }

  // ---------------------------------------------------------------------------
  // Amount
  // ---------------------------------------------------------------------------

  /**
   * Returns whether this allocation has the specified monetary value.
   */
  public hasAmount(amount: Money): boolean {
    return this.props.amount.equals(amount);
  }

  /**
   * Returns whether this allocation uses the specified currency.
   */
  public hasCurrency(currency: string): boolean {
    return this.props.amount.currency.equals(Currency.create(currency));
  }

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // ---------------------------------------------------------------------------
  // Persistence / Rehydration
  // ---------------------------------------------------------------------------

  /**
   * Explicitly sets the updated timestamp.
   *
   * Primarily intended for persistence rehydration/mapping.
   */
  public setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = updatedAt;
  }
}
