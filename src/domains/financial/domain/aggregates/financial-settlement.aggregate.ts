// -----------------------------------------------------------------------------
// Financial Settlement Aggregate
// -----------------------------------------------------------------------------
//
// Aggregate root for the Financial Settlement lifecycle.
//
// Aggregate:
//
// FinancialSettlementAggregate
// └── FinancialSettlementEntity
//     └── FinancialSettlementItemEntity[]
//         └── FinancialSettlementAllocationEntity[]
//
// FinancialSettlementEntity remains the aggregate root entity.
// FinancialSettlementItemEntity and FinancialSettlementAllocationEntity are
// internal child entities owned by the aggregate.
//
// Responsibilities:
//
// - Own the Financial Settlement entity.
// - Own and coordinate Settlement Items.
// - Enforce aggregate-level invariants.
// - Enforce settlement-item ownership.
// - Coordinate settlement processing.
// - Coordinate settlement allocation.
// - Coordinate settlement completion.
// - Coordinate settlement failure.
// - Coordinate settlement cancellation.
// - Emit Financial Settlement domain events.
//
// Allocation is deliberately NOT a Financial Settlement lifecycle state.
//
// Settlement lifecycle:
//
// PENDING
//    │
//    ├── PROCESSING
//    │      │
//    │      ├── item allocation
//    │      │      PENDING → ALLOCATED
//    │      │
//    │      └── item settlement
//    │             ALLOCATED → SETTLED
//    │
//    ├── FAILED
//    └── CANCELLED
//
// PROCESSING → COMPLETED is permitted only when every Settlement Item has
// reached SETTLED.
//
// This aggregate does NOT:
//
// - Execute external settlement/provider APIs.
// - Modify Financial Account balances directly.
// - Create or post Financial Transactions.
// - Perform accounting.
// - Perform withdrawal.
// - Perform disbursement.
// - Persist itself.
// - Communicate with external bounded contexts.
//
// External execution belongs to the application/integration boundary.
//
// Financial Account balance mutation belongs to the Financial Account
// aggregate.
//
// Financial Transaction creation/posting belongs to the Financial Transaction
// aggregate.
//
// Persistence belongs to the repository/infrastructure boundary.
//
// Settlement allocation represents the domain decision that Settlement Items
// have been completely allocated. Allocation itself does not move money.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import type { FinancialSettlementEntity } from '../entities/financial-settlement.entity';

import type { FinancialSettlementItemEntity } from '../entities/financial-settlement-item.entity';

// -----------------------------------------------------------------------------
// Domain Events
// -----------------------------------------------------------------------------

import { FinancialSettlementCreatedEvent } from '../events/financial-settlement-created.event';

import { FinancialSettlementProcessingEvent } from '../events/financial-settlement-processing.event';

import { FinancialSettlementAllocatedEvent } from '../events/financial-settlement-allocated.event';

import { FinancialSettlementCompletedEvent } from '../events/financial-settlement-completed.event';

import { FinancialSettlementFailedEvent } from '../events/financial-settlement-failed.event';

import { FinancialSettlementCancelledEvent } from '../events/financial-settlement-cancelled.event';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { FinancialInvariantException } from '../exceptions/financial-invariant.exception';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { Money } from '../value-objects/money.vo';

import type { Currency } from '../value-objects/currency.vo';

import type { FinancialSettlementPublicId } from '../value-objects/financial-settlement-public-id.vo';

import type { FinancialSettlementItemPublicId } from '../value-objects/financial-settlement-item-public-id.vo';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialSettlementAggregateProps {
  settlement: FinancialSettlementEntity;
}

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

export class FinancialSettlementAggregate extends AggregateRoot<FinancialSettlementAggregateProps> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(props: FinancialSettlementAggregateProps) {
    super(props);
  }

  // ===========================================================================
  // Factory — Create
  // ===========================================================================

  /**
   * Creates a new Financial Settlement aggregate.
   *
   * The supplied FinancialSettlementEntity must represent a valid newly
   * created Settlement.
   *
   * Creation itself does not automatically emit a domain event.
   *
   * Call recordCreated() explicitly when the application command considers
   * aggregate creation complete.
   */
  public static create(
    settlement: FinancialSettlementEntity,
  ): FinancialSettlementAggregate {
    const aggregate = new FinancialSettlementAggregate({
      settlement,
    });

    aggregate.ensureAggregateConsistency();

    return aggregate;
  }

  // ===========================================================================
  // Factory — Rehydrate
  // ===========================================================================

  /**
   * Rehydrates an existing Financial Settlement aggregate.
   *
   * Rehydration never emits domain events.
   */
  public static rehydrate(
    settlement: FinancialSettlementEntity,
  ): FinancialSettlementAggregate {
    const aggregate = new FinancialSettlementAggregate({
      settlement,
    });

    aggregate.ensureAggregateConsistency();

    return aggregate;
  }

  // ===========================================================================
  // Aggregate State
  // ===========================================================================

  /**
   * Returns the Financial Settlement entity owned by this aggregate.
   */
  public get settlement(): FinancialSettlementEntity {
    return this.props.settlement;
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  public override get id() {
    return this.settlement.id;
  }

  public override get publicId(): FinancialSettlementPublicId {
    return this.settlement.publicId;
  }

  // ===========================================================================
  // Settlement Properties
  // ===========================================================================

  public get status() {
    return this.settlement.status;
  }

  public get currency(): Currency {
    return this.settlement.currency;
  }

  /**
   * Complete Settlement total.
   *
   * Money remains the authoritative monetary representation inside the
   * aggregate.
   */
  public get totalAmount(): Money {
    return this.settlement.totalAmount;
  }

  /**
   * Returns the total amount currently allocated across all Settlement Items.
   */
  public get allocatedAmount(): Money {
    return this.items.reduce(
      (total, item) => total.add(item.getAllocatedAmount()),
      Money.zero(this.currency),
    );
  }

  /**
   * Returns the amount that remains unallocated across all Settlement Items.
   */
  public get remainingAmount(): Money {
    return this.totalAmount.subtract(this.allocatedAmount);
  }

  public get itemCount(): number {
    return this.settlement.itemCount();
  }

  public get createdAt(): Date {
    return this.settlement.createdAt;
  }

  public get updatedAt(): Date {
    return this.settlement.updatedAt;
  }

  public get startedAt(): Date | undefined {
    return this.settlement.startedAt;
  }

  public get completedAt(): Date | undefined {
    return this.settlement.completedAt;
  }

  public get failedAt(): Date | undefined {
    return this.settlement.failedAt;
  }

  public get cancelledAt(): Date | undefined {
    return this.settlement.cancelledAt;
  }

  // ===========================================================================
  // Settlement Items
  // ===========================================================================

  /**
   * Returns Settlement Items as a read-only collection.
   */
  public get items(): readonly FinancialSettlementItemEntity[] {
    return this.settlement.items;
  }

  /**
   * Returns a Settlement Item by public identity.
   */
  public getItem(
    itemPublicId: FinancialSettlementItemPublicId,
  ): FinancialSettlementItemEntity | undefined {
    return this.settlement.getItem(itemPublicId);
  }

  /**
   * Determines whether the Settlement contains the supplied item.
   */
  public hasItem(itemPublicId: FinancialSettlementItemPublicId): boolean {
    return this.settlement.hasItem(itemPublicId);
  }

  /**
   * Returns whether the Settlement contains at least one item.
   */
  public hasItems(): boolean {
    return this.settlement.hasItems();
  }

  // ===========================================================================
  // Lifecycle Queries
  // ===========================================================================

  public isPending(): boolean {
    return this.settlement.isPending();
  }

  public isProcessing(): boolean {
    return this.settlement.isProcessing();
  }

  public isCompleted(): boolean {
    return this.settlement.isCompleted();
  }

  public isFailed(): boolean {
    return this.settlement.isFailed();
  }

  public isCancelled(): boolean {
    return this.settlement.isCancelled();
  }

  /**
   * Returns whether the Settlement is in a terminal state.
   */
  public isTerminal(): boolean {
    return this.settlement.isTerminal();
  }

  /**
   * Returns whether the Settlement can begin processing.
   */
  public canProcess(): boolean {
    return this.isPending();
  }

  /**
   * Returns whether the Settlement can perform allocation.
   */
  public canAllocate(): boolean {
    return this.isProcessing();
  }

  /**
   * Returns whether the Settlement can be completed.
   */
  public canComplete(): boolean {
    return this.isProcessing();
  }

  /**
   * A Settlement may fail from any non-terminal state.
   */
  public canFail(): boolean {
    return !this.isTerminal();
  }

  /**
   * A Settlement may be cancelled from any non-terminal state.
   */
  public canCancel(): boolean {
    return !this.isTerminal();
  }

  // ===========================================================================
  // Settlement Item Management
  // ===========================================================================

  /**
   * Adds a Settlement Item to the aggregate.
   *
   * The Settlement entity remains responsible for:
   *
   * - lifecycle restrictions;
   * - ownership;
   * - currency consistency;
   * - duplicate prevention;
   * - total recalculation.
   */
  public addItem(item: FinancialSettlementItemEntity): void {
    if (!this.isPending()) {
      throw new FinancialInvariantException(
        'Financial Settlement Items may only be added while the Financial Settlement is pending.',
      );
    }

    this.ensureItemBelongsToSettlement(item);

    this.settlement.addItem(item);

    this.ensureAggregateConsistency();
  }

  /**
   * Removes a Settlement Item from the aggregate.
   *
   * Removal is only possible while the Settlement remains pending.
   */
  public removeItem(itemPublicId: FinancialSettlementItemPublicId): void {
    if (!this.isPending()) {
      throw new FinancialInvariantException(
        'Financial Settlement Items may only be removed while the Financial Settlement is pending.',
      );
    }

    this.settlement.removeItem(itemPublicId);

    this.ensureAggregateConsistency();
  }

  /**
   * Ensures that the supplied Settlement Item belongs to this aggregate.
   */
  private ensureItemBelongsToSettlement(
    item: FinancialSettlementItemEntity,
  ): void {
    if (!item.settlementId.equals(this.id)) {
      throw new FinancialInvariantException(
        'Financial Settlement Item does not belong to the Financial Settlement.',
      );
    }
  }

  // ===========================================================================
  // Processing
  // ===========================================================================

  /**
   * Starts Financial Settlement processing.
   *
   * Lifecycle transition:
   *
   *     PENDING → PROCESSING
   *
   * This records the lifecycle transition only.
   *
   * External settlement execution remains outside the aggregate.
   */
  public startProcessing(
    at: Date = new Date(),
    correlationId: string,
    causationId?: string,
  ): void {
    if (!this.canProcess()) {
      throw new FinancialInvariantException(
        `Financial Settlement cannot begin processing from status "${this.status.value}".`,
      );
    }

    if (!this.hasItems()) {
      throw new FinancialInvariantException(
        'Financial Settlement must contain at least one Settlement Item before processing.',
      );
    }

    this.ensureValidDate(at, 'processing start');

    this.settlement.start(at);

    this.addDomainEvent(
      new FinancialSettlementProcessingEvent(
        this.id.value,
        this.publicId,
        this.status,
        this.currency,
        this.totalAmount,
        this.startedAt ?? at,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Allocation
  // ===========================================================================

  /**
   * Allocates all Settlement Items that are fully allocated.
   *
   * Allocation is an Item-level lifecycle operation:
   *
   *     PENDING → ALLOCATED
   *
   * FinancialSettlementEntity itself does not transition to an ALLOCATED
   * status.
   *
   * The Settlement remains PROCESSING while its Items progress through their
   * allocation and settlement lifecycle.
   *
   * Once every Settlement Item is fully allocated and the aggregate total
   * equals the allocated total, FinancialSettlementAllocatedEvent is emitted.
   *
   * This operation does NOT:
   *
   * - debit accounts;
   * - credit accounts;
   * - create transactions;
   * - post transactions;
   * - execute payouts;
   * - perform disbursement.
   */
  public allocate(
    at: Date = new Date(),
    correlationId: string,
    causationId?: string,
  ): void {
    if (!this.canAllocate()) {
      throw new FinancialInvariantException(
        `Financial Settlement cannot allocate items from status "${this.status.value}".`,
      );
    }

    this.ensureValidDate(at, 'allocation');

    this.ensureAllocatable();

    for (const item of this.items) {
      if (item.isPending()) {
        item.allocate();
      }
    }

    this.ensureAggregateConsistency();

    if (!this.areAllItemsAllocated()) {
      throw new FinancialInvariantException(
        'Financial Settlement allocation did not result in every Settlement Item becoming allocated.',
      );
    }

    if (!this.allocatedAmount.equals(this.totalAmount)) {
      throw new FinancialInvariantException(
        'Financial Settlement allocated amount must equal the Settlement total after allocation.',
      );
    }

    this.addDomainEvent(
      new FinancialSettlementAllocatedEvent(
        this.id.value,
        this.publicId,
        this.status,
        this.currency,
        this.totalAmount,
        at,
        correlationId,
        causationId,
      ),
    );
  }

  /**
   * Ensures every Settlement Item can be allocated.
   *
   * Every item must:
   *
   * - exist;
   * - not be cancelled;
   * - not already be settled;
   * - be fully allocated.
   */
  private ensureAllocatable(): void {
    if (!this.hasItems()) {
      throw new FinancialInvariantException(
        'Financial Settlement cannot be allocated without Settlement Items.',
      );
    }

    for (const item of this.items) {
      if (item.isCancelled()) {
        throw new FinancialInvariantException(
          `Financial Settlement Item "${item.publicId.value}" is cancelled and cannot be allocated.`,
        );
      }

      if (item.isSettled()) {
        continue;
      }

      if (!item.isFullyAllocated()) {
        throw new FinancialInvariantException(
          `Financial Settlement Item "${item.publicId.value}" must be fully allocated before Financial Settlement allocation can complete.`,
        );
      }
    }

    if (!this.allocatedAmount.equals(this.totalAmount)) {
      throw new FinancialInvariantException(
        'Financial Settlement allocated amount must equal the Settlement total before allocation can complete.',
      );
    }
  }

  /**
   * Returns whether every Settlement Item has been allocated.
   */
  public areAllItemsAllocated(): boolean {
    return this.settlement.areAllItemsAllocated();
  }

  /**
   * Returns whether every Settlement Item has been fully allocated.
   */
  public areAllItemsFullyAllocated(): boolean {
    return this.settlement.isFullyAllocated();
  }

  /**
   * Returns whether every Settlement Item has been settled.
   */
  public areAllItemsSettled(): boolean {
    return this.settlement.areAllItemsSettled();
  }

  // ===========================================================================
  // Completion
  // ===========================================================================

  /**
   * Completes the Financial Settlement.
   *
   * Lifecycle transition:
   *
   *     PROCESSING → COMPLETED
   *
   * Completion is valid only when every Settlement Item has reached SETTLED.
   *
   * FinancialSettlementEntity performs the final lifecycle transition and
   * therefore remains the authoritative owner of settlement status.
   */
  public complete(
    at: Date = new Date(),
    correlationId: string,
    causationId?: string,
  ): void {
    if (!this.canComplete()) {
      throw new FinancialInvariantException(
        `Financial Settlement cannot be completed from status "${this.status.value}".`,
      );
    }

    this.ensureValidDate(at, 'completion');

    this.ensureCompletable();

    this.settlement.complete(at);

    this.addDomainEvent(
      new FinancialSettlementCompletedEvent(
        this.id.value,
        this.publicId,
        this.status,
        this.currency,
        this.totalAmount,
        this.completedAt ?? at,
        correlationId,
        causationId,
      ),
    );
  }

  /**
   * Ensures every Settlement Item has reached SETTLED.
   */
  private ensureCompletable(): void {
    if (!this.hasItems()) {
      throw new FinancialInvariantException(
        'Financial Settlement cannot be completed without Settlement Items.',
      );
    }

    if (!this.areAllItemsSettled()) {
      throw new FinancialInvariantException(
        'Financial Settlement cannot be completed until all Settlement Items are settled.',
      );
    }

    if (!this.areAllItemsAllocated()) {
      throw new FinancialInvariantException(
        'Financial Settlement cannot be completed until all Settlement Items are allocated.',
      );
    }

    if (!this.allocatedAmount.equals(this.totalAmount)) {
      throw new FinancialInvariantException(
        'Financial Settlement cannot be completed until the full Settlement amount has been allocated.',
      );
    }
  }

  // ===========================================================================
  // Failure
  // ===========================================================================

  /**
   * Marks the Financial Settlement as failed.
   *
   * Failure records the aggregate lifecycle transition only.
   *
   * It does not reverse previously executed financial movements.
   *
   * Provider credentials, secrets, tokens, or sensitive provider information
   * must never be placed in the failure message.
   */
  public fail(
    reason: string,
    at: Date = new Date(),
    correlationId: string,
    causationId?: string,
  ): void {
    if (!this.canFail()) {
      throw new FinancialInvariantException(
        'A terminal Financial Settlement cannot be failed.',
      );
    }

    this.ensureValidDate(at, 'failure');

    const normalizedReason = reason.trim();

    if (normalizedReason.length === 0) {
      throw new FinancialInvariantException(
        'Financial Settlement failure reason is required.',
      );
    }

    this.settlement.fail(at);

    this.addDomainEvent(
      new FinancialSettlementFailedEvent(
        this.id.value,
        this.publicId,
        this.status,
        this.currency,
        this.totalAmount.amount,
        undefined,
        normalizedReason,
        this.failedAt ?? at,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Cancellation
  // ===========================================================================

  /**
   * Cancels the Financial Settlement.
   *
   * Cancellation does not reverse previously executed financial movements.
   *
   * Any reversal must be handled through the Financial Transaction lifecycle.
   */
  public cancel(
    at: Date = new Date(),
    correlationId: string,
    causationId?: string,
    reason?: string,
  ): void {
    if (!this.canCancel()) {
      throw new FinancialInvariantException(
        'A terminal Financial Settlement cannot be cancelled.',
      );
    }

    this.ensureValidDate(at, 'cancellation');

    const normalizedReason =
      reason !== undefined && reason.trim().length > 0
        ? reason.trim()
        : undefined;

    this.settlement.cancel(at);

    this.addDomainEvent(
      new FinancialSettlementCancelledEvent(
        this.id.value,
        this.publicId,
        this.status,
        this.currency,
        this.totalAmount.amount,
        normalizedReason,
        this.cancelledAt ?? at,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Creation Event
  // ===========================================================================

  /**
   * Emits the FinancialSettlementCreated domain event.
   *
   * Creation and event recording remain explicit.
   *
   * Rehydration never emits this event.
   */
  public emitCreatedEvent(correlationId: string, causationId?: string): void {
    this.addDomainEvent(
      new FinancialSettlementCreatedEvent(
        this.id.value,
        this.publicId,
        this.status,
        this.currency,
        this.totalAmount,
        correlationId,
        causationId,
      ),
    );
  }

  /**
   * Alias retained for consistency with other Financial aggregates.
   */
  public recordCreated(correlationId: string, causationId?: string): void {
    this.emitCreatedEvent(correlationId, causationId);
  }

  // ===========================================================================
  // Aggregate Consistency
  // ===========================================================================

  /**
   * Validates aggregate-wide invariants.
   *
   * The aggregate deliberately does not duplicate invariants that already
   * belong to the Settlement Entity or Settlement Item Entity.
   *
   * Aggregate-level invariants validated here:
   *
   * - Settlement exists.
   * - Settlement currency exists.
   * - Every item belongs to this Settlement.
   * - Every item uses the Settlement currency.
   * - Settlement total equals the sum of Item amounts.
   * - Allocated amount never exceeds Settlement total.
   * - Completed Settlement contains only settled Items.
   * - Completed Settlement is fully allocated.
   */
  private ensureAggregateConsistency(): void {
    // -------------------------------------------------------------------------
    // Settlement
    // -------------------------------------------------------------------------

    if (!this.settlement) {
      throw new FinancialInvariantException(
        'Financial Settlement aggregate must contain a Settlement entity.',
      );
    }

    // -------------------------------------------------------------------------
    // Currency
    // -------------------------------------------------------------------------

    if (!this.currency) {
      throw new FinancialInvariantException(
        'Financial Settlement currency is required.',
      );
    }

    // -------------------------------------------------------------------------
    // Item Ownership / Currency
    // -------------------------------------------------------------------------

    for (const item of this.items) {
      this.ensureItemBelongsToSettlement(item);

      if (!item.amount.currency.equals(this.currency)) {
        throw new FinancialInvariantException(
          `Financial Settlement Item "${item.publicId.value}" currency must match the Financial Settlement currency.`,
        );
      }
    }

    // -------------------------------------------------------------------------
    // Settlement Total
    // -------------------------------------------------------------------------

    const calculatedTotal = this.items.reduce(
      (total, item) => total.add(item.amount),
      Money.zero(this.currency),
    );

    if (!calculatedTotal.equals(this.totalAmount)) {
      throw new FinancialInvariantException(
        'Financial Settlement total does not equal the sum of its Settlement Item amounts.',
      );
    }

    // -------------------------------------------------------------------------
    // Allocated Amount
    // -------------------------------------------------------------------------

    const allocatedAmount = this.allocatedAmount;

    if (allocatedAmount.isGreaterThan(this.totalAmount)) {
      throw new FinancialInvariantException(
        'Financial Settlement allocated amount cannot exceed Settlement total.',
      );
    }

    // -------------------------------------------------------------------------
    // Completed Settlement
    // -------------------------------------------------------------------------

    if (this.isCompleted()) {
      if (!this.areAllItemsSettled()) {
        throw new FinancialInvariantException(
          'A completed Financial Settlement must have every Settlement Item settled.',
        );
      }

      if (!allocatedAmount.equals(this.totalAmount)) {
        throw new FinancialInvariantException(
          'A completed Financial Settlement must be fully allocated.',
        );
      }
    }
  }

  // ===========================================================================
  // Date Validation
  // ===========================================================================

  /**
   * Ensures a lifecycle timestamp is valid.
   */
  private ensureValidDate(at: Date, operation: string): void {
    if (Number.isNaN(at.getTime())) {
      throw new FinancialInvariantException(
        `Financial Settlement ${operation} timestamp must be a valid date.`,
      );
    }
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { FinancialSettlementAggregateProps };
