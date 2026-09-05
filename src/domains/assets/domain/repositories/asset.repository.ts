// -----------------------------------------------------------------------------
// Assets — Asset Repository
// -----------------------------------------------------------------------------
//
// Repository contract for the Asset aggregate.
//
// Aggregate ownership:
//
// AssetAggregate
// └── AssetEntity
//
// Asset is an independent aggregate responsible for:
//
// - asset identity;
// - opaque Identity public reference;
// - asset classification;
// - asset lifecycle state;
// - asset visibility;
// - storage metadata;
// - file metadata;
// - asset lifecycle timestamps.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Persist Asset aggregates.
// - Retrieve Asset aggregates.
// - Retrieve Asset entities when required by infrastructure.
// - Support Asset public-identity lookup.
// - Support Identity public-reference lookup.
// - Support object-key lookup.
// - Support lifecycle-status queries.
// - Support asset-type queries.
// - Support asset-category queries.
// - Support visibility queries.
// - Support storage-provider queries.
// - Support ownership queries.
// - Support existence checks.
//
// -----------------------------------------------------------------------------
//
// This repository does NOT:
//
// - Depend on Prisma.
// - Depend on ORM models.
// - Validate Identity domain state.
// - Load Identity aggregates.
// - Upload physical files.
// - Delete physical files.
// - Generate public URLs.
// - Generate signed URLs.
// - Communicate with storage providers.
// - Execute authorization checks.
// - Decide asset lifecycle policy.
// - Decide upload policy.
// - Validate file contents.
// - Process images, videos, audio, or documents.
//
// Physical storage operations belong behind AssetStoragePort.
//
// Cross-aggregate coordination belongs to the appropriate application or
// domain service boundary.
//
// -----------------------------------------------------------------------------
//
// Identity reference:
//
// Asset stores an opaque reference to the Identity aggregate:
//
//     AssetIdentityPublicId
//
// The repository may use this reference for lookup, but must not validate,
// dereference, or load the Identity aggregate.
//
// -----------------------------------------------------------------------------
//
// Uniqueness:
//
// The persistence model should enforce uniqueness of:
//
//     UNIQUE(publicId)
//     UNIQUE(objectKey)
//
// The database remains the final persistence-level uniqueness guarantee.
//
// -----------------------------------------------------------------------------
//
// Repository design:
//
// The repository exposes persistence-oriented queries.
//
// It does NOT expose domain-policy predicates such as:
//
//     "may be uploaded"
//     "may be archived"
//     "may be deleted"
//     "is usable for a specific business operation"
//
// Those decisions belong to the Asset aggregate, domain services,
// application services, or other appropriate domain/application boundaries.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { AssetAggregate } from '../aggregates/asset.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import type { AssetEntity } from '../entities/asset.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { AssetPublicId } from '../value-objects/asset-public-id.vo';

import type { AssetIdentityPublicId } from '../value-objects/asset-identity-public-id.vo';

import type { AssetType } from '../value-objects/asset-type.vo';

import type { AssetCategory } from '../value-objects/asset-category.vo';

import type { AssetStatus } from '../value-objects/asset-status.vo';

import type { AssetVisibility } from '../value-objects/asset-visibility.vo';

import type { AssetStorageProvider } from '../value-objects/asset-storage-provider.vo';

import type { AssetObjectKey } from '../value-objects/asset-object-key.vo';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// =============================================================================
// Repository
// =============================================================================

export interface AssetRepository {
  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Persists an Asset aggregate.
   *
   * The repository implementation is responsible for translating the
   * aggregate into its persistence representation.
   *
   * Domain behavior remains inside the aggregate and entity.
   */
  save(aggregate: AssetAggregate): Promise<void>;

  /**
   * Removes an Asset aggregate.
   *
   * Deletion eligibility is determined by application/domain policy.
   * The repository only performs the persistence operation.
   */
  delete(aggregate: AssetAggregate): Promise<void>;

  // ===========================================================================
  // Aggregate Queries
  // ===========================================================================

  /**
   * Finds an Asset aggregate by its public identifier.
   *
   * AssetPublicId is the public identity of the Asset aggregate.
   */
  findByPublicId(publicId: AssetPublicId): Promise<AssetAggregate | null>;

  /**
   * Finds an Asset aggregate by its storage object key.
   *
   * Object keys are persistence-level unique identifiers for stored objects.
   */
  findByObjectKey(objectKey: AssetObjectKey): Promise<AssetAggregate | null>;

  /**
   * Finds an Asset aggregate belonging to the supplied Identity.
   *
   * AssetIdentityPublicId is treated as an opaque cross-aggregate reference.
   *
   * The repository does not load or validate the Identity aggregate.
   */
  findByOwnerIdentityPublicId(
    identityPublicId: AssetIdentityPublicId,
  ): Promise<AssetAggregate[]>;

  // ===========================================================================
  // Entity Queries
  // ===========================================================================

  /**
   * Finds an Asset entity by its public identifier.
   *
   * Returns the aggregate-root entity without wrapping it in an aggregate.
   */
  findEntityByPublicId(publicId: AssetPublicId): Promise<AssetEntity | null>;

  /**
   * Finds an Asset entity by its internal identifier.
   *
   * Intended primarily for persistence-oriented infrastructure operations.
   */
  findEntityById(id: UniqueEntityId): Promise<AssetEntity | null>;

  /**
   * Finds an Asset entity by its storage object key.
   */
  findEntityByObjectKey(objectKey: AssetObjectKey): Promise<AssetEntity | null>;

  /**
   * Finds an Asset entity by its owning Identity public identifier.
   *
   * The Identity reference remains opaque to the Asset repository.
   */
  findEntityByOwnerIdentityPublicId(
    identityPublicId: AssetIdentityPublicId,
  ): Promise<AssetEntity[]>;

  // ===========================================================================
  // Lifecycle Status Queries
  // ===========================================================================

  /**
   * Finds all Asset aggregates with the supplied lifecycle status.
   */
  findByStatus(status: AssetStatus): Promise<AssetAggregate[]>;

  /**
   * Finds all Assets currently uploading.
   */
  findUploading(): Promise<AssetAggregate[]>;

  /**
   * Finds all Assets that have been uploaded.
   */
  findUploaded(): Promise<AssetAggregate[]>;

  /**
   * Finds all Assets that are ready for use.
   */
  findReady(): Promise<AssetAggregate[]>;

  /**
   * Finds all archived Assets.
   */
  findArchived(): Promise<AssetAggregate[]>;

  /**
   * Finds all deleted Assets.
   */
  findDeleted(): Promise<AssetAggregate[]>;

  // ===========================================================================
  // Classification Queries
  // ===========================================================================

  /**
   * Finds all Asset aggregates with the supplied Asset type.
   */
  findByType(type: AssetType): Promise<AssetAggregate[]>;

  /**
   * Finds all Asset aggregates with the supplied Asset category.
   */
  findByCategory(category: AssetCategory): Promise<AssetAggregate[]>;

  /**
   * Finds all Assets matching the supplied type and category.
   */
  findByTypeAndCategory(
    type: AssetType,
    category: AssetCategory,
  ): Promise<AssetAggregate[]>;

  // ===========================================================================
  // Ownership Queries
  // ===========================================================================

  /**
   * Finds all Assets belonging to the supplied Identity.
   *
   * The Identity public identifier is treated as an opaque reference.
   */
  findByOwner(
    identityPublicId: AssetIdentityPublicId,
  ): Promise<AssetAggregate[]>;

  /**
   * Finds all Assets belonging to the supplied Identity and lifecycle status.
   */
  findByOwnerAndStatus(
    identityPublicId: AssetIdentityPublicId,
    status: AssetStatus,
  ): Promise<AssetAggregate[]>;

  /**
   * Finds all Assets belonging to the supplied Identity and category.
   */
  findByOwnerAndCategory(
    identityPublicId: AssetIdentityPublicId,
    category: AssetCategory,
  ): Promise<AssetAggregate[]>;

  /**
   * Finds all Assets belonging to the supplied Identity that are ready.
   *
   * This is a persistence query for READY status.
   *
   * It does not determine whether a particular business operation is
   * permitted to use the Asset.
   */
  findReadyByOwner(
    identityPublicId: AssetIdentityPublicId,
  ): Promise<AssetAggregate[]>;

  // ===========================================================================
  // Visibility Queries
  // ===========================================================================

  /**
   * Finds all Assets with the supplied visibility.
   */
  findByVisibility(visibility: AssetVisibility): Promise<AssetAggregate[]>;

  /**
   * Finds all public Assets.
   */
  findPublic(): Promise<AssetAggregate[]>;

  /**
   * Finds all private Assets.
   */
  findPrivate(): Promise<AssetAggregate[]>;

  // ===========================================================================
  // Storage Queries
  // ===========================================================================

  /**
   * Finds all Assets stored by the supplied storage provider.
   */
  findByStorageProvider(
    storageProvider: AssetStorageProvider,
  ): Promise<AssetAggregate[]>;

  findAll(): Promise<AssetAggregate[]>;

  // ===========================================================================
  // Existence
  // ===========================================================================

  /**
   * Returns true if an Asset exists for the supplied public identifier.
   */
  existsByPublicId(publicId: AssetPublicId): Promise<boolean>;

  /**
   * Returns true if an Asset exists for the supplied internal identifier.
   */
  existsById(id: UniqueEntityId): Promise<boolean>;

  /**
   * Returns true if an Asset exists with the supplied storage object key.
   */
  existsByObjectKey(objectKey: AssetObjectKey): Promise<boolean>;

  /**
   * Returns true if at least one Asset exists for the supplied Identity.
   */
  existsByOwnerIdentityPublicId(
    identityPublicId: AssetIdentityPublicId,
  ): Promise<boolean>;

  /**
   * Returns true if an Asset exists with the supplied lifecycle status.
   */
  existsByStatus(status: AssetStatus): Promise<boolean>;

  /**
   * Returns true if an Asset exists with the supplied type.
   */
  existsByType(type: AssetType): Promise<boolean>;

  /**
   * Returns true if an Asset exists with the supplied category.
   */
  existsByCategory(category: AssetCategory): Promise<boolean>;

  /**
   * Returns true if an Asset exists with the supplied visibility.
   */
  existsByVisibility(visibility: AssetVisibility): Promise<boolean>;

  /**
   * Returns true if an Asset exists using the supplied storage provider.
   */
  existsByStorageProvider(
    storageProvider: AssetStorageProvider,
  ): Promise<boolean>;

  /**
   * Returns true if at least one uploading Asset exists.
   */
  existsUploading(): Promise<boolean>;

  /**
   * Returns true if at least one uploaded Asset exists.
   */
  existsUploaded(): Promise<boolean>;

  /**
   * Returns true if at least one ready Asset exists.
   */
  existsReady(): Promise<boolean>;

  /**
   * Returns true if at least one archived Asset exists.
   */
  existsArchived(): Promise<boolean>;

  /**
   * Returns true if at least one deleted Asset exists.
   */
  existsDeleted(): Promise<boolean>;

  /**
   * Returns true if at least one public Asset exists.
   */
  existsPublic(): Promise<boolean>;

  /**
   * Returns true if at least one private Asset exists.
   */
  existsPrivate(): Promise<boolean>;
}
