// -----------------------------------------------------------------------------
// sisiMove — Asset API Model
// -----------------------------------------------------------------------------
//
// Public-facing representation of an Asset.
//
// This is NOT a mirror of the Prisma Asset model.
//
// Internal persistence concerns such as:
// - id
// - ownerIdentityId
// - storageProvider
// - bucket
// - objectKey
//
// must not cross the API boundary.
//
// Asset ownership is represented by the owner's public identity identifier.
//
// The Asset model represents the authenticated Asset-management read boundary.
// Public URL resolution belongs to PublicAsset.
//
// -----------------------------------------------------------------------------
//
// Asset
//
//     Asset domain
//          │
//          │ API read
//          ▼
//     AssetResponseMapper
//          │
//          ▼
//     Asset
//          │
//          ├── publicId
//          ├── ownerPublicId
//          ├── type
//          ├── category
//          ├── status
//          ├── visibility
//          ├── originalFilename
//          ├── mimeType
//          ├── sizeBytes
//          ├── uploadedAt
//          ├── archivedAt
//          ├── deletedAt
//          ├── createdAt
//          └── updatedAt
//
// -----------------------------------------------------------------------------
//
// AUTHENTICATED ASSET MANAGEMENT
//
// The Asset model is used by authenticated Asset operations such as:
//
//     GET    /assets/owner
//     POST   /assets
//     PATCH  /assets/:assetPublicId/archive
//     DELETE /assets/:assetPublicId
//     PATCH  /assets/:assetPublicId/visibility
//
// Ownership is determined by the backend from the authenticated identity.
//
// The frontend must never provide:
//
//     ownerIdentityId
//     ownerIdentityPublicId
//
// for owner-scoped operations.
//
// -----------------------------------------------------------------------------
//
// PUBLIC ASSET DELIVERY
//
// Public rendering is intentionally represented by a separate model:
//
//     PublicAsset
//
// That boundary exposes only:
//
//     publicId
//     url
//     alt
//
// The general Asset model therefore does NOT contain:
//
//     url
//
// URL resolution may use:
//
//     - signed URLs;
//     - CDN URLs;
//     - application media endpoints;
//     - another controlled delivery mechanism.
//
// `AssetVisibility.PUBLIC` does not mean that the underlying storage object
// representation is exposed directly.
//
// -----------------------------------------------------------------------------
//
// INTERNAL STORAGE
//
// The following must never cross the API boundary:
//
//     storageProvider
//     bucket
//     objectKey
//     internal database id
//
// The API therefore remains independent of the physical storage provider.
//
// -----------------------------------------------------------------------------


export interface Asset {
  /**
   * Stable public identifier of the Asset.
   *
   * This is Asset.publicId.
   *
   * The internal database Asset.id must never cross the API boundary.
   */
  publicId: string;

  /**
   * Public identifier of the owning Identity.
   *
   * This is intentionally the Identity publicId rather than the internal
   * Identity database id.
   *
   * For owner-scoped operations, the authenticated identity is authoritative.
   *
   * A null value represents an Asset that currently has no owner, for example
   * after ownership has been removed from the persistence layer.
   */
  ownerPublicId: string | null;

  /**
   * Broad type of stored content.
   *
   * Examples:
   *
   *     IMAGE
   *     VIDEO
   *     AUDIO
   *     DOCUMENT
   *     OTHER
   */
  type: string;

  /**
   * Application-level classification of the Asset.
   *
   * Examples:
   *
   *     PROFILE_PHOTO
   *     GOVERNMENT_ID
   *     DRIVER_LICENSE
   *     VEHICLE_PHOTO
   */
  category: string;

  /**
   * Current Asset lifecycle status.
   *
   * Examples:
   *
   *     UPLOADING
   *     UPLOADED
   *     READY
   *     ARCHIVED
   *     DELETED
   */
  status: string;

  /**
   * Whether the Asset is publicly or privately visible.
   *
   * Examples:
   *
   *     PUBLIC
   *     PRIVATE
   */
  visibility: string;

  /**
   * Original filename supplied when the Asset was uploaded.
   *
   * This is metadata only.
   *
   * It must never be interpreted as the physical storage object key.
   */
  originalFilename: string | null;

  /**
   * MIME type of the stored content.
   */
  mimeType: string;

  /**
   * Size of the stored content in bytes.
   *
   * The API exposes a JavaScript number rather than Prisma's BigInt type.
   */
  sizeBytes: number;

  /**
   * Timestamp at which the Asset became uploaded.
   *
   * ISO-8601 timestamp string when available.
   */
  uploadedAt: string | null;

  /**
   * Timestamp at which the Asset was archived.
   *
   * ISO-8601 timestamp string when available.
   */
  archivedAt: string | null;

  /**
   * Timestamp at which the Asset was deleted.
   *
   * ISO-8601 timestamp string when available.
   */
  deletedAt: string | null;

  /**
   * Asset creation timestamp.
   *
   * ISO-8601 timestamp string.
   */
  createdAt: string;

  /**
   * Last modification timestamp.
   *
   * ISO-8601 timestamp string.
   */
  updatedAt: string;
}