// -----------------------------------------------------------------------------
// Accounting Period — Prisma Mapper
// -----------------------------------------------------------------------------
//
// Maps the Accounting Period aggregate:
//
// AccountingPeriodAggregate
// └── AccountingPeriodEntity
//
// Persistence:
//
// AccountingPeriod
//
// Accounting Period is an independent aggregate root.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - map Prisma AccountingPeriod records into the domain;
// - rehydrate AccountingPeriodEntity without emitting domain events;
// - map AccountingPeriodEntity into Prisma persistence values;
// - map AccountingPeriodAggregate into persistence;
// - preserve internal entity identity;
// - preserve public identity;
// - preserve accounting calendar ownership;
// - preserve the accounting period key;
// - translate Prisma enum values into domain value objects;
// - translate domain value objects into Prisma enum/primitive values;
// - preserve optional closedAt lifecycle state;
// - preserve period boundary timestamps;
// - preserve audit timestamps.
//
// -----------------------------------------------------------------------------
//
// Nullable ownership mapping:
//
// Prisma calendarId / periodKey
//     ↓
// Domain UniqueEntityId / AccountingPeriodKey
//
// Prisma null
//     ↓
// Domain undefined
//
// Domain undefined
//     ↓
// Prisma null
//
// Calendar identity and period key must either both exist or both be absent.
//
// -----------------------------------------------------------------------------
//
// Journal relationships are intentionally NOT mapped here.
//
// AccountingJournal belongs to its own aggregate:
//
// AccountingJournalAggregate
// └── AccountingJournalEntity
//
// The Accounting Period aggregate owns only AccountingPeriodEntity.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { AccountingPeriod as PrismaAccountingPeriod } from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { AccountingPeriodAggregate } from '../../../../domain/aggregates/accounting-period.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { AccountingPeriodEntity } from '../../../../domain/entities/accounting-period.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import {
  AccountingPeriodKey,
  AccountingPeriodPublicId,
  AccountingPeriodName,
  AccountingPeriodStatus,
} from '../../../../domain/value-objects';

// =============================================================================
// Persistence Types
// =============================================================================

/**
 * Persistence representation of the Accounting Period aggregate.
 *
 * Accounting Period is a single-entity aggregate.
 *
 * Journals are not part of this persistence structure because they belong to
 * the Accounting Journal aggregate.
 */
export interface AccountingPeriodPersistence {
  period: ReturnType<typeof AccountingPeriodPrismaMapper.periodToPersistence>;
}

// =============================================================================
// Mapper
// =============================================================================

export class AccountingPeriodPrismaMapper {
  // ===========================================================================
  // Prisma → Domain Aggregate
  // ===========================================================================

  /**
   * Rehydrates a complete Accounting Period aggregate from a Prisma
   * AccountingPeriod record.
   *
   * Rehydration does not emit domain events.
   */
  public static toDomain(
    record: PrismaAccountingPeriod,
  ): AccountingPeriodAggregate {
    return AccountingPeriodAggregate.rehydrate(this.periodToDomain(record));
  }

  // ===========================================================================
  // Prisma → Domain Entity
  // ===========================================================================

  /**
   * Rehydrates an AccountingPeriodEntity from a persisted Prisma record.
   *
   * Rehydration does not emit domain events.
   */
  public static periodToDomain(
    record: PrismaAccountingPeriod,
  ): AccountingPeriodEntity {
    if (record === undefined || record === null) {
      throw new Error('Accounting Period Prisma record is required.');
    }

    // -------------------------------------------------------------------------
    // Public Identity
    // -------------------------------------------------------------------------

    const publicId = new AccountingPeriodPublicId(record.publicId);

    // -------------------------------------------------------------------------
    // Calendar Ownership
    // -------------------------------------------------------------------------

    // Prisma represents absent calendar ownership as null.
    // The domain represents absent calendar ownership as undefined.

    const calendarId =
      record.calendarId !== null
        ? new UniqueEntityId(record.calendarId)
        : undefined;

    const periodKey =
      record.periodKey !== null
        ? AccountingPeriodKey.create(record.periodKey)
        : undefined;

    // -------------------------------------------------------------------------
    // Closing Timestamp
    // -------------------------------------------------------------------------

    // Prisma represents an absent closing timestamp as null.
    // The domain represents it as undefined.

    const closedAt =
      record.closedAt !== null
        ? new Date(record.closedAt.getTime())
        : undefined;

    // -------------------------------------------------------------------------
    // Domain Rehydration
    // -------------------------------------------------------------------------

    return AccountingPeriodEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Calendar Ownership
        // ---------------------------------------------------------------------

        calendarId,
        periodKey,

        // ---------------------------------------------------------------------
        // Definition
        // ---------------------------------------------------------------------

        name: AccountingPeriodName.create(record.name),

        // ---------------------------------------------------------------------
        // Period Boundaries
        // ---------------------------------------------------------------------

        startsAt: new Date(record.startsAt.getTime()),

        endsAt: new Date(record.endsAt.getTime()),

        // ---------------------------------------------------------------------
        // Lifecycle
        // ---------------------------------------------------------------------

        status: AccountingPeriodStatus.create(record.status),

        closedAt,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: new Date(record.createdAt.getTime()),

        updatedAt: new Date(record.updatedAt.getTime()),
      },

      // -----------------------------------------------------------------------
      // Entity Identity
      // -----------------------------------------------------------------------

      new UniqueEntityId(record.id),

      // -----------------------------------------------------------------------
      // Public Identity
      // -----------------------------------------------------------------------

      publicId,
    );
  }

  // ===========================================================================
  // Domain Entity → Prisma Persistence
  // ===========================================================================

  /**
   * Maps AccountingPeriodEntity into its Prisma persistence shape.
   *
   * Domain value objects are serialized into primitive persistence values.
   *
   * Domain undefined calendar ownership becomes Prisma null.
   *
   * Domain undefined closedAt becomes Prisma null.
   */
  public static periodToPersistence(entity: AccountingPeriodEntity): {
    id: string;
    publicId: string;
    calendarId: string | null;
    periodKey: string | null;
    name: string;
    startsAt: Date;
    endsAt: Date;
    status: PrismaAccountingPeriod['status'];
    closedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  } {
    if (entity === undefined) {
      throw new Error('Accounting Period entity is required.');
    }

    // -------------------------------------------------------------------------
    // Calendar Ownership
    // -------------------------------------------------------------------------

    const calendarId = entity.calendarId?.toString() ?? null;

    const periodKey = entity.periodKey?.value ?? null;

    // -------------------------------------------------------------------------
    // Persistence
    // -------------------------------------------------------------------------

    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      id: entity.id.toString(),

      publicId: entity.publicId.value,

      // -----------------------------------------------------------------------
      // Calendar Ownership
      // -----------------------------------------------------------------------

      calendarId,

      periodKey,

      // -----------------------------------------------------------------------
      // Period Definition
      // -----------------------------------------------------------------------

      name: entity.name.value,

      // -----------------------------------------------------------------------
      // Period Boundaries
      // -----------------------------------------------------------------------

      startsAt: entity.startsAt,

      endsAt: entity.endsAt,

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      status: entity.status.value,

      closedAt: entity.closedAt ?? null,

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
   * Converts the complete Accounting Period aggregate into its persistence
   * structure.
   *
   * Accounting Period is a single-entity aggregate, so only the aggregate
   * root entity is persisted here.
   *
   * Accounting Journals are intentionally excluded because they belong to
   * AccountingJournalAggregate.
   */
  public static toPersistence(
    aggregate: AccountingPeriodAggregate,
  ): AccountingPeriodPersistence {
    if (aggregate === undefined) {
      throw new Error('Accounting Period aggregate is required.');
    }

    return {
      period: this.periodToPersistence(aggregate.period),
    };
  }

  // ===========================================================================
  // Component Mapping
  // ===========================================================================

  /**
   * Maps a Prisma AccountingPeriod record directly into an
   * AccountingPeriodEntity.
   *
   * Useful for repository-level component operations.
   */
  public static toPeriodDomain(
    record: PrismaAccountingPeriod,
  ): AccountingPeriodEntity {
    return this.periodToDomain(record);
  }

  /**
   * Maps a Prisma AccountingPeriod record into an
   * AccountingPeriodAggregate.
   *
   * Equivalent to toDomain().
   */
  public static toPeriodAggregate(
    record: PrismaAccountingPeriod,
  ): AccountingPeriodAggregate {
    return this.toDomain(record);
  }

  // ===========================================================================
  // Generic Domain Component Mapping
  // ===========================================================================

  /**
   * Maps a supported Prisma Accounting Period record into its corresponding
   * domain component.
   *
   * Accounting Period has only one aggregate-owned entity, so this resolves
   * directly to AccountingPeriodEntity.
   */
  public static toDomainComponent(
    record: PrismaAccountingPeriod,
  ): AccountingPeriodEntity {
    return this.periodToDomain(record);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AccountingPeriodPrismaMapper;
