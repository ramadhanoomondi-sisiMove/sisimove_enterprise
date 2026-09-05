// -----------------------------------------------------------------------------
// Assets — Asset Response Mapper
// -----------------------------------------------------------------------------
//
// Maps the AssetAggregate / AssetEntity domain model into an
// application-facing AssetResponse.
//
// Aggregate:
//
// AssetAggregate
// └── AssetEntity
//
// Mapping principles:
//
// - Expose Asset-safe state.
// - Serialize value objects into primitives.
// - Expose the opaque public reference to Identity.
// - Expose Asset classification.
// - Expose Asset lifecycle status.
// - Expose Asset visibility.
// - Expose storage metadata required by the application response.
// - Expose file metadata.
// - Expose lifecycle timestamps.
// - Expose audit timestamps.
// - Do not expose internal persistence identifiers.
// - Do not expose domain entities or value objects directly.
// - Do not access Prisma or persistence models.
// - Do not resolve Identity.
// - Do not access physical storage.
// - Do not generate URLs.
// - Do not generate signed URLs.
// - Do not evaluate authorization.
// - Do not perform business validation.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Map AssetAggregate -> AssetResponse.
// - Map AssetEntity -> AssetResponse.
// - Provide one canonical Asset mapping implementation.
// - Convert Asset value objects into primitive response values.
// - Return defensive Date instances.
//
// -----------------------------------------------------------------------------
//
// This mapper does NOT:
//
// - Mutate the aggregate.
// - Persist the aggregate.
// - Access Prisma.
// - Access filesystem storage.
// - Access Bunny Storage.
// - Access AWS S3.
// - Access Cloudinary.
// - Generate public URLs.
// - Generate signed URLs.
// - Resolve Identity.
// - Evaluate authorization.
// - Perform business validation.
// - Emit domain events.
// - Modify Asset lifecycle state.
//
// -----------------------------------------------------------------------------
//
// Identity:
//
// ownerIdentityPublicId is exposed only as an opaque public reference.
//
// The mapper does not resolve the referenced Identity aggregate.
//
// -----------------------------------------------------------------------------
//
// Storage:
//
// Storage metadata is serialized as primitive values:
//
// - storageProvider;
// - bucket;
// - objectKey.
//
// Physical storage access and URL generation remain outside this mapper.
//
// -----------------------------------------------------------------------------
//
// Dates:
//
// Date values are returned as defensive copies so callers cannot mutate the
// domain entity's Date instances through the response object.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Aggregate
// -----------------------------------------------------------------------------

import type { AssetAggregate } from '../../../domain/aggregates/asset.aggregate';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { AssetEntity } from '../../../domain/entities/asset.entity';

// =============================================================================
// Response
// =============================================================================

export interface AssetResponse {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the Asset aggregate.
   *
   * This is the externally safe Asset identifier.
   */
  publicId: string;

  /**
   * Opaque public reference to the owning Identity aggregate.
   *
   * Undefined when the Asset currently has no owner.
   */
  ownerIdentityPublicId?: string;

  // ---------------------------------------------------------------------------
  // Classification
  // ---------------------------------------------------------------------------

  /**
   * Primary media/content type of the Asset.
   */
  type: string;

  /**
   * Functional category of the Asset.
   */
  category: string;

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Current Asset lifecycle status.
   */
  status: string;

  // ---------------------------------------------------------------------------
  // Visibility
  // ---------------------------------------------------------------------------

  /**
   * Current Asset visibility.
   */
  visibility: string;

  // ---------------------------------------------------------------------------
  // Storage
  // ---------------------------------------------------------------------------

  /**
   * Storage provider associated with the Asset.
   */
  storageProvider: string;

  /**
   * Logical storage bucket containing the Asset.
   */
  bucket: string;

  /**
   * Physical storage object key identifying the Asset.
   */
  objectKey: string;

  // ---------------------------------------------------------------------------
  // File Metadata
  // ---------------------------------------------------------------------------

  /**
   * Original filename supplied for the Asset.
   *
   * Undefined when no original filename was supplied.
   */
  originalFilename?: string;

  /**
   * MIME type of the Asset.
   */
  mimeType: string;

  /**
   * Size of the Asset in bytes.
   */
  sizeBytes: number;

  // ---------------------------------------------------------------------------
  // Lifecycle Timestamps
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the Asset was successfully uploaded.
   *
   * Undefined while the Asset remains in UPLOADING state.
   */
  uploadedAt?: Date;

  /**
   * Timestamp at which the Asset was archived.
   *
   * Undefined when the Asset has not been archived.
   */
  archivedAt?: Date;

  /**
   * Timestamp at which the Asset was deleted.
   *
   * Undefined when the Asset has not been deleted.
   */
  deletedAt?: Date;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the Asset was created.
   */
  createdAt: Date;

  /**
   * Timestamp at which the Asset was last updated.
   */
  updatedAt: Date;
}

// =============================================================================
// Mapper
// =============================================================================

export class AssetResponseMapper {
  // ===========================================================================
  // Aggregate -> Response
  // ===========================================================================

  /**
   * Maps an AssetAggregate into an AssetResponse.
   *
   * This is the canonical aggregate-to-response mapping entry point.
   */
  public static toResponse(aggregate: AssetAggregate): AssetResponse {
    if (aggregate === undefined) {
      throw new Error('Asset aggregate is required.');
    }

    return this.mapAsset(aggregate.asset);
  }

  // ===========================================================================
  // Entity -> Response
  // ===========================================================================

  /**
   * Maps an AssetEntity directly into an AssetResponse.
   *
   * Useful for application/read workflows where the aggregate wrapper is not
   * required by the caller.
   */
  public static fromEntity(asset: AssetEntity): AssetResponse {
    if (asset === undefined) {
      throw new Error('Asset entity is required.');
    }

    return this.mapAsset(asset);
  }

  // ===========================================================================
  // Internal Asset Mapping
  // ===========================================================================

  /**
   * Maps the AssetEntity portion of the Asset aggregate.
   *
   * This is the single canonical implementation used by both:
   *
   * - toResponse();
   * - fromEntity();
   *
   * Keeping the mapping centralized prevents aggregate and entity response
   * paths from drifting apart.
   */
  private static mapAsset(asset: AssetEntity): AssetResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: asset.publicId.value,

      ...(asset.ownerIdentityPublicId !== undefined
        ? {
            ownerIdentityPublicId: asset.ownerIdentityPublicId.value,
          }
        : {}),

      // -----------------------------------------------------------------------
      // Classification
      // -----------------------------------------------------------------------

      type: asset.type.value,

      category: asset.category.value,

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      status: asset.status.value,

      // -----------------------------------------------------------------------
      // Visibility
      // -----------------------------------------------------------------------

      visibility: asset.visibility.value,

      // -----------------------------------------------------------------------
      // Storage
      // -----------------------------------------------------------------------

      storageProvider: asset.storageProvider.value,

      bucket: asset.bucket.value,

      objectKey: asset.objectKey.value,

      // -----------------------------------------------------------------------
      // File Metadata
      // -----------------------------------------------------------------------

      ...(asset.originalFilename !== undefined
        ? {
            originalFilename: asset.originalFilename.value,
          }
        : {}),

      mimeType: asset.mimeType.value,

      sizeBytes: asset.sizeBytes.value,

      // -----------------------------------------------------------------------
      // Lifecycle Timestamps
      // -----------------------------------------------------------------------

      ...(asset.uploadedAt !== undefined
        ? {
            uploadedAt: new Date(asset.uploadedAt.getTime()),
          }
        : {}),

      ...(asset.archivedAt !== undefined
        ? {
            archivedAt: new Date(asset.archivedAt.getTime()),
          }
        : {}),

      ...(asset.deletedAt !== undefined
        ? {
            deletedAt: new Date(asset.deletedAt.getTime()),
          }
        : {}),

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: new Date(asset.createdAt.getTime()),

      updatedAt: new Date(asset.updatedAt.getTime()),
    };
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AssetResponseMapper;
