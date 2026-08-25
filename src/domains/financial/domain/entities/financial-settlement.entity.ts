// -----------------------------------------------------------------------------
// Financial Settlement Entity
// -----------------------------------------------------------------------------
//
// Represents the root aggregate responsible for coordinating one financial
// settlement operation.
//
// Aggregate:
//
// FinancialSettlementAggregate
// └── FinancialSettlementEntity
//     └── FinancialSettlementItemEntity[]
//         └── FinancialSettlementAllocationEntity[]
//
// FinancialSettlementEntity is the aggregate root.
//
// Responsibilities:
// - Maintain settlement identity.
// - Maintain settlement lifecycle.
// - Maintain settlement currency.
// - Maintain settlement items.
// - Maintain settlement total.
// - Enforce settlement-level invariants.
// - Enforce item ownership.
// - Enforce currency consistency across items.
// - Coordinate item lifecycle transitions.
//
// This entity does NOT:
// - Execute external provider operations.
// - Move money directly.
// - Modify Financial Account balances.
// - Create Financial Transactions directly.
// - Communicate with payment/disbursement providers.
// - Persist itself.
// - Coordinate external bounded contexts.
//
// Application services/command handlers orchestrate those operations while
// domain behavior and aggregate invariants remain inside this aggregate.
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

import { FinancialSettlementPublicId } from '../value-objects/financial-settlement-public-id.vo';
import { FinancialSettlementStatus } from '../value-objects/financial-settlement-status.vo';

import { Money } from '../value-objects/money.vo';

// -----------------------------------------------------------------------------
// Child Entity
// -----------------------------------------------------------------------------

import type { FinancialSettlementItemEntity } from './financial-settlement-item.entity';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface FinancialSettlementProps {
  /**
   * Settlement lifecycle status.
   *
   * New settlements begin in PENDING state.
   */
  status: FinancialSettlementStatus;

  /**
   * Currency used by every Settlement Item belonging to this aggregate.
   *
   * A Financial Settlement is single-currency.
   */
  currency: Money['currency'];

  /**
   * Aggregate settlement total.
   *
   * This is the sum of all Settlement Item amounts.
   */
  totalAmount: Money;

  /**
   * Settlement Items owned by this aggregate.
   */
  items: FinancialSettlementItemEntity[];

  /**
   * Timestamp at which settlement processing began.
   */
  startedAt: Date | undefined;

  /**
   * Timestamp at which settlement completed successfully.
   */
  completedAt: Date | undefined;

  /**
   * Timestamp at which settlement failed.
   */
  failedAt: Date | undefined;

  /**
   * Timestamp at which settlement was cancelled.
   */
  cancelledAt: Date | undefined;

  /**
   * Audit timestamps.
   */
  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

export class FinancialSettlementEntity extends Entity<
  FinancialSettlementProps,
  FinancialSettlementPublicId
> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    props: FinancialSettlementProps,
    id?: UniqueEntityId,
    publicId?: FinancialSettlementPublicId,
  ) {
    super(props, id, publicId);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a new Financial Settlement.
   *
   * A Settlement begins in PENDING state and contains no items.
   */
  public static create(currency: Money['currency']): FinancialSettlementEntity {
    const zero = Money.zero(currency);
    const now = new Date();

    return new FinancialSettlementEntity(
      {
        status: FinancialSettlementStatus.pending(),

        currency,

        totalAmount: zero,

        items: [],

        startedAt: undefined,
        completedAt: undefined,
        failedAt: undefined,
        cancelledAt: undefined,

        createdAt: now,
        updatedAt: now,
      },

      new UniqueEntityId(),

      new FinancialSettlementPublicId(),
    );
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  public override get publicId(): FinancialSettlementPublicId {
    return super.publicId;
  }

  // ---------------------------------------------------------------------------
  // Settlement
  // ---------------------------------------------------------------------------

  public get status(): FinancialSettlementStatus {
    return this.props.status;
  }

  public get currency(): Money['currency'] {
    return this.props.currency;
  }

  public get totalAmount(): Money {
    return this.props.totalAmount;
  }

  // ---------------------------------------------------------------------------
  // Items
  // ---------------------------------------------------------------------------

  /**
   * Returns the Settlement Items owned by this aggregate.
   *
   * A defensive copy prevents callers from mutating the aggregate collection
   * without going through aggregate behavior.
   */
  public get items(): readonly FinancialSettlementItemEntity[] {
    return [...this.props.items];
  }

  /**
   * Adds a Settlement Item to this aggregate.
   *
   * Aggregate invariants:
   *
   * - settlement must still be PENDING;
   * - item must belong to this settlement;
   * - item currency must match settlement currency;
   * - duplicate item identity is not permitted.
   */
  public addItem(item: FinancialSettlementItemEntity): void {
    if (!this.isPending()) {
      throw new Error(
        'Cannot add Financial Settlement Items unless Financial Settlement is pending',
      );
    }

    if (!item.settlementId.equals(this.id)) {
      throw new Error(
        'Financial Settlement Item belongs to a different Financial Settlement',
      );
    }

    if (!item.amount.currency.equals(this.props.currency)) {
      throw new Error(
        'Financial Settlement Item currency must match Financial Settlement currency',
      );
    }

    if (this.hasItem(item.publicId)) {
      throw new Error(
        `Financial Settlement Item "${item.publicId.value}" is already part of this Financial Settlement`,
      );
    }

    this.props.items.push(item);

    this.recalculateTotal();

    this.touch();
  }

  /**
   * Removes a Settlement Item.
   *
   * Items may only be removed while the Settlement is still pending.
   */
  public removeItem(itemPublicId: FinancialSettlementPublicId): void {
    if (!this.isPending()) {
      throw new Error(
        'Cannot remove Financial Settlement Items unless Financial Settlement is pending',
      );
    }

    const originalLength = this.props.items.length;

    this.props.items = this.props.items.filter(
      (item) => !item.publicId.equals(itemPublicId),
    );

    if (this.props.items.length === originalLength) {
      return;
    }

    this.recalculateTotal();

    this.touch();
  }

  /**
   * Finds a Settlement Item by public identity.
   */
  public getItem(
    itemPublicId: FinancialSettlementPublicId,
  ): FinancialSettlementItemEntity | undefined {
    return this.props.items.find((item) => item.publicId.equals(itemPublicId));
  }

  /**
   * Returns whether this aggregate contains the supplied Settlement Item.
   */
  public hasItem(itemPublicId: FinancialSettlementPublicId): boolean {
    return this.props.items.some((item) => item.publicId.equals(itemPublicId));
  }

  public hasItems(): boolean {
    return this.props.items.length > 0;
  }

  public itemCount(): number {
    return this.props.items.length;
  }

  // ---------------------------------------------------------------------------
  // Total
  // ---------------------------------------------------------------------------

  /**
   * Recalculates the settlement total from its Settlement Items.
   *
   * The total is derived from aggregate-owned items and is never supplied
   * independently by callers.
   */
  private recalculateTotal(): void {
    this.props.totalAmount = this.props.items.reduce(
      (total, item) => total.add(item.amount),
      Money.zero(this.props.currency),
    );
  }

  /**
   * Returns whether every Settlement Item is fully allocated.
   */
  public isFullyAllocated(): boolean {
    if (!this.hasItems()) {
      return false;
    }

    return this.props.items.every((item) => item.isFullyAllocated());
  }

  /**
   * Returns whether every Settlement Item has been allocated.
   */
  public areAllItemsAllocated(): boolean {
    if (!this.hasItems()) {
      return false;
    }

    return this.props.items.every((item) => item.isAllocated());
  }

  /**
   * Returns whether every Settlement Item has been settled.
   */
  public areAllItemsSettled(): boolean {
    if (!this.hasItems()) {
      return false;
    }

    return this.props.items.every((item) => item.isSettled());
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Starts settlement processing.
   *
   * A Settlement must contain at least one item.
   */
  public start(startedAt: Date = new Date()): void {
    if (!this.props.status.canProcess()) {
      throw new Error(
        `Invalid Financial Settlement status transition: ` +
          `${this.props.status.value} -> PROCESSING`,
      );
    }

    if (!this.hasItems()) {
      throw new Error(
        'Financial Settlement must contain at least one Settlement Item before processing',
      );
    }

    this.props.status = FinancialSettlementStatus.processing();

    this.props.startedAt = startedAt;

    this.props.completedAt = undefined;
    this.props.failedAt = undefined;
    this.props.cancelledAt = undefined;

    this.touch(startedAt);
  }

  /**
   * Marks the Settlement as completed.
   *
   * Every Settlement Item must have reached SETTLED state.
   */
  public complete(completedAt: Date = new Date()): void {
    if (!this.props.status.canComplete()) {
      throw new Error(
        `Invalid Financial Settlement status transition: ` +
          `${this.props.status.value} -> COMPLETED`,
      );
    }

    if (!this.areAllItemsSettled()) {
      throw new Error(
        'Financial Settlement cannot be completed until all Settlement Items are settled',
      );
    }

    this.props.status = FinancialSettlementStatus.completed();

    this.props.completedAt = completedAt;

    this.props.failedAt = undefined;
    this.props.cancelledAt = undefined;

    this.touch(completedAt);
  }

  /**
   * Marks the Settlement as failed.
   *
   * Failure orchestration belongs outside the entity. This method records
   * only the aggregate lifecycle transition.
   */
  public fail(failedAt: Date = new Date()): void {
    if (!this.props.status.canFail()) {
      throw new Error(
        `Invalid Financial Settlement status transition: ` +
          `${this.props.status.value} -> FAILED`,
      );
    }

    this.props.status = FinancialSettlementStatus.failed();

    this.props.failedAt = failedAt;

    this.props.completedAt = undefined;
    this.props.cancelledAt = undefined;

    this.touch(failedAt);
  }

  /**
   * Cancels the Settlement.
   */
  public cancel(cancelledAt: Date = new Date()): void {
    if (!this.props.status.canCancel()) {
      throw new Error(
        `Invalid Financial Settlement status transition: ` +
          `${this.props.status.value} -> CANCELLED`,
      );
    }

    this.props.status = FinancialSettlementStatus.cancelled();

    this.props.cancelledAt = cancelledAt;

    this.props.completedAt = undefined;
    this.props.failedAt = undefined;

    this.touch(cancelledAt);
  }

  // ---------------------------------------------------------------------------
  // Lifecycle Queries
  // ---------------------------------------------------------------------------

  public isPending(): boolean {
    return this.props.status.isPending();
  }

  public isProcessing(): boolean {
    return this.props.status.isProcessing();
  }

  public isCompleted(): boolean {
    return this.props.status.isCompleted();
  }

  public isFailed(): boolean {
    return this.props.status.isFailed();
  }

  public isCancelled(): boolean {
    return this.props.status.isCancelled();
  }

  public isTerminal(): boolean {
    return this.props.status.isTerminal();
  }

  public isSuccessful(): boolean {
    return this.props.status.isCompleted();
  }

  // ---------------------------------------------------------------------------
  // Timestamps
  // ---------------------------------------------------------------------------

  public get startedAt(): Date | undefined {
    return this.props.startedAt;
  }

  public get completedAt(): Date | undefined {
    return this.props.completedAt;
  }

  public get failedAt(): Date | undefined {
    return this.props.failedAt;
  }

  public get cancelledAt(): Date | undefined {
    return this.props.cancelledAt;
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
