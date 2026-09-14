// -----------------------------------------------------------------------------
// sisiMove — Assets
// Asset Storage Port
// -----------------------------------------------------------------------------
//
// Application-facing abstraction for physical Asset storage.
//
// -----------------------------------------------------------------------------
//
// ARCHITECTURAL BOUNDARY
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
// AssetStoragePort represents the physical-storage capability required by the
// application layer. Concrete storage providers remain infrastructure concerns.
//
// The application layer communicates with physical storage through this port
// without depending on provider SDKs or HTTP/framework file representations.
//
// -----------------------------------------------------------------------------
//
// RESPONSIBILITIES
//
// This port provides capabilities to:
//
// - upload physical Asset objects;
// - retrieve physical Asset objects;
// - check physical Asset object existence;
// - retrieve physical Asset metadata;
// - delete physical Asset objects.
//
// -----------------------------------------------------------------------------
//
// THIS PORT DOES NOT
//
// This port does NOT:
//
// - depend on Prisma;
// - depend on ORM models;
// - depend on AWS SDK;
// - depend on Google Cloud SDK;
// - depend on Azure SDK;
// - depend on Cloudinary SDK;
// - depend on concrete filesystem implementations;
// - depend on Express;
// - depend on Express.Multer.File;
// - validate Identity domain state;
// - load Identity aggregates;
// - validate Asset domain state;
// - change Asset lifecycle state;
// - change Asset visibility;
// - create Asset aggregates;
// - persist Asset aggregates;
// - generate public URLs;
// - generate signed URLs;
// - generate authentication credentials;
// - perform authorization checks;
// - decide whether an Asset may be uploaded;
// - decide whether an Asset may be deleted;
// - process images, videos, audio, or documents.
//
// Domain lifecycle transitions remain inside AssetAggregate / AssetEntity.
//
// Asset aggregate persistence remains behind AssetRepository.
//
// Public delivery is intentionally a separate capability from physical
// storage. A future public-delivery port may resolve a renderable URL or
// delivery endpoint without changing this abstraction.
//
// -----------------------------------------------------------------------------
//
// STORAGE PROVIDERS
//
// Concrete infrastructure implementations may support providers such as:
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
// The concrete implementation is responsible for translating the provider
// value object into the appropriate infrastructure SDK or storage mechanism.
//
// -----------------------------------------------------------------------------
//
// OBJECT IDENTITY
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
// This port does not generate or mutate AssetObjectKey values.
//
// Object-key generation belongs to the application workflow or another
// dedicated storage-addressing capability. The storage adapter receives the
// final object key and stores the object at that location.
//
// -----------------------------------------------------------------------------
//
// UPLOAD SEMANTICS
//
// upload() stores the supplied physical object.
//
// The operation MUST NOT create or modify an Asset aggregate.
//
// The application workflow coordinates:
//
//     Asset: UPLOADING
//          ↓
//     physical upload
//          ↓
//     Asset: UPLOADED
//
// Implementations SHOULD NOT silently overwrite an existing physical object.
// If the target object already exists, the implementation should fail rather
// than replace it implicitly.
//
// This prevents accidental corruption when an application retry reuses an
// object key.
//
// -----------------------------------------------------------------------------
//
// STREAMING
//
// The port uses Node.js Readable as the content boundary.
//
// This intentionally avoids:
//
// - Express.Multer.File;
// - Buffer-only APIs;
// - provider-specific body types;
// - framework-specific request objects.
//
// The controller/application layer may adapt an incoming HTTP upload into a
// Readable stream before invoking this port.
//
// The storage adapter may consume the stream according to the capabilities of
// the underlying provider.
//
// -----------------------------------------------------------------------------
//
// SECURITY
//
// Implementations MUST NOT expose or return:
//
// - access keys;
// - secret keys;
// - provider credentials;
// - private signing keys;
// - authentication tokens;
// - refresh tokens;
// - passwords.
//
// Provider credentials belong exclusively to infrastructure configuration.
//
// -----------------------------------------------------------------------------
//
// PUBLIC DELIVERY
//
// Public URL generation is deliberately NOT part of AssetStoragePort.
//
// Physical storage and public delivery are separate concerns:
//
//     AssetStoragePort
//          ↓
//     physical object
//
//     AssetPublicDeliveryPort
//          ↓
//     renderable public resource
//
// This separation allows sisiMove to change storage providers, CDN strategy,
// signed URL strategy, or public delivery architecture without changing the
// Asset domain model or physical-storage contract.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Node.js Stream
// -----------------------------------------------------------------------------

import type { Readable } from 'node:stream';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { AssetBucket } from '../../domain/value-objects/asset-bucket.vo';
import type { AssetMimeType } from '../../domain/value-objects/asset-mime-type.vo';
import type { AssetObjectKey } from '../../domain/value-objects/asset-object-key.vo';
import type { AssetSizeBytes } from '../../domain/value-objects/asset-size-bytes.vo';
import type { AssetStorageProvider } from '../../domain/value-objects/asset-storage-provider.vo';

// =============================================================================
// Physical Storage Object
// =============================================================================

/**
 * Storage-neutral representation of a physical Asset object.
 *
 * This represents the physical object known by the storage system.
 *
 * It intentionally contains only metadata that belongs at the storage
 * boundary and does not expose provider-specific SDK types.
 */
export interface AssetStorageObject {
  /**
   * Storage provider containing the physical object.
   */
  readonly storageProvider: AssetStorageProvider;

  /**
   * Storage bucket or container containing the object.
   */
  readonly bucket: AssetBucket;

  /**
   * Storage object key identifying the physical object.
   */
  readonly objectKey: AssetObjectKey;

  /**
   * MIME type associated with the physical object.
   */
  readonly mimeType: AssetMimeType;

  /**
   * Physical object size in bytes.
   */
  readonly sizeBytes: AssetSizeBytes;
}

// =============================================================================
// Upload Input
// =============================================================================

/**
 * Input required to store a physical Asset object.
 *
 * The storage implementation receives a fully resolved physical storage
 * location and stores the supplied stream at that location.
 */
export interface AssetStorageUpload {
  /**
   * Storage provider that should contain the physical object.
   */
  readonly storageProvider: AssetStorageProvider;

  /**
   * Storage bucket or container receiving the object.
   */
  readonly bucket: AssetBucket;

  /**
   * Object key identifying the target physical object.
   *
   * The storage implementation must treat this as the final object identity.
   */
  readonly objectKey: AssetObjectKey;

  /**
   * Physical Asset content.
   *
   * Framework-independent and provider-independent.
   */
  readonly content: Readable;

  /**
   * MIME type associated with the physical Asset.
   */
  readonly mimeType: AssetMimeType;

  /**
   * Expected physical object size.
   *
   * Implementations may use this value for content-length validation where
   * supported by the underlying provider.
   */
  readonly sizeBytes: AssetSizeBytes;
}

// =============================================================================
// Retrieved Storage Object
// =============================================================================

/**
 * Physical Asset object together with its readable content stream.
 *
 * The stream represents the physical object itself. It is not a public
 * delivery URL and must not be interpreted as an authorization mechanism.
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
 * Concrete implementations belong exclusively to infrastructure.
 *
 * The port is intentionally unaware of:
 *
 * - HTTP;
 * - authentication;
 * - authorization;
 * - Prisma;
 * - Asset aggregates;
 * - public URLs;
 * - CDN delivery;
 * - provider SDKs.
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
   * It does not:
   *
   * - create an Asset aggregate;
   * - persist an Asset aggregate;
   * - change Asset lifecycle state;
   * - change Asset visibility.
   *
   * The application workflow remains responsible for coordinating successful
   * physical storage with the Asset lifecycle transition.
   *
   * Implementations should reject attempts to silently overwrite an existing
   * object at the same storage location.
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
   * The returned stream belongs to the caller.
   *
   * The caller must either consume the stream or explicitly destroy it.
   *
   * This operation retrieves the physical object only. It does not determine
   * whether the corresponding Asset aggregate is public, READY, usable, or
   * authorized for a particular caller.
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
   * - the Asset is usable;
   * - the Asset may be exposed publicly;
   * - the current caller is authorized to access it.
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
   *
   * The returned metadata describes the physical object only.
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
