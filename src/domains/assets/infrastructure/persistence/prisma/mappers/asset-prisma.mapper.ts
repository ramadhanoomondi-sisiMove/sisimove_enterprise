// -----------------------------------------------------------------------------
// Assets — Prisma Mapper
// -----------------------------------------------------------------------------
//
// Maps the Asset aggregate:
//
// AssetAggregate
// └── AssetEntity
//
// Persistence:
//
// Asset
//
// Asset is an independent aggregate root.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { Asset as PrismaAsset } from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { AssetAggregate } from '../../../../domain/aggregates/asset.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { AssetEntity } from '../../../../domain/entities/asset.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import {
  AssetPublicId,
  AssetIdentityPublicId,
  AssetType,
  AssetCategory,
  AssetStatus,
  AssetVisibility,
  AssetStorageProvider,
  AssetBucket,
  AssetObjectKey,
  AssetOriginalFilename,
  AssetMimeType,
  AssetSizeBytes,
} from '../../../../domain/value-objects';

// =============================================================================
// Persistence Types
// =============================================================================

/**
 * Persistence representation of the Asset aggregate.
 *
 * Asset is a single-entity aggregate, therefore no aggregate-owned child
 * collection is required in the persistence structure.
 */
export interface AssetPersistence {
  asset: ReturnType<typeof AssetPrismaMapper.assetToPersistence>;
}

// =============================================================================
// Mapper
// =============================================================================

export class AssetPrismaMapper {
  // ===========================================================================
  // Prisma → Domain Aggregate
  // ===========================================================================

  /**
   * Rehydrates a complete Asset aggregate from a Prisma Asset record.
   *
   * Rehydration does not emit domain events.
   */
  public static toDomain(record: PrismaAsset): AssetAggregate {
    return AssetAggregate.rehydrate(this.assetToDomain(record));
  }

  // ===========================================================================
  // Prisma → Domain Entity
  // ===========================================================================

  /**
   * Rehydrates an AssetEntity from a persisted Prisma Asset record.
   *
   * Mapping:
   *
   * Prisma id
   *     ↓
   * UniqueEntityId
   *
   * Prisma publicId
   *     ↓
   * AssetPublicId
   *
   * Prisma ownerIdentityId
   *     ↓
   * AssetIdentityPublicId
   *
   * Prisma enum values
   *     ↓
   * Asset value objects
   *
   * Prisma sizeBytes bigint
   *     ↓
   * AssetSizeBytes number
   */
  public static assetToDomain(record: PrismaAsset): AssetEntity {
    if (record === undefined || record === null) {
      throw new Error('Asset Prisma record is required.');
    }

    // -------------------------------------------------------------------------
    // Public Identity
    // -------------------------------------------------------------------------

    const publicId = new AssetPublicId(record.publicId);

    // -------------------------------------------------------------------------
    // Owner Identity
    // -------------------------------------------------------------------------

    const ownerIdentityPublicId =
      record.ownerIdentityId !== null
        ? new AssetIdentityPublicId(record.ownerIdentityId)
        : undefined;

    // -------------------------------------------------------------------------
    // Size
    // -------------------------------------------------------------------------
    //
    // Prisma BigInt is converted to number at the domain boundary.
    //
    // AssetSizeBytes is responsible for validating the resulting domain value.
    //

    const sizeBytes = Number(record.sizeBytes);

    if (!Number.isSafeInteger(sizeBytes)) {
      throw new Error(
        `Asset ${record.publicId} has a sizeBytes value outside the safe integer range.`,
      );
    }

    // -------------------------------------------------------------------------
    // Domain Rehydration
    // -------------------------------------------------------------------------

    return AssetEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Ownership
        // ---------------------------------------------------------------------

        ownerIdentityPublicId,

        // ---------------------------------------------------------------------
        // Classification
        // ---------------------------------------------------------------------

        type: AssetType.create(record.type),

        category: AssetCategory.create(record.category),

        // ---------------------------------------------------------------------
        // Lifecycle
        // ---------------------------------------------------------------------

        status: AssetStatus.create(record.status),

        visibility: AssetVisibility.create(record.visibility),

        // ---------------------------------------------------------------------
        // Storage
        // ---------------------------------------------------------------------

        storageProvider: AssetStorageProvider.create(record.storageProvider),

        bucket: AssetBucket.create(record.bucket),

        objectKey: AssetObjectKey.create(record.objectKey),

        // ---------------------------------------------------------------------
        // File Metadata
        // ---------------------------------------------------------------------

        originalFilename:
          record.originalFilename !== null
            ? AssetOriginalFilename.create(record.originalFilename)
            : undefined,

        mimeType: AssetMimeType.create(record.mimeType),

        sizeBytes: AssetSizeBytes.create(sizeBytes),

        // ---------------------------------------------------------------------
        // Lifecycle Timestamps
        // ---------------------------------------------------------------------

        uploadedAt:
          record.uploadedAt !== null
            ? new Date(record.uploadedAt.getTime())
            : undefined,

        archivedAt:
          record.archivedAt !== null
            ? new Date(record.archivedAt.getTime())
            : undefined,

        deletedAt:
          record.deletedAt !== null
            ? new Date(record.deletedAt.getTime())
            : undefined,

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

      publicId,
    );
  }

  // ===========================================================================
  // Domain Entity → Prisma Persistence
  // ===========================================================================

  /**
   * Maps AssetEntity into its Prisma persistence shape.
   *
   * Domain value objects are serialized into primitive persistence values.
   */
  public static assetToPersistence(entity: AssetEntity): {
    id: string;
    publicId: string;
    ownerIdentityId: string | null;
    type: PrismaAsset['type'];
    category: PrismaAsset['category'];
    status: PrismaAsset['status'];
    visibility: PrismaAsset['visibility'];
    storageProvider: PrismaAsset['storageProvider'];
    bucket: string;
    objectKey: string;
    originalFilename: string | null;
    mimeType: string;
    sizeBytes: bigint;
    uploadedAt: Date | null;
    archivedAt: Date | null;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  } {
    if (entity === undefined) {
      throw new Error('Asset entity is required.');
    }

    // -------------------------------------------------------------------------
    // Size
    // -------------------------------------------------------------------------
    //
    // The domain represents AssetSizeBytes as a number while Prisma persists
    // the field as BigInt.
    //

    const sizeBytes = entity.sizeBytes.value;

    if (!Number.isSafeInteger(sizeBytes)) {
      throw new Error(
        `Asset ${entity.publicId.value} has a sizeBytes value outside the safe integer range.`,
      );
    }

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
      // Ownership
      // -----------------------------------------------------------------------

      ownerIdentityId: entity.ownerIdentityPublicId?.value ?? null,

      // -----------------------------------------------------------------------
      // Classification
      // -----------------------------------------------------------------------

      type: entity.type.value,

      category: entity.category.value,

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      status: entity.status.value,

      visibility: entity.visibility.value,

      // -----------------------------------------------------------------------
      // Storage
      // -----------------------------------------------------------------------

      storageProvider: entity.storageProvider.value,

      bucket: entity.bucket.value,

      objectKey: entity.objectKey.value,

      // -----------------------------------------------------------------------
      // File Metadata
      // -----------------------------------------------------------------------

      originalFilename: entity.originalFilename?.value ?? null,

      mimeType: entity.mimeType.value,

      sizeBytes: BigInt(sizeBytes),

      // -----------------------------------------------------------------------
      // Lifecycle Timestamps
      // -----------------------------------------------------------------------

      uploadedAt: entity.uploadedAt ?? null,

      archivedAt: entity.archivedAt ?? null,

      deletedAt: entity.deletedAt ?? null,

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
   * Converts the complete Asset aggregate into its persistence structure.
   *
   * Asset is a single-entity aggregate, so the aggregate persistence
   * structure contains only the Asset root record.
   */
  public static toPersistence(aggregate: AssetAggregate): AssetPersistence {
    if (aggregate === undefined) {
      throw new Error('Asset aggregate is required.');
    }

    return {
      asset: this.assetToPersistence(aggregate.asset),
    };
  }

  // ===========================================================================
  // Component Mapping
  // ===========================================================================

  /**
   * Maps a Prisma Asset record directly into AssetEntity.
   *
   * Useful for repository-level component operations.
   */
  public static toAssetDomain(record: PrismaAsset): AssetEntity {
    return this.assetToDomain(record);
  }

  /**
   * Maps a Prisma Asset record into AssetAggregate.
   *
   * Equivalent to toDomain().
   */
  public static toAssetAggregate(record: PrismaAsset): AssetAggregate {
    return this.toDomain(record);
  }

  // ===========================================================================
  // Generic Domain Component Mapping
  // ===========================================================================

  /**
   * Maps a supported Prisma Asset record into its corresponding
   * domain component.
   *
   * Asset has only one aggregate-owned entity, so this resolves directly
   * to AssetEntity.
   */
  public static toDomainComponent(record: PrismaAsset): AssetEntity {
    return this.assetToDomain(record);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AssetPrismaMapper;
