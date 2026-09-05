// -----------------------------------------------------------------------------
// Assets — Asset Storage Port
// -----------------------------------------------------------------------------
//
// Application-facing abstraction for physical Asset storage.
//
// Asset aggregate boundary:
//
// AssetAggregate
// └── AssetEntity
//
// The Asset aggregate owns:
//
// - asset identity;
// - asset classification;
// - asset lifecycle;
// - asset visibility;
// - storage metadata;
// - file metadata;
// - lifecycle timestamps.
//
// This port owns none of those domain responsibilities.
//
// It provides the application layer with a storage-neutral abstraction for
// interacting with the physical object represented by an Asset.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Upload physical Asset objects.
// - Retrieve physical Asset objects.
// - Check physical Asset object existence.
// - Retrieve physical Asset metadata.
// - Delete physical Asset objects.
// - Keep concrete storage-provider implementations outside the application
//   layer.
//
// -----------------------------------------------------------------------------
//
// This port does NOT:
//
// - Depend on Prisma.
// - Depend on ORM models.
// - Depend on AWS SDK.
// - Depend on Google Cloud SDK.
// - Depend on Azure SDK.
// - Depend on Cloudinary SDK.
// - Depend on concrete filesystem implementations.
// - Depend on Express.
// - Depend on Express.Multer.File.
// - Validate Identity domain state.
// - Load Identity aggregates.
// - Validate Asset domain state.
// - Change Asset lifecycle state.
// - Change Asset visibility.
// - Create Asset aggregates.
// - Persist Asset aggregates.
// - Generate public URLs.
// - Generate signed URLs.
// - Generate authentication credentials.
// - Perform authorization checks.
// - Decide whether an Asset may be uploaded.
// - Decide whether an Asset may be deleted.
// - Process images, videos, audio, or documents.
//
// Domain lifecycle transitions remain inside AssetAggregate / AssetEntity.
//
// Asset aggregate persistence remains behind AssetRepository.
//
// -----------------------------------------------------------------------------
//
// Storage providers:
//
// Concrete infrastructure implementations may support:
//
//     LOCAL
//     AWS_S3
//     GOOGLE_CLOUD_STORAGE
//     AZURE_BLOB
//     CLOUDINARY
//     OTHER
//
// The application layer communicates only through this port.
//
// -----------------------------------------------------------------------------
//
// Object identity:
//
// A physical Asset object is identified by:
//
//     storageProvider
//     bucket
//     objectKey
//
// These correspond directly to:
//
//     Asset.storageProvider
//     Asset.bucket
//     Asset.objectKey
//
// The port does not generate or mutate AssetObjectKey values.
//
// -----------------------------------------------------------------------------
//
// Upload input:
//
// The port intentionally does not accept:
//
//     Express.Multer.File
//
// or any other framework/provider-specific file representation.
//
// The application layer supplies a storage-neutral readable stream together
// with the metadata required by the Asset storage contract.
//
// -----------------------------------------------------------------------------
//
// Security:
//
// Implementations MUST NOT expose:
//
// - access keys;
// - secret keys;
// - provider credentials;
// - private signing keys;
// - authentication tokens;
// - refresh tokens;
// - passwords;
// - signed URLs containing credentials.
//
// Provider credentials belong exclusively to infrastructure configuration.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Node.js Stream
// -----------------------------------------------------------------------------
//
// Readable is used only as a storage-neutral application input/output stream.
//
// No concrete storage SDK or framework file type crosses this boundary.
// -----------------------------------------------------------------------------

import type { Readable } from 'node:stream';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { AssetStorageProvider } from '../../domain/value-objects/asset-storage-provider.vo';
import type { AssetBucket } from '../../domain/value-objects/asset-bucket.vo';
import type { AssetObjectKey } from '../../domain/value-objects/asset-object-key.vo';
import type { AssetMimeType } from '../../domain/value-objects/asset-mime-type.vo';
import type { AssetSizeBytes } from '../../domain/value-objects/asset-size-bytes.vo';

// =============================================================================
// Storage Object
// =============================================================================

/**
 * Storage-neutral representation of a physical Asset object.
 *
 * This contains only the storage metadata represented by the Asset domain
 * model and intentionally contains no provider-specific SDK types.
 */
export interface AssetStorageObject {
  /**
   * Storage provider containing the physical object.
   */
  readonly storageProvider: AssetStorageProvider;

  /**
   * Storage bucket or container.
   */
  readonly bucket: AssetBucket;

  /**
   * Storage object key.
   */
  readonly objectKey: AssetObjectKey;

  /**
   * MIME type associated with the physical object.
   */
  readonly mimeType: AssetMimeType;

  /**
   * Physical object size.
   */
  readonly sizeBytes: AssetSizeBytes;
}

// =============================================================================
// Upload Input
// =============================================================================

/**
 * Input required to store a physical Asset object.
 *
 * The storage implementation stores the supplied stream at the supplied
 * storage location.
 */
export interface AssetStorageUpload {
  /**
   * Target storage provider.
   */
  readonly storageProvider: AssetStorageProvider;

  /**
   * Target storage bucket or container.
   */
  readonly bucket: AssetBucket;

  /**
   * Target storage object key.
   */
  readonly objectKey: AssetObjectKey;

  /**
   * Physical Asset content.
   *
   * Deliberately framework-independent and provider-independent.
   */
  readonly content: Readable;

  /**
   * MIME type of the physical Asset.
   */
  readonly mimeType: AssetMimeType;

  /**
   * Expected physical object size.
   */
  readonly sizeBytes: AssetSizeBytes;
}

// =============================================================================
// Retrieved Storage Object
// =============================================================================

/**
 * Physical Asset object together with its readable content stream.
 *
 * Metadata remains storage-neutral while the content is represented by a
 * standard Node.js readable stream.
 */
export interface AssetStorageObjectContent extends AssetStorageObject {
  /**
   * Physical Asset content.
   *
   * The caller is responsible for consuming or destroying the stream.
   */
  readonly content: Readable;
}

// =============================================================================
// Asset Storage Port
// =============================================================================

/**
 * Application-facing abstraction for physical Asset storage.
 *
 * Concrete implementations belong to infrastructure.
 */
export interface AssetStoragePort {
  // ===========================================================================
  // Upload
  // ===========================================================================

  /**
   * Stores a physical Asset object.
   *
   * This operation affects physical storage only.
   *
   * It does not create or modify an Asset aggregate.
   *
   * The application workflow is responsible for coordinating successful
   * physical storage with the appropriate Asset lifecycle transition.
   */
  upload(input: AssetStorageUpload): Promise<AssetStorageObject>;

  // ===========================================================================
  // Retrieval
  // ===========================================================================

  /**
   * Retrieves a physical Asset object and its content stream.
   *
   * Returns null when the physical object does not exist.
   *
   * The returned stream belongs to the caller and must be consumed or
   * explicitly destroyed by the caller.
   */
  get(
    storageProvider: AssetStorageProvider,
    bucket: AssetBucket,
    objectKey: AssetObjectKey,
  ): Promise<AssetStorageObjectContent | null>;

  // ===========================================================================
  // Existence
  // ===========================================================================

  /**
   * Determines whether a physical Asset object exists.
   *
   * This is a storage-level existence check only.
   *
   * It does not determine whether:
   *
   * - the Asset aggregate exists;
   * - the Asset is READY;
   * - the Asset is visible;
   * - the Asset is usable by another domain.
   */
  exists(
    storageProvider: AssetStorageProvider,
    bucket: AssetBucket,
    objectKey: AssetObjectKey,
  ): Promise<boolean>;

  // ===========================================================================
  // Metadata
  // ===========================================================================

  /**
   * Retrieves metadata for a physical Asset object without retrieving its
   * content.
   *
   * Returns null when the physical object does not exist.
   */
  head(
    storageProvider: AssetStorageProvider,
    bucket: AssetBucket,
    objectKey: AssetObjectKey,
  ): Promise<AssetStorageObject | null>;

  // ===========================================================================
  // Deletion
  // ===========================================================================

  /**
   * Removes a physical Asset object.
   *
   * This operation affects physical storage only.
   *
   * It does not transition the Asset aggregate to DELETED.
   *
   * Asset lifecycle state remains the responsibility of
   * AssetAggregate / AssetEntity.
   */
  delete(
    storageProvider: AssetStorageProvider,
    bucket: AssetBucket,
    objectKey: AssetObjectKey,
  ): Promise<void>;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AssetStoragePort;
