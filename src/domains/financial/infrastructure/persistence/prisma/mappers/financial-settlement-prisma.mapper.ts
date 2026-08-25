// -----------------------------------------------------------------------------
// Financial Settlement Prisma Mapper
// -----------------------------------------------------------------------------
//
// Maps the complete Financial Settlement aggregate:
//
// FinancialSettlementAggregate
// ├── FinancialSettlementEntity
// └── FinancialSettlementItemEntity[]
//     └── FinancialSettlementAllocationEntity[]
//
// Persistence responsibilities:
//
// - Translate Prisma Financial Settlement records into domain entities.
// - Translate Prisma Financial Settlement Item records into domain entities.
// - Translate Prisma Financial Settlement Allocation records into domain
//   entities.
// - Rehydrate the complete Financial Settlement aggregate.
// - Translate the complete aggregate into Prisma persistence structures.
// - Preserve internal database identities.
// - Preserve public domain identities.
// - Preserve settlement/item ownership.
// - Preserve allocation/item ownership.
// - Preserve allocation FinancialAccount internal ownership.
// - Preserve currency values.
// - Preserve settlement lifecycle.
// - Preserve settlement item lifecycle.
// - Preserve allocation types.
// - Preserve originating business references.
// - Preserve resulting Financial Transaction references.
//
// The mapper does NOT:
//
// - execute settlement lifecycle transitions;
// - calculate settlement amounts;
// - calculate commissions;
// - resolve FinancialAccount public IDs;
// - execute Prisma queries;
// - persist data;
// - perform settlement;
// - move money.
//
// Those responsibilities belong to the domain and repository/application
// layers respectively.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type {
  FinancialSettlement as PrismaFinancialSettlement,
  FinancialSettlementItem as PrismaFinancialSettlementItem,
  FinancialSettlementAllocation as PrismaFinancialSettlementAllocation,
  FinancialSettlementStatus as PrismaFinancialSettlementStatus,
  FinancialSettlementItemStatus as PrismaFinancialSettlementItemStatus,
  FinancialSettlementAllocationType as PrismaFinancialSettlementAllocationType,
} from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { FinancialSettlementAggregate } from '../../../../domain/aggregates/financial-settlement.aggregate';

// -----------------------------------------------------------------------------
// Entities
// -----------------------------------------------------------------------------

import { FinancialSettlementEntity } from '../../../../domain/entities/financial-settlement.entity';

import { FinancialSettlementItemEntity } from '../../../../domain/entities/financial-settlement-item.entity';

import { FinancialSettlementAllocationEntity } from '../../../../domain/entities/financial-settlement-allocation.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import {
  Currency,
  FinancialReferencePublicId,
  FinancialReferenceType,
  FinancialSettlementAllocationPublicId,
  FinancialSettlementAllocationType,
  FinancialSettlementItemPublicId,
  FinancialSettlementItemStatus,
  FinancialSettlementPublicId,
  FinancialSettlementStatus,
  FinancialTransactionPublicId,
  Money,
} from '../../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Domain Value Types
// -----------------------------------------------------------------------------

import {
  FinancialSettlementAllocationTypeValue,
  FinancialSettlementItemStatusValue,
  FinancialSettlementStatusValue,
} from '../../../../domain/value-objects';

// =============================================================================
// Prisma → Domain Enum Conversion
// =============================================================================

/**
 * Converts a persisted Prisma FinancialSettlementStatus into the
 * corresponding domain FinancialSettlementStatusValue.
 *
 * Infrastructure enum values must not leak into the domain layer.
 */
function toDomainSettlementStatus(
  value: PrismaFinancialSettlementStatus,
): FinancialSettlementStatusValue {
  switch (value) {
    case 'PENDING':
      return FinancialSettlementStatusValue.PENDING;

    case 'PROCESSING':
      return FinancialSettlementStatusValue.PROCESSING;

    case 'COMPLETED':
      return FinancialSettlementStatusValue.COMPLETED;

    case 'FAILED':
      return FinancialSettlementStatusValue.FAILED;

    case 'CANCELLED':
      return FinancialSettlementStatusValue.CANCELLED;

    default:
      throw new Error(
        `Invalid persisted Financial Settlement status "${String(value)}".`,
      );
  }
}

// =============================================================================
// Prisma → Domain Settlement Item Status
// =============================================================================

/**
 * Converts a persisted Prisma FinancialSettlementItemStatus into the
 * corresponding domain FinancialSettlementItemStatusValue.
 *
 * Infrastructure enum values must not leak into the domain layer.
 */
function toDomainSettlementItemStatus(
  value: PrismaFinancialSettlementItemStatus,
): FinancialSettlementItemStatusValue {
  switch (value) {
    case 'PENDING':
      return FinancialSettlementItemStatusValue.PENDING;

    case 'ALLOCATED':
      return FinancialSettlementItemStatusValue.ALLOCATED;

    case 'SETTLED':
      return FinancialSettlementItemStatusValue.SETTLED;

    case 'CANCELLED':
      return FinancialSettlementItemStatusValue.CANCELLED;

    default:
      throw new Error(
        `Invalid persisted Financial Settlement Item status "${String(value)}".`,
      );
  }
}

// =============================================================================
// Prisma → Domain Allocation Type
// =============================================================================

/**
 * Converts a persisted Prisma FinancialSettlementAllocationType into the
 * corresponding domain FinancialSettlementAllocationTypeValue.
 *
 * Infrastructure enum values must not leak into the domain layer.
 */
function toDomainAllocationType(
  value: PrismaFinancialSettlementAllocationType,
): FinancialSettlementAllocationTypeValue {
  switch (value) {
    case 'PRINCIPAL':
      return FinancialSettlementAllocationTypeValue.PRINCIPAL;

    case 'COMMISSION':
      return FinancialSettlementAllocationTypeValue.COMMISSION;

    case 'FEE':
      return FinancialSettlementAllocationTypeValue.FEE;

    case 'ADJUSTMENT':
      return FinancialSettlementAllocationTypeValue.ADJUSTMENT;

    default:
      throw new Error(
        `Invalid persisted Financial Settlement Allocation type "${String(value)}".`,
      );
  }
}

// =============================================================================
// Prisma Graph Types
// =============================================================================

/**
 * Prisma Financial Settlement record with the complete aggregate graph.
 *
 * FinancialSettlement
 * └── FinancialSettlementItem[]
 *     └── FinancialSettlementAllocation[]
 */
export type FinancialSettlementWithItems = PrismaFinancialSettlement & {
  items: Array<
    PrismaFinancialSettlementItem & {
      allocations: PrismaFinancialSettlementAllocation[];
    }
  >;
};

// =============================================================================
// Persistence Types
// =============================================================================

/**
 * Complete Financial Settlement persistence structure.
 *
 * The repository is responsible for persisting these structures atomically.
 */
export interface FinancialSettlementPersistence {
  settlement: ReturnType<
    typeof FinancialSettlementPrismaMapper.settlementToPersistence
  >;

  items: Array<
    ReturnType<typeof FinancialSettlementPrismaMapper.itemToPersistence>
  >;

  allocations: Array<
    ReturnType<typeof FinancialSettlementPrismaMapper.allocationToPersistence>
  >;
}

// =============================================================================
// Mapper
// =============================================================================

export class FinancialSettlementPrismaMapper {
  // ===========================================================================
  // Prisma → Aggregate
  // ===========================================================================

  /**
   * Rehydrates the complete Financial Settlement aggregate.
   *
   * Rehydration flow:
   *
   * 1. Rehydrate the Financial Settlement entity.
   * 2. Rehydrate every Settlement Item.
   * 3. Rehydrate every Item's allocations.
   * 4. Attach Items through the aggregate root.
   * 5. Restore the persisted root updatedAt timestamp.
   * 6. Rehydrate the aggregate.
   *
   * No domain events are emitted.
   */
  public static toDomain(
    record: FinancialSettlementWithItems,
  ): FinancialSettlementAggregate {
    if (!record.items) {
      throw new Error(
        `Financial Settlement "${record.publicId}" cannot be rehydrated without its items.`,
      );
    }

    // -------------------------------------------------------------------------
    // Settlement Root
    // -------------------------------------------------------------------------

    const settlement = this.settlementToDomain(record);

    // -------------------------------------------------------------------------
    // Settlement Items
    // -------------------------------------------------------------------------

    const items = record.items.map((item) => this.itemToDomain(item));

    // -------------------------------------------------------------------------
    // Attach Items Through Aggregate Root
    // -------------------------------------------------------------------------

    for (const item of items) {
      settlement.addItem(item);
    }

    // -------------------------------------------------------------------------
    // Restore Persistence Timestamp
    // -------------------------------------------------------------------------

    settlement.setUpdatedAt(record.updatedAt);

    // -------------------------------------------------------------------------
    // Aggregate Rehydration
    // -------------------------------------------------------------------------

    return FinancialSettlementAggregate.rehydrate(settlement);
  }

  // ===========================================================================
  // Prisma → Financial Settlement Entity
  // ===========================================================================

  /**
   * Maps a persisted Prisma FinancialSettlement record into a
   * FinancialSettlementEntity.
   */
  public static settlementToDomain(
    record: PrismaFinancialSettlement,
  ): FinancialSettlementEntity {
    // -------------------------------------------------------------------------
    // Public Identity
    // -------------------------------------------------------------------------

    const publicId = new FinancialSettlementPublicId(record.publicId);

    // -------------------------------------------------------------------------
    // Status
    // -------------------------------------------------------------------------

    const status = FinancialSettlementStatus.create(
      toDomainSettlementStatus(record.status),
    );

    // -------------------------------------------------------------------------
    // Currency
    // -------------------------------------------------------------------------

    const currency = Currency.create(record.currency);

    // -------------------------------------------------------------------------
    // Total Amount
    // -------------------------------------------------------------------------

    const totalAmount = Money.create(record.totalAmount, currency);

    // -------------------------------------------------------------------------
    // Entity
    // -------------------------------------------------------------------------

    return new FinancialSettlementEntity(
      {
        status,

        currency,

        totalAmount,

        // Items are aggregate-owned and attached separately.
        items: [],

        startedAt: record.startedAt ?? undefined,

        completedAt: record.completedAt ?? undefined,

        failedAt: record.failedAt ?? undefined,

        cancelledAt: record.cancelledAt ?? undefined,

        createdAt: record.createdAt,

        updatedAt: record.updatedAt,
      },

      // Internal Persistence Identity
      new UniqueEntityId(record.id),

      // Public Domain Identity
      publicId,
    );
  }

  // ===========================================================================
  // Financial Settlement Entity → Prisma
  // ===========================================================================

  /**
   * Converts a FinancialSettlementEntity into its Prisma persistence shape.
   *
   * Domain value objects are flattened into persistence primitives.
   */
  public static settlementToPersistence(entity: FinancialSettlementEntity): {
    id: string;
    publicId: string;
    status: PrismaFinancialSettlementStatus;
    currency: string;
    totalAmount: number;
    startedAt: Date | null;
    completedAt: Date | null;
    failedAt: Date | null;
    cancelledAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      id: entity.id.toString(),

      publicId: entity.publicId.value,

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      status: entity.status.value,

      // -----------------------------------------------------------------------
      // Monetary State
      // -----------------------------------------------------------------------

      currency: entity.currency.value,

      totalAmount: entity.totalAmount.amount,

      // -----------------------------------------------------------------------
      // Lifecycle Timestamps
      // -----------------------------------------------------------------------

      startedAt: entity.startedAt ?? null,

      completedAt: entity.completedAt ?? null,

      failedAt: entity.failedAt ?? null,

      cancelledAt: entity.cancelledAt ?? null,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Prisma → Financial Settlement Item Entity
  // ===========================================================================

  /**
   * Maps a persisted Prisma FinancialSettlementItem and its allocations
   * into a FinancialSettlementItemEntity.
   *
   * IMPORTANT:
   *
   * FinancialSettlementItemEntity requires a business reference.
   *
   * Therefore:
   *
   * - referenceType MUST be present;
   * - referencePublicId MUST be present;
   * - both fields must be persisted together.
   *
   * A NULL reference is invalid persisted state and is rejected rather than
   * weakening the domain model with optional properties.
   */
  public static itemToDomain(
    record: PrismaFinancialSettlementItem & {
      allocations?: PrismaFinancialSettlementAllocation[];
    },
  ): FinancialSettlementItemEntity {
    // -------------------------------------------------------------------------
    // Public Identity
    // -------------------------------------------------------------------------

    const publicId = new FinancialSettlementItemPublicId(record.publicId);

    // -------------------------------------------------------------------------
    // Aggregate Ownership
    // -------------------------------------------------------------------------

    const settlementId = new UniqueEntityId(record.settlementId);

    // -------------------------------------------------------------------------
    // Business Reference
    // -------------------------------------------------------------------------

    const reference = this.resolveReference(
      record.referenceType,
      record.referencePublicId,
      record.publicId,
    );

    // -------------------------------------------------------------------------
    // Status
    // -------------------------------------------------------------------------

    const status = FinancialSettlementItemStatus.create(
      toDomainSettlementItemStatus(record.status),
    );

    // -------------------------------------------------------------------------
    // Currency
    // -------------------------------------------------------------------------

    const currency = Currency.create(record.currency);

    // -------------------------------------------------------------------------
    // Amount
    // -------------------------------------------------------------------------

    const amount = Money.create(record.amount, currency);

    // -------------------------------------------------------------------------
    // Allocations
    // -------------------------------------------------------------------------

    const allocations =
      record.allocations?.map((allocation) =>
        this.allocationToDomain(allocation),
      ) ?? [];

    // -------------------------------------------------------------------------
    // Entity
    // -------------------------------------------------------------------------

    return new FinancialSettlementItemEntity(
      {
        // ---------------------------------------------------------------------
        // Aggregate Ownership
        // ---------------------------------------------------------------------

        settlementId,

        // ---------------------------------------------------------------------
        // Business Reference
        // ---------------------------------------------------------------------

        /**
         * resolveReference() guarantees both values are defined.
         */
        referenceType: reference.referenceType,

        referencePublicId: reference.referencePublicId,

        // ---------------------------------------------------------------------
        // Monetary State
        // ---------------------------------------------------------------------

        amount,

        // ---------------------------------------------------------------------
        // Currency
        // ---------------------------------------------------------------------

        // FinancialSettlementItemProps does not currently contain a separate
        // currency property. Money already carries the currency.
        //
        // Therefore `currency` is intentionally not passed here.

        // ---------------------------------------------------------------------
        // Lifecycle
        // ---------------------------------------------------------------------

        status,

        // ---------------------------------------------------------------------
        // Allocations
        // ---------------------------------------------------------------------

        allocations,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: record.createdAt,

        updatedAt: record.updatedAt,
      },

      // -----------------------------------------------------------------------
      // Internal Persistence Identity
      // -----------------------------------------------------------------------

      new UniqueEntityId(record.id),

      // -----------------------------------------------------------------------
      // Public Domain Identity
      // -----------------------------------------------------------------------

      publicId,
    );
  }

  // ===========================================================================
  // Financial Settlement Item Entity → Prisma
  // ===========================================================================

  /**
   * Converts a FinancialSettlementItemEntity into its Prisma persistence
   * shape.
   *
   * The business reference is mandatory in the domain and therefore mandatory
   * at the persistence boundary as well.
   */
  public static itemToPersistence(entity: FinancialSettlementItemEntity): {
    id: string;
    publicId: string;
    settlementId: string;
    referenceType: string;
    referencePublicId: string;
    amount: number;
    currency: string;
    status: PrismaFinancialSettlementItemStatus;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      id: entity.id.toString(),

      publicId: entity.publicId.value,

      // -----------------------------------------------------------------------
      // Aggregate Ownership
      // -----------------------------------------------------------------------

      settlementId: entity.settlementId.toString(),

      // -----------------------------------------------------------------------
      // Business Reference
      // -----------------------------------------------------------------------

      referenceType: entity.referenceType.value,

      referencePublicId: entity.referencePublicId.value,

      // -----------------------------------------------------------------------
      // Monetary State
      // -----------------------------------------------------------------------

      amount: entity.amount.amount,

      currency: entity.amount.currency.value,

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      status: entity.status.value,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Prisma → Financial Settlement Allocation Entity
  // ===========================================================================

  /**
   * Maps a persisted Prisma FinancialSettlementAllocation record into a
   * FinancialSettlementAllocationEntity.
   *
   * Preserves:
   *
   * - internal allocation identity;
   * - public allocation identity;
   * - owning Settlement Item identity;
   * - Financial Account internal identity;
   * - allocation type;
   * - monetary amount;
   * - currency;
   * - optional Financial Transaction public identity;
   * - audit timestamps.
   */
  public static allocationToDomain(
    record: PrismaFinancialSettlementAllocation,
  ): FinancialSettlementAllocationEntity {
    // -------------------------------------------------------------------------
    // Public Identity
    // -------------------------------------------------------------------------

    const publicId = new FinancialSettlementAllocationPublicId(record.publicId);

    // -------------------------------------------------------------------------
    // Settlement Item Ownership
    // -------------------------------------------------------------------------

    const settlementItemId = new UniqueEntityId(record.settlementItemId);

    // -------------------------------------------------------------------------
    // Financial Account Identity
    // -------------------------------------------------------------------------

    const accountId = new UniqueEntityId(record.accountId);

    // -------------------------------------------------------------------------
    // Allocation Type
    // -------------------------------------------------------------------------

    const type = FinancialSettlementAllocationType.create(
      toDomainAllocationType(record.type),
    );

    // -------------------------------------------------------------------------
    // Currency
    // -------------------------------------------------------------------------

    const currency = Currency.create(record.currency);

    // -------------------------------------------------------------------------
    // Amount
    // -------------------------------------------------------------------------

    const amount = Money.create(record.amount, currency);

    // -------------------------------------------------------------------------
    // Financial Transaction Reference
    // -------------------------------------------------------------------------

    const transactionPublicId =
      record.transactionPublicId !== null
        ? new FinancialTransactionPublicId(record.transactionPublicId)
        : undefined;

    // -------------------------------------------------------------------------
    // Entity
    // -------------------------------------------------------------------------

    return new FinancialSettlementAllocationEntity(
      {
        // ---------------------------------------------------------------------
        // Aggregate Ownership
        // ---------------------------------------------------------------------

        settlementItemId,

        // ---------------------------------------------------------------------
        // Financial Account
        // ---------------------------------------------------------------------

        accountId,

        // ---------------------------------------------------------------------
        // Allocation
        // ---------------------------------------------------------------------

        type,

        amount,

        // ---------------------------------------------------------------------
        // Resulting Financial Transaction
        // ---------------------------------------------------------------------

        transactionPublicId,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: record.createdAt,

        updatedAt: record.updatedAt,
      },

      // -----------------------------------------------------------------------
      // Internal Persistence Identity
      // -----------------------------------------------------------------------

      new UniqueEntityId(record.id),

      // -----------------------------------------------------------------------
      // Public Domain Identity
      // -----------------------------------------------------------------------

      publicId,
    );
  }

  // ===========================================================================
  // Financial Settlement Allocation Entity → Prisma
  // ===========================================================================

  /**
   * Converts a FinancialSettlementAllocationEntity into its Prisma
   * persistence shape.
   */
  public static allocationToPersistence(
    entity: FinancialSettlementAllocationEntity,
  ): {
    id: string;
    publicId: string;
    settlementItemId: string;
    accountId: string;
    type: PrismaFinancialSettlementAllocationType;
    amount: number;
    currency: string;
    transactionPublicId: string | null;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      id: entity.id.toString(),

      publicId: entity.publicId.value,

      // -----------------------------------------------------------------------
      // Aggregate Ownership
      // -----------------------------------------------------------------------

      settlementItemId: entity.settlementItemId.toString(),

      // -----------------------------------------------------------------------
      // Financial Account
      // -----------------------------------------------------------------------

      accountId: entity.accountId.toString(),

      // -----------------------------------------------------------------------
      // Allocation
      // -----------------------------------------------------------------------

      type: entity.type.value,

      amount: entity.amount.amount,

      currency: entity.amount.currency.value,

      // -----------------------------------------------------------------------
      // Resulting Financial Transaction
      // -----------------------------------------------------------------------

      transactionPublicId: entity.transactionPublicId?.value ?? null,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Aggregate → Persistence
  // ===========================================================================

  /**
   * Converts the complete FinancialSettlementAggregate into persistence
   * structures.
   *
   * No Prisma operation is performed here.
   *
   * The repository is responsible for persisting the returned structures
   * atomically.
   */
  public static toPersistence(
    aggregate: FinancialSettlementAggregate,
  ): FinancialSettlementPersistence {
    const settlement = this.settlementToPersistence(aggregate.settlement);

    const items = aggregate.items.map((item) => this.itemToPersistence(item));

    const allocations = aggregate.items.flatMap((item) =>
      item.allocations.map((allocation) =>
        this.allocationToPersistence(allocation),
      ),
    );

    return {
      settlement,

      items,

      allocations,
    };
  }

  // ===========================================================================
  // Prisma Component → Domain Entity
  // ===========================================================================

  /**
   * Maps an individual Prisma Financial Settlement component into its
   * corresponding domain entity.
   *
   * Complete aggregate rehydration should use toDomain().
   */
  public static toDomainComponent(
    record:
      | PrismaFinancialSettlement
      | (PrismaFinancialSettlementItem & {
          allocations?: PrismaFinancialSettlementAllocation[];
        })
      | PrismaFinancialSettlementAllocation,
  ):
    | FinancialSettlementEntity
    | FinancialSettlementItemEntity
    | FinancialSettlementAllocationEntity {
    // -------------------------------------------------------------------------
    // Allocation
    // -------------------------------------------------------------------------

    if (this.isFinancialSettlementAllocationRecord(record)) {
      return this.allocationToDomain(record);
    }

    // -------------------------------------------------------------------------
    // Settlement Item
    // -------------------------------------------------------------------------

    if (this.isFinancialSettlementItemRecord(record)) {
      return this.itemToDomain(record);
    }

    // -------------------------------------------------------------------------
    // Settlement
    // -------------------------------------------------------------------------

    if (this.isFinancialSettlementRecord(record)) {
      return this.settlementToDomain(record);
    }

    throw new Error(
      'Unsupported Financial Settlement Prisma record supplied to mapper.',
    );
  }

  // ===========================================================================
  // Prisma Record Guards
  // ===========================================================================

  /**
   * Identifies a FinancialSettlement Prisma record.
   *
   * Settlement-specific fields are used instead of common persistence fields.
   */
  private static isFinancialSettlementRecord(
    record:
      | PrismaFinancialSettlement
      | (PrismaFinancialSettlementItem & {
          allocations?: PrismaFinancialSettlementAllocation[];
        })
      | PrismaFinancialSettlementAllocation,
  ): record is PrismaFinancialSettlement {
    return (
      'totalAmount' in record &&
      'startedAt' in record &&
      'completedAt' in record &&
      'failedAt' in record &&
      'cancelledAt' in record &&
      !('settlementId' in record) &&
      !('settlementItemId' in record)
    );
  }

  /**
   * Identifies a FinancialSettlementItem Prisma record.
   *
   * The allocations relation is intentionally optional because it only exists
   * when Prisma explicitly includes the relation.
   */
  private static isFinancialSettlementItemRecord(
    record:
      | PrismaFinancialSettlement
      | (PrismaFinancialSettlementItem & {
          allocations?: PrismaFinancialSettlementAllocation[];
        })
      | PrismaFinancialSettlementAllocation,
  ): record is PrismaFinancialSettlementItem & {
    allocations?: PrismaFinancialSettlementAllocation[];
  } {
    return (
      'settlementId' in record &&
      'referenceType' in record &&
      'referencePublicId' in record &&
      'amount' in record &&
      'status' in record &&
      !('settlementItemId' in record)
    );
  }

  /**
   * Identifies a FinancialSettlementAllocation Prisma record.
   */
  private static isFinancialSettlementAllocationRecord(
    record:
      | PrismaFinancialSettlement
      | (PrismaFinancialSettlementItem & {
          allocations?: PrismaFinancialSettlementAllocation[];
        })
      | PrismaFinancialSettlementAllocation,
  ): record is PrismaFinancialSettlementAllocation {
    return (
      'settlementItemId' in record &&
      'accountId' in record &&
      'type' in record &&
      'amount' in record &&
      'transactionPublicId' in record
    );
  }

  // ===========================================================================
  // Business Reference Resolution
  // ===========================================================================

  /**
   * Reconstructs the mandatory business reference represented by:
   *
   *   referenceType
   *   referencePublicId
   *
   * FinancialSettlementItemEntity requires both values.
   *
   * Valid persisted state:
   *
   *   referenceType      != NULL
   *   referencePublicId != NULL
   *
   * Invalid persisted states:
   *
   *   NULL + NULL
   *   VALUE + NULL
   *   NULL + VALUE
   *
   * A Settlement Item without a business reference is not a valid domain
   * object and therefore must not be rehydrated.
   */
  private static resolveReference(
    referenceType: string | null,
    referencePublicId: string | null,
    itemPublicId: string,
  ): {
    referenceType: FinancialReferenceType;
    referencePublicId: FinancialReferencePublicId;
  } {
    // -------------------------------------------------------------------------
    // Both absent
    // -------------------------------------------------------------------------

    if (referenceType === null && referencePublicId === null) {
      throw new Error(
        `Financial Settlement Item "${itemPublicId}" is missing its business reference.`,
      );
    }

    // -------------------------------------------------------------------------
    // Incomplete Reference
    // -------------------------------------------------------------------------

    if (referenceType === null || referencePublicId === null) {
      throw new Error(
        `Financial Settlement Item "${itemPublicId}" contains an incomplete business reference.`,
      );
    }

    // -------------------------------------------------------------------------
    // Complete Reference
    // -------------------------------------------------------------------------

    return {
      referenceType: FinancialReferenceType.create(referenceType),

      referencePublicId: FinancialReferencePublicId.create(referencePublicId),
    };
  }
}
