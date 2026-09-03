// -----------------------------------------------------------------------------
// Recovery — Prisma Mapper
// -----------------------------------------------------------------------------
//
// Maps the Recovery aggregate:
//
// RecoveryAggregate
// └── RecoveryEntity
//
// Persistence:
//
// Recovery
//
// Recovery is an independent aggregate root.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { Recovery as PrismaRecovery } from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { RecoveryAggregate } from '../../../../domain/aggregates/recovery.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { RecoveryEntity } from '../../../../domain/entities/recovery.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import {
  RecoveryPublicId,
  RecoveryIdentityPublicId,
  RecoveryType,
  RecoveryStatus,
  RecoveryTokenHash,
  RecoveryRequestedAt,
  RecoveryExpiresAt,
  RecoveryCompletedAt,
  RecoveryCancelledAt,
} from '../../../../domain/value-objects';

// =============================================================================
// Persistence Types
// =============================================================================

/**
 * Persistence representation of the Recovery aggregate.
 *
 * Recovery is a single-entity aggregate, therefore no child collection
 * is required in the persistence structure.
 */
export interface RecoveryPersistence {
  recovery: ReturnType<typeof RecoveryPrismaMapper.recoveryToPersistence>;
}

// =============================================================================
// Mapper
// =============================================================================

export class RecoveryPrismaMapper {
  // ===========================================================================
  // Prisma → Domain Aggregate
  // ===========================================================================

  /**
   * Rehydrates a complete Recovery aggregate from a Prisma Recovery record.
   *
   * Rehydration does not emit domain events.
   */
  public static toDomain(record: PrismaRecovery): RecoveryAggregate {
    return RecoveryAggregate.rehydrate(this.recoveryToDomain(record));
  }

  // ===========================================================================
  // Prisma → Domain Entity
  // ===========================================================================

  /**
   * Rehydrates a RecoveryEntity from a persisted Prisma Recovery record.
   *
   * Mapping:
   *
   * Prisma id
   *     ↓
   * UniqueEntityId
   *
   * Prisma publicId
   *     ↓
   * RecoveryPublicId
   *
   * Prisma identityPublicId
   *     ↓
   * RecoveryIdentityPublicId
   *
   * Prisma type
   *     ↓
   * RecoveryType
   *
   * Prisma status
   *     ↓
   * RecoveryStatus
   *
   * Prisma recoveryTokenHash
   *     ↓
   * RecoveryTokenHash
   *
   * Prisma requestedAt
   *     ↓
   * RecoveryRequestedAt
   *
   * Prisma expiresAt
   *     ↓
   * RecoveryExpiresAt
   */
  public static recoveryToDomain(record: PrismaRecovery): RecoveryEntity {
    if (record === undefined) {
      throw new Error('Recovery Prisma record is required.');
    }

    const publicId = new RecoveryPublicId(record.publicId);

    return RecoveryEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Identity
        // ---------------------------------------------------------------------

        identityPublicId: new RecoveryIdentityPublicId(record.identityPublicId),

        // ---------------------------------------------------------------------
        // Recovery Type
        // ---------------------------------------------------------------------

        type: RecoveryType.create(record.type),

        // ---------------------------------------------------------------------
        // Recovery Status
        // ---------------------------------------------------------------------

        status: RecoveryStatus.create(record.status),

        // ---------------------------------------------------------------------
        // Recovery Token
        // ---------------------------------------------------------------------

        recoveryTokenHash:
          record.recoveryTokenHash !== null
            ? RecoveryTokenHash.create(record.recoveryTokenHash)
            : undefined,

        // ---------------------------------------------------------------------
        // Request
        // ---------------------------------------------------------------------

        requestedAt: RecoveryRequestedAt.create(record.requestedAt),

        // ---------------------------------------------------------------------
        // Expiry
        // ---------------------------------------------------------------------

        expiresAt: RecoveryExpiresAt.create(record.expiresAt),

        // ---------------------------------------------------------------------
        // Completion Lifecycle
        // ---------------------------------------------------------------------

        completedAt:
          record.completedAt !== null
            ? RecoveryCompletedAt.create(record.completedAt)
            : undefined,

        // ---------------------------------------------------------------------
        // Cancellation Lifecycle
        // ---------------------------------------------------------------------

        cancelledAt:
          record.cancelledAt !== null
            ? RecoveryCancelledAt.create(record.cancelledAt)
            : undefined,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: record.createdAt,

        updatedAt: record.updatedAt,
      },

      new UniqueEntityId(record.id),

      publicId,
    );
  }

  // ===========================================================================
  // Domain Entity → Prisma Persistence
  // ===========================================================================

  /**
   * Maps RecoveryEntity into its Prisma persistence shape.
   *
   * Domain value objects are serialized into primitive persistence values.
   */
  public static recoveryToPersistence(entity: RecoveryEntity): {
    id: string;
    publicId: string;
    identityPublicId: string;
    type: PrismaRecovery['type'];
    status: PrismaRecovery['status'];
    recoveryTokenHash: string | null;
    requestedAt: Date;
    expiresAt: Date;
    completedAt: Date | null;
    cancelledAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  } {
    if (entity === undefined) {
      throw new Error('Recovery entity is required.');
    }

    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      id: entity.id.toString(),

      publicId: entity.publicId.value,

      identityPublicId: entity.identityPublicId.value,

      // -----------------------------------------------------------------------
      // Recovery Type
      // -----------------------------------------------------------------------

      type: entity.type.value,

      // -----------------------------------------------------------------------
      // Recovery Status
      // -----------------------------------------------------------------------

      status: entity.status.value,

      // -----------------------------------------------------------------------
      // Recovery Token
      // -----------------------------------------------------------------------

      recoveryTokenHash: entity.recoveryTokenHash?.value ?? null,

      // -----------------------------------------------------------------------
      // Request
      // -----------------------------------------------------------------------

      requestedAt: entity.requestedAt.value,

      // -----------------------------------------------------------------------
      // Expiry
      // -----------------------------------------------------------------------

      expiresAt: entity.expiresAt.value,

      // -----------------------------------------------------------------------
      // Completion Lifecycle
      // -----------------------------------------------------------------------

      completedAt: entity.completedAt?.value ?? null,

      // -----------------------------------------------------------------------
      // Cancellation Lifecycle
      // -----------------------------------------------------------------------

      cancelledAt: entity.cancelledAt?.value ?? null,

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
   * Converts the complete Recovery aggregate into its persistence structure.
   *
   * Recovery is a single-entity aggregate, so the aggregate persistence
   * structure contains only the Recovery root record.
   */
  public static toPersistence(
    aggregate: RecoveryAggregate,
  ): RecoveryPersistence {
    if (aggregate === undefined) {
      throw new Error('Recovery aggregate is required.');
    }

    return {
      recovery: this.recoveryToPersistence(aggregate.recovery),
    };
  }

  // ===========================================================================
  // Component Mapping
  // ===========================================================================

  /**
   * Maps a Prisma Recovery record directly into RecoveryEntity.
   *
   * Useful for repository-level component operations.
   */
  public static toRecoveryDomain(record: PrismaRecovery): RecoveryEntity {
    return this.recoveryToDomain(record);
  }

  /**
   * Maps a Prisma Recovery record into RecoveryAggregate.
   *
   * Equivalent to toDomain().
   */
  public static toRecoveryAggregate(record: PrismaRecovery): RecoveryAggregate {
    return this.toDomain(record);
  }

  // ===========================================================================
  // Generic Domain Component Mapping
  // ===========================================================================

  /**
   * Maps a supported Prisma Recovery record into its corresponding
   * domain component.
   *
   * Recovery has only one aggregate-owned entity, so this resolves directly
   * to RecoveryEntity.
   */
  public static toDomainComponent(record: PrismaRecovery): RecoveryEntity {
    return this.recoveryToDomain(record);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default RecoveryPrismaMapper;
