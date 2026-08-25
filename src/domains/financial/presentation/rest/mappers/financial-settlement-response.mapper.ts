// -----------------------------------------------------------------------------
// Financial Settlement — REST Response Mapper
// -----------------------------------------------------------------------------
//
// Maps Financial Settlement domain objects into REST response
// representations.
//
// Aggregate boundary:
//
// FinancialSettlementAggregate
// └── FinancialSettlementEntity
//     └── FinancialSettlementItemEntity[]
//         └── FinancialSettlementAllocationEntity[]
//
// IMPORTANT:
//
// Domain entities, aggregate roots, Entity IDs, and Value Objects are never
// exposed directly through the REST boundary.
//
// Value Objects are converted to primitive representations here.
//
// Financial Account aggregates are NOT traversed.
//
// Financial Account references must be represented through public identifiers.
// Internal Financial Account Entity IDs must NEVER cross the REST boundary.
//
// Financial Transactions are represented only through their public
// identifiers.
//
// The complete Settlement graph may be returned:
//
// Settlement
// ├── Items
// │   └── Allocations
// │       └── Transaction reference
//
// This mapper performs presentation mapping only. It does not calculate,
// mutate, or orchestrate settlement behavior.
//
// Money uses:
//
//     money.amount
//     money.currency.value
//
// NOT:
//
//     money.value
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------

import type { FinancialSettlementAggregate } from '../../../domain/aggregates/financial-settlement.aggregate';

// -----------------------------------------------------------------------------
// Domain — Entities
// -----------------------------------------------------------------------------

import type { FinancialSettlementEntity } from '../../../domain/entities/financial-settlement.entity';

import type { FinancialSettlementItemEntity } from '../../../domain/entities/financial-settlement-item.entity';

import type { FinancialSettlementAllocationEntity } from '../../../domain/entities/financial-settlement-allocation.entity';

// -----------------------------------------------------------------------------
// Response Types
// -----------------------------------------------------------------------------

/**
 * REST representation of a Financial Settlement Allocation.
 *
 * The allocation is represented as a nested child of a Settlement Item.
 *
 * Internal Entity IDs are intentionally not exposed.
 */
export interface FinancialSettlementAllocationResponse {
  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Public identity of the Settlement Allocation.
   */
  publicId: string;

  // ===========================================================================
  // Owning Settlement Item
  // ===========================================================================

  /**
   * Public identity of the Settlement Item owning this allocation.
   *
   * This is represented through the public identity of the parent Item.
   *
   * The internal settlementItemId is never exposed.
   */
  settlementItemPublicId: string;

  // ===========================================================================
  // Destination Account
  // ===========================================================================

  /**
   * Public identity of the Financial Account receiving this allocation.
   *
   * Currently undefined because the domain entity stores the destination
   * account as an internal UniqueEntityId.
   *
   * That internal identifier must never cross the REST boundary.
   *
   * Once the domain model carries a FinancialAccountPublicId reference,
   * this property should be populated from that opaque public reference.
   */
  accountPublicId: string | undefined;

  // ===========================================================================
  // Allocation
  // ===========================================================================

  /**
   * Classification of the allocation.
   *
   * Examples:
   *
   * - PRINCIPAL
   * - COMMISSION
   * - FEE
   * - ADJUSTMENT
   */
  type: string;

  /**
   * Amount allocated to the destination account.
   *
   * Expressed in the smallest monetary unit supported by the Financial
   * domain.
   */
  amount: number;

  /**
   * Currency of the allocation.
   */
  currency: string;

  // ===========================================================================
  // Financial Transaction
  // ===========================================================================

  /**
   * Public identity of the Financial Transaction associated with this
   * allocation.
   *
   * The Financial Transaction aggregate itself is never embedded.
   */
  transactionPublicId: string | undefined;

  /**
   * Whether a Financial Transaction has been associated with this
   * allocation.
   */
  hasTransaction: boolean;

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * Timestamp at which the allocation was created.
   */
  createdAt: Date;

  /**
   * Timestamp at which the allocation was last updated.
   */
  updatedAt: Date;
}

/**
 * REST representation of a Financial Settlement Item.
 *
 * The Item contains its complete allocation collection.
 */
export interface FinancialSettlementItemResponse {
  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Public identity of the Settlement Item.
   */
  publicId: string;

  /**
   * Public identity of the owning Financial Settlement.
   */
  settlementPublicId: string;

  // ===========================================================================
  // Business Reference
  // ===========================================================================

  /**
   * Type of business object being settled.
   */
  referenceType: string;

  /**
   * Public identity of the business object being settled.
   */
  referencePublicId: string;

  // ===========================================================================
  // Amount
  // ===========================================================================

  /**
   * Total monetary amount represented by this Settlement Item.
   */
  amount: number;

  /**
   * Currency of the Settlement Item.
   */
  currency: string;

  /**
   * Total amount allocated across this Item's allocations.
   */
  allocatedAmount: number;

  /**
   * Amount remaining to be allocated.
   */
  remainingAmount: number;

  /**
   * Whether the Item has at least one allocation.
   */
  hasAllocations: boolean;

  /**
   * Number of allocations belonging to this Item.
   */
  allocationCount: number;

  // ===========================================================================
  // Lifecycle
  // ===========================================================================

  /**
   * Current Settlement Item lifecycle status.
   *
   * Possible values:
   *
   * - PENDING
   * - ALLOCATED
   * - SETTLED
   * - CANCELLED
   */
  status: string;

  /**
   * Whether the Item is pending allocation.
   */
  isPending: boolean;

  /**
   * Whether the Item has been fully allocated.
   */
  isAllocated: boolean;

  /**
   * Whether the Item has been settled.
   */
  isSettled: boolean;

  /**
   * Whether the Item has been cancelled.
   */
  isCancelled: boolean;

  /**
   * Whether the Item is in a terminal state.
   */
  isTerminal: boolean;

  // ===========================================================================
  // Allocations
  // ===========================================================================

  /**
   * Allocations belonging to this Settlement Item.
   */
  allocations: FinancialSettlementAllocationResponse[];

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * Timestamp at which the Item was created.
   */
  createdAt: Date;

  /**
   * Timestamp at which the Item was last updated.
   */
  updatedAt: Date;
}

/**
 * REST representation of a Financial Settlement aggregate.
 *
 * The response exposes the complete Settlement aggregate graph using only
 * transport-safe primitive representations.
 */
export interface FinancialSettlementResponse {
  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Public identity of the Financial Settlement.
   */
  publicId: string;

  // ===========================================================================
  // Settlement
  // ===========================================================================

  /**
   * Current Settlement lifecycle status.
   *
   * Possible values:
   *
   * - PENDING
   * - PROCESSING
   * - COMPLETED
   * - FAILED
   * - CANCELLED
   */
  status: string;

  /**
   * Settlement currency.
   */
  currency: string;

  /**
   * Total monetary amount represented by the Settlement.
   */
  totalAmount: number;

  // ===========================================================================
  // Allocation Summary
  // ===========================================================================

  /**
   * Total amount allocated across all Settlement Items.
   */
  allocatedAmount: number;

  /**
   * Amount remaining to be allocated.
   */
  remainingAmount: number;

  /**
   * Whether the Settlement contains at least one Item.
   */
  hasItems: boolean;

  /**
   * Number of Settlement Items.
   */
  itemCount: number;

  /**
   * Whether every Settlement Item has been fully allocated.
   */
  isFullyAllocated: boolean;

  /**
   * Whether every Settlement Item has reached ALLOCATED state.
   */
  areAllItemsAllocated: boolean;

  /**
   * Whether every Settlement Item has reached SETTLED state.
   */
  areAllItemsSettled: boolean;

  // ===========================================================================
  // Lifecycle
  // ===========================================================================

  /**
   * Whether the Settlement is pending.
   */
  isPending: boolean;

  /**
   * Whether the Settlement is currently processing.
   */
  isProcessing: boolean;

  /**
   * Whether the Settlement completed successfully.
   */
  isCompleted: boolean;

  /**
   * Whether the Settlement failed.
   */
  isFailed: boolean;

  /**
   * Whether the Settlement was cancelled.
   */
  isCancelled: boolean;

  /**
   * Whether the Settlement is in a terminal state.
   */
  isTerminal: boolean;

  /**
   * Whether the Settlement completed successfully.
   */
  isSuccessful: boolean;

  // ===========================================================================
  // Lifecycle Audit
  // ===========================================================================

  /**
   * Timestamp at which Settlement processing began.
   */
  startedAt: Date | undefined;

  /**
   * Timestamp at which Settlement completed.
   */
  completedAt: Date | undefined;

  /**
   * Timestamp at which Settlement failed.
   */
  failedAt: Date | undefined;

  /**
   * Timestamp at which Settlement was cancelled.
   */
  cancelledAt: Date | undefined;

  // ===========================================================================
  // Settlement Items
  // ===========================================================================

  /**
   * Settlement Items owned by this aggregate.
   */
  items: FinancialSettlementItemResponse[];

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * Timestamp at which the Settlement was created.
   */
  createdAt: Date;

  /**
   * Timestamp at which the Settlement was last updated.
   */
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

/**
 * Maps Financial Settlement domain objects into REST response objects.
 *
 * Preferred usage:
 *
 *     FinancialSettlementResponseMapper.toResponse(aggregate)
 *
 * for complete Financial Settlement aggregate responses.
 *
 * The mapper also supports mapping the Settlement entity independently when
 * a query explicitly returns the entity.
 *
 * Child Items and Allocations are mapped recursively.
 */
export class FinancialSettlementResponseMapper {
  // ===========================================================================
  // Aggregate
  // ===========================================================================

  /**
   * Maps a fully rehydrated Financial Settlement aggregate.
   *
   * This is the preferred mapping method for REST responses because the
   * aggregate represents the application's domain boundary.
   */
  public static toResponse(
    aggregate: FinancialSettlementAggregate,
  ): FinancialSettlementResponse {
    return this.fromEntity(aggregate.settlement);
  }

  // ===========================================================================
  // Settlement Entity
  // ===========================================================================

  /**
   * Maps a Financial Settlement entity into its REST representation.
   *
   * Only primitive, transport-safe values are exposed.
   *
   * Internal Entity IDs and Value Objects never cross the REST boundary.
   */
  public static fromEntity(
    settlement: FinancialSettlementEntity,
  ): FinancialSettlementResponse {
    const items = settlement.items.map((item) =>
      this.fromItemEntity(item, settlement.publicId.value),
    );

    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: settlement.publicId.value,

      // -----------------------------------------------------------------------
      // Settlement
      // -----------------------------------------------------------------------

      status: settlement.status.value,

      currency: settlement.currency.value,

      totalAmount: settlement.totalAmount.amount,

      // -----------------------------------------------------------------------
      // Allocation Summary
      // -----------------------------------------------------------------------
      //
      // Use the aggregate's authoritative domain calculations rather than
      // duplicating financial calculations in the REST mapper.
      //

      allocatedAmount: this.getAllocatedAmount(settlement),

      remainingAmount: this.getRemainingAmount(settlement),

      hasItems: settlement.hasItems(),

      itemCount: settlement.itemCount(),

      isFullyAllocated: settlement.isFullyAllocated(),

      areAllItemsAllocated: settlement.areAllItemsAllocated(),

      areAllItemsSettled: settlement.areAllItemsSettled(),

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      isPending: settlement.isPending(),

      isProcessing: settlement.isProcessing(),

      isCompleted: settlement.isCompleted(),

      isFailed: settlement.isFailed(),

      isCancelled: settlement.isCancelled(),

      isTerminal: settlement.isTerminal(),

      isSuccessful: settlement.isSuccessful(),

      // -----------------------------------------------------------------------
      // Lifecycle Audit
      // -----------------------------------------------------------------------

      startedAt: settlement.startedAt,

      completedAt: settlement.completedAt,

      failedAt: settlement.failedAt,

      cancelledAt: settlement.cancelledAt,

      // -----------------------------------------------------------------------
      // Settlement Items
      // -----------------------------------------------------------------------

      items,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: settlement.createdAt,

      updatedAt: settlement.updatedAt,
    };
  }

  // ===========================================================================
  // Settlement Allocation Summary
  // ===========================================================================

  /**
   * Returns the aggregate-owned allocated amount as a primitive.
   *
   * Money exposes `.amount`, not `.value`.
   */
  private static getAllocatedAmount(
    settlement: FinancialSettlementEntity,
  ): number {
    return settlement.items.reduce(
      (total, item) => total + item.getAllocatedAmount().amount,
      0,
    );
  }

  /**
   * Returns the aggregate-owned remaining amount as a primitive.
   *
   * Money exposes `.amount`, not `.value`.
   */
  private static getRemainingAmount(
    settlement: FinancialSettlementEntity,
  ): number {
    return settlement.totalAmount.amount - this.getAllocatedAmount(settlement);
  }

  // ===========================================================================
  // Settlement Item
  // ===========================================================================

  /**
   * Maps a Settlement Item entity into its REST representation.
   *
   * Allocations are recursively mapped as nested child resources.
   */
  public static fromItemEntity(
    item: FinancialSettlementItemEntity,
    settlementPublicId: string,
  ): FinancialSettlementItemResponse {
    const allocations = item.allocations.map((allocation) =>
      this.fromAllocationEntity(allocation, item.publicId.value),
    );

    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: item.publicId.value,

      settlementPublicId,

      // -----------------------------------------------------------------------
      // Business Reference
      // -----------------------------------------------------------------------

      referenceType: item.referenceType.value,

      referencePublicId: item.referencePublicId.value,

      // -----------------------------------------------------------------------
      // Amount
      // -----------------------------------------------------------------------

      amount: item.amount.amount,

      currency: item.amount.currency.value,

      allocatedAmount: item.getAllocatedAmount().amount,

      remainingAmount: item.getRemainingAmount().amount,

      hasAllocations: item.hasAllocations(),

      allocationCount: item.allocationCount(),

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      status: item.status.value,

      isPending: item.isPending(),

      isAllocated: item.isAllocated(),

      isSettled: item.isSettled(),

      isCancelled: item.isCancelled(),

      isTerminal: item.isTerminal(),

      // -----------------------------------------------------------------------
      // Allocations
      // -----------------------------------------------------------------------

      allocations,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: item.createdAt,

      updatedAt: item.updatedAt,
    };
  }

  // ===========================================================================
  // Allocation
  // ===========================================================================

  /**
   * Maps a Settlement Allocation entity into its REST representation.
   *
   * IMPORTANT:
   *
   * FinancialSettlementAllocationEntity currently stores the destination
   * Financial Account as an internal UniqueEntityId (`accountId`).
   *
   * That internal identifier must NOT cross the REST boundary.
   *
   * Therefore accountPublicId remains undefined until the domain model
   * provides an opaque FinancialAccountPublicId reference.
   */
  public static fromAllocationEntity(
    allocation: FinancialSettlementAllocationEntity,
    settlementItemPublicId: string,
  ): FinancialSettlementAllocationResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: allocation.publicId.value,

      // -----------------------------------------------------------------------
      // Owning Settlement Item
      // -----------------------------------------------------------------------

      settlementItemPublicId,

      // -----------------------------------------------------------------------
      // Destination Account
      // -----------------------------------------------------------------------
      //
      // DO NOT expose:
      //
      //     allocation.accountId.value
      //
      // because accountId is an internal Entity ID.
      //
      // -----------------------------------------------------------------------

      accountPublicId: undefined,

      // -----------------------------------------------------------------------
      // Allocation
      // -----------------------------------------------------------------------

      type: allocation.type.value,

      amount: allocation.amount.amount,

      currency: allocation.amount.currency.value,

      // -----------------------------------------------------------------------
      // Financial Transaction
      // -----------------------------------------------------------------------

      transactionPublicId: allocation.transactionPublicId?.value,

      hasTransaction: allocation.hasTransaction(),

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: allocation.createdAt,

      updatedAt: allocation.updatedAt,
    };
  }

  // ===========================================================================
  // Aggregate Collection
  // ===========================================================================

  /**
   * Maps a collection of Financial Settlement aggregates.
   *
   * Useful for list/query responses.
   */
  public static fromAggregates(
    aggregates: readonly FinancialSettlementAggregate[],
  ): FinancialSettlementResponse[] {
    return aggregates.map((aggregate) => this.toResponse(aggregate));
  }

  // ===========================================================================
  // Settlement Entity Collection
  // ===========================================================================

  /**
   * Maps a collection of Financial Settlement entities.
   *
   * Useful when a query explicitly returns Settlement entities without
   * wrapping them in aggregates.
   */
  public static fromEntities(
    settlements: readonly FinancialSettlementEntity[],
  ): FinancialSettlementResponse[] {
    return settlements.map((settlement) => this.fromEntity(settlement));
  }

  // ===========================================================================
  // Item Collection
  // ===========================================================================

  /**
   * Maps a collection of Settlement Item entities.
   *
   * Useful for:
   *
   * GET /financial-settlements/:settlementPublicId/items
   */
  public static fromItemEntities(
    items: readonly FinancialSettlementItemEntity[],
    settlementPublicId: string,
  ): FinancialSettlementItemResponse[] {
    return items.map((item) => this.fromItemEntity(item, settlementPublicId));
  }

  // ===========================================================================
  // Allocation Collection
  // ===========================================================================

  /**
   * Maps a collection of Settlement Allocation entities.
   *
   * The owning Settlement Item public identifier must be supplied because
   * the allocation entity stores only the internal Settlement Item ID.
   */
  public static fromAllocationEntities(
    allocations: readonly FinancialSettlementAllocationEntity[],
    settlementItemPublicId: string,
  ): FinancialSettlementAllocationResponse[] {
    return allocations.map((allocation) =>
      this.fromAllocationEntity(allocation, settlementItemPublicId),
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FinancialSettlementResponseMapper;
