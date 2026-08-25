// -----------------------------------------------------------------------------
// Financial Settlement Item Entity
// -----------------------------------------------------------------------------
//
// Represents one business object being settled inside a Financial Settlement.
//
// Aggregate ownership:
//
// FinancialSettlementAggregate
// └── FinancialSettlementEntity
//     └── FinancialSettlementItemEntity[]
//         └── FinancialSettlementAllocationEntity[]
//
// FinancialSettlementEntity is the aggregate root.
//
// FinancialSettlementItemEntity is a child entity and owns the lifecycle and
// allocations for one settlement subject.
//
// Responsibilities:
// - Maintain settlement item identity.
// - Maintain owning Financial Settlement identity.
// - Maintain referenced business object identity.
// - Maintain settlement amount.
// - Maintain settlement item lifecycle.
// - Maintain settlement allocations.
// - Enforce allocation invariants.
// - Maintain audit timestamps.
//
// This entity does NOT:
// - Calculate settlement totals.
// - Coordinate sibling settlement items.
// - Create Financial Transactions.
// - Modify Financial Account balances.
// - Persist itself.
// - Execute settlement orchestration.
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

import { FinancialSettlementItemPublicId } from '../value-objects/financial-settlement-item-public-id.vo';
import { FinancialSettlementItemStatus } from '../value-objects/financial-settlement-item-status.vo';
import type { FinancialReferenceType } from '../value-objects/financial-reference-type.vo';
import type { FinancialReferencePublicId } from '../value-objects/financial-reference-public-id.vo';

import { Money } from '../value-objects/money.vo';

// -----------------------------------------------------------------------------
// Child Entity
// -----------------------------------------------------------------------------

import type { FinancialSettlementAllocationEntity } from './financial-settlement-allocation.entity';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface FinancialSettlementItemProps {
  /**
   * Internal identity of the owning Financial Settlement aggregate.
   */
  settlementId: UniqueEntityId;

  /**
   * Business object being settled.
   *
   * Examples:
   * - JOURNEY_BOOKING
   * - COMMERCIAL_BOOKING_COMMISSION
   * - JOURNEY_COMPLETION
   */
  referenceType: FinancialReferenceType;

  /**
   * Public identity of the referenced business object.
   */
  referencePublicId: FinancialReferencePublicId;

  /**
   * Monetary amount represented by this settlement item.
   */
  amount: Money;

  /**
   * Lifecycle status.
   */
  status: FinancialSettlementItemStatus;

  /**
   * Allocations belonging to this settlement item.
   */
  allocations: FinancialSettlementAllocationEntity[];

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

export class FinancialSettlementItemEntity extends Entity<
  FinancialSettlementItemProps,
  FinancialSettlementItemPublicId
> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    props: FinancialSettlementItemProps,
    id?: UniqueEntityId,
    publicId?: FinancialSettlementItemPublicId,
  ) {
    super(props, id, publicId);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a new Settlement Item.
   *
   * New settlement items always begin in PENDING state.
   */
  public static create(
    settlementId: UniqueEntityId,
    referenceType: FinancialReferenceType,
    referencePublicId: FinancialReferencePublicId,
    amount: Money,
  ): FinancialSettlementItemEntity {
    if (!amount.isPositive()) {
      throw new Error(
        'Financial Settlement Item amount must be greater than zero',
      );
    }

    const now = new Date();

    return new FinancialSettlementItemEntity(
      {
        settlementId,

        referenceType,
        referencePublicId,

        amount,

        status: FinancialSettlementItemStatus.pending(),

        allocations: [],

        createdAt: now,
        updatedAt: now,
      },

      new UniqueEntityId(),

      new FinancialSettlementItemPublicId(),
    );
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  public override get publicId(): FinancialSettlementItemPublicId {
    return super.publicId;
  }

  public get settlementId(): UniqueEntityId {
    return this.props.settlementId;
  }

  // ---------------------------------------------------------------------------
  // Reference
  // ---------------------------------------------------------------------------

  public get referenceType(): FinancialReferenceType {
    return this.props.referenceType;
  }

  public get referencePublicId(): FinancialReferencePublicId {
    return this.props.referencePublicId;
  }

  // ---------------------------------------------------------------------------
  // Amount
  // ---------------------------------------------------------------------------

  public get amount(): Money {
    return this.props.amount;
  }

  public hasAmount(amount: Money): boolean {
    return this.props.amount.equals(amount);
  }

  // ---------------------------------------------------------------------------
  // Status
  // ---------------------------------------------------------------------------

  public get status(): FinancialSettlementItemStatus {
    return this.props.status;
  }

  public isPending(): boolean {
    return this.props.status.isPending();
  }

  public isAllocated(): boolean {
    return this.props.status.isAllocated();
  }

  public isSettled(): boolean {
    return this.props.status.isSettled();
  }

  public isCancelled(): boolean {
    return this.props.status.isCancelled();
  }

  public isTerminal(): boolean {
    return this.props.status.isTerminal();
  }

  // ---------------------------------------------------------------------------
  // Allocations
  // ---------------------------------------------------------------------------

  /**
   * Returns allocations as a read-only collection.
   */
  public get allocations(): readonly FinancialSettlementAllocationEntity[] {
    return [...this.props.allocations];
  }

  /**
   * Adds an allocation.
   *
   * Aggregate invariants enforced:
   * - item must be pending;
   * - allocation belongs to this item;
   * - allocation currency matches item currency;
   * - total allocated amount must never exceed item amount.
   */
  public addAllocation(allocation: FinancialSettlementAllocationEntity): void {
    if (!this.isPending()) {
      throw new Error(
        'Cannot add allocations unless Financial Settlement Item is pending',
      );
    }

    if (!allocation.settlementItemId.equals(this.id)) {
      throw new Error(
        'Financial Settlement Allocation belongs to a different Settlement Item',
      );
    }

    if (!allocation.amount.currency.equals(this.amount.currency)) {
      throw new Error(
        'Financial Settlement Allocation currency must match Settlement Item currency',
      );
    }

    const nextAllocated = this.getAllocatedAmount().add(allocation.amount);

    if (nextAllocated.isGreaterThan(this.amount)) {
      throw new Error(
        'Financial Settlement Allocations cannot exceed Settlement Item amount',
      );
    }

    this.props.allocations.push(allocation);

    this.touch();
  }

  /**
   * Removes an allocation.
   *
   * Allocations may only be removed while pending.
   */
  public removeAllocation(
    allocationPublicId: FinancialSettlementItemPublicId,
  ): void {
    if (!this.isPending()) {
      throw new Error(
        'Cannot remove allocations unless Financial Settlement Item is pending',
      );
    }

    const originalLength = this.props.allocations.length;

    this.props.allocations = this.props.allocations.filter(
      (allocation) => !allocation.publicId.equals(allocationPublicId),
    );

    if (this.props.allocations.length === originalLength) {
      return;
    }

    this.touch();
  }

  /**
   * Finds one allocation.
   */
  public getAllocation(
    allocationPublicId: FinancialSettlementItemPublicId,
  ): FinancialSettlementAllocationEntity | undefined {
    return this.props.allocations.find((allocation) =>
      allocation.publicId.equals(allocationPublicId),
    );
  }

  /**
   * Returns true when allocations equal the item amount.
   */
  public isFullyAllocated(): boolean {
    return this.getAllocatedAmount().equals(this.amount);
  }

  /**
   * Total allocated monetary amount.
   */
  public getAllocatedAmount(): Money {
    return this.props.allocations.reduce(
      (total, allocation) => total.add(allocation.amount),
      Money.zero(this.amount.currency),
    );
  }

  /**
   * Remaining monetary amount available for allocation.
   */
  public getRemainingAmount(): Money {
    return this.amount.subtract(this.getAllocatedAmount());
  }

  public hasAllocations(): boolean {
    return this.props.allocations.length > 0;
  }

  public allocationCount(): number {
    return this.props.allocations.length;
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Marks the settlement item as allocated.
   *
   * The item must be completely allocated first.
   */
  public allocate(): void {
    if (!this.props.status.canAllocate()) {
      throw new Error(
        `Invalid Financial Settlement Item status transition: ${this.props.status.value} -> ALLOCATED`,
      );
    }

    if (!this.isFullyAllocated()) {
      throw new Error(
        'Financial Settlement Item must be fully allocated before becoming ALLOCATED',
      );
    }

    this.props.status = FinancialSettlementItemStatus.allocated();

    this.touch();
  }

  /**
   * Marks the settlement item as settled.
   */
  public settle(): void {
    if (!this.props.status.canSettle()) {
      throw new Error(
        `Invalid Financial Settlement Item status transition: ${this.props.status.value} -> SETTLED`,
      );
    }

    this.props.status = FinancialSettlementItemStatus.settled();

    this.touch();
  }

  /**
   * Cancels the settlement item.
   */
  public cancel(): void {
    if (!this.props.status.canCancel()) {
      throw new Error(
        `Invalid Financial Settlement Item status transition: ${this.props.status.value} -> CANCELLED`,
      );
    }

    this.props.status = FinancialSettlementItemStatus.cancelled();

    this.touch();
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

  /**
   * Explicitly sets the updated timestamp.
   *
   * Primarily intended for persistence rehydration/mapping.
   */
  public setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = updatedAt;
  }
}
