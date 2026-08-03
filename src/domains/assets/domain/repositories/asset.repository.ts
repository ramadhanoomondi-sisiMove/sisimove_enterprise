// src/domains/assets/domain/repositories/asset.repository.ts

import type { AssetAggregate } from '../aggregates/asset.aggregate';

import type { AssetEntity } from '../entities/asset.entity';
import type { AssetModerationEntity } from '../entities/asset-moderation.entity';
import type { AssetProcessingEntity } from '../entities/asset-processing.entity';
import type { AssetReferenceEntity } from '../entities/asset-reference.entity';
import type { AssetScanEntity } from '../entities/asset-scan.entity';
import type { AssetVariantEntity } from '../entities/asset-variant.entity';

import type {
  AssetCategory,
  AssetId,
  AssetOwnerIdentityId,
  AssetReferenceField,
  AssetResourceType,
  AssetStatus,
  AssetType,
  AssetVariantType,
  ChecksumAlgorithm,
} from '../value-objects';

export interface AssetRepository {
  // ------------------------------------------------------------------
  // Persistence
  // ------------------------------------------------------------------

  /**
   * Persists an Asset aggregate.
   */
  save(aggregate: AssetAggregate): Promise<void>;

  /**
   * Removes an Asset aggregate.
   */
  delete(aggregate: AssetAggregate): Promise<void>;

  // ------------------------------------------------------------------
  // Aggregate Queries
  // ------------------------------------------------------------------

  /**
   * Finds an Asset aggregate by its public identifier.
   */
  findByPublicId(publicId: AssetId): Promise<AssetAggregate | null>;

  /**
   * Finds an Asset aggregate by storage object key.
   */
  findByObjectKey(objectKey: string): Promise<AssetAggregate | null>;

  /**
   * Finds all Asset aggregates owned by the supplied Identity.
   */
  findByOwnerIdentityId(
    ownerIdentityId: AssetOwnerIdentityId,
  ): Promise<AssetAggregate[]>;

  // ------------------------------------------------------------------
  // Entity Queries
  // ------------------------------------------------------------------

  /**
   * Finds an Asset entity by its public identifier.
   */
  findEntityByPublicId(publicId: AssetId): Promise<AssetEntity | null>;

  /**
   * Finds an Asset entity by storage object key.
   */
  findEntityByObjectKey(objectKey: string): Promise<AssetEntity | null>;

  /**
   * Returns Asset entities owned by the supplied Identity.
   */
  findEntitiesByOwnerIdentityId(
    ownerIdentityId: AssetOwnerIdentityId,
  ): Promise<AssetEntity[]>;

  /**
   * Returns Asset entities by category.
   */
  findEntitiesByCategory(category: AssetCategory): Promise<AssetEntity[]>;

  /**
   * Returns Asset entities by status.
   */
  findEntitiesByStatus(status: AssetStatus): Promise<AssetEntity[]>;

  /**
   * Returns Asset entities by type.
   */
  findEntitiesByType(type: AssetType): Promise<AssetEntity[]>;

  // ------------------------------------------------------------------
  // Variants
  // ------------------------------------------------------------------

  /**
   * Returns all variants for an Asset.
   *
   * Uses the aggregate UUID.
   */
  findVariants(assetId: string): Promise<AssetVariantEntity[]>;

  /**
   * Returns a specific variant for an Asset.
   *
   * Uses the aggregate UUID.
   */
  findVariant(
    assetId: string,
    variant: AssetVariantType,
  ): Promise<AssetVariantEntity | null>;

  // ------------------------------------------------------------------
  // References
  // ------------------------------------------------------------------

  /**
   * Returns all references for an Asset.
   *
   * Uses the aggregate UUID.
   */
  findReferences(assetId: string): Promise<AssetReferenceEntity[]>;

  /**
   * Returns references to a resource.
   */
  findReferencesByResource(
    resourceType: AssetResourceType,
    resourcePublicId: string,
  ): Promise<AssetReferenceEntity[]>;

  /**
   * Returns references for a specific resource field.
   */
  findReferencesByField(
    resourceType: AssetResourceType,
    resourcePublicId: string,
    referenceField: AssetReferenceField,
  ): Promise<AssetReferenceEntity[]>;

  // ------------------------------------------------------------------
  // Processing
  // ------------------------------------------------------------------

  /**
   * Returns processing jobs for an Asset.
   *
   * Uses the aggregate UUID.
   */
  findProcessings(assetId: string): Promise<AssetProcessingEntity[]>;

  // ------------------------------------------------------------------
  // Scans
  // ------------------------------------------------------------------

  /**
   * Returns scan history for an Asset.
   *
   * Uses the aggregate UUID.
   */
  findScans(assetId: string): Promise<AssetScanEntity[]>;

  // ------------------------------------------------------------------
  // Moderation
  // ------------------------------------------------------------------

  /**
   * Returns moderation history for an Asset.
   *
   * Uses the aggregate UUID.
   */
  findModerations(assetId: string): Promise<AssetModerationEntity[]>;

  // ------------------------------------------------------------------
  // Existence
  // ------------------------------------------------------------------

  /**
   * Returns true if an Asset exists with the supplied public identifier.
   */
  existsByPublicId(publicId: AssetId): Promise<boolean>;

  /**
   * Returns true if an Asset exists with the supplied object key.
   */
  existsByObjectKey(objectKey: string): Promise<boolean>;

  /**
   * Returns true if an Asset already exists with the supplied checksum.
   */
  existsByChecksum(
    algorithm: ChecksumAlgorithm,
    checksum: string,
  ): Promise<boolean>;

  /**
   * Returns true if the supplied Identity owns one or more Assets.
   */
  existsByOwnerIdentityId(
    ownerIdentityId: AssetOwnerIdentityId,
  ): Promise<boolean>;
}
