// -----------------------------------------------------------------------------
// sisiMove — Public Asset
// -----------------------------------------------------------------------------
//
// Public read model for an Asset.
//
// This is intentionally NOT a mirror of the Asset Prisma model.
//
// The Asset domain owns:
// - asset ownership;
// - asset classification;
// - upload lifecycle;
// - visibility;
// - storage provider;
// - bucket/object-key information;
// - original file metadata;
// - internal Identity ownership;
// - archival/deletion state.
//
// None of those internal concerns belong in the public marketplace contract.
//
// A public consumer only needs enough information to render an asset safely:
//
//     publicId
//     url
//     alt
//
// The public Asset boundary is responsible for resolving the internal storage
// representation into a safe, renderable URL.
//
// This is especially important because:
//
//     AssetVisibility.PUBLIC
//
// does NOT necessarily mean that the underlying storage object should be
// exposed directly. The backend may use signed URLs, a CDN, an application
// media endpoint, or another controlled delivery mechanism.
//
// -----------------------------------------------------------------------------
//
// Public Asset
//
//     Asset domain
//          │
//          │ safe public read
//          ▼
//     PublicAsset
//          │
//          ├── publicId
//          ├── url
//          └── alt
//
// -----------------------------------------------------------------------------

export interface PublicAsset {
  /**
   * Stable public identifier of the Asset.
   *
   * This is Asset.publicId.
   *
   * The internal Asset.id must never cross the public boundary.
   */
  publicId: string;

  /**
   * Safe, renderable URL for the asset.
   *
   * The backend public read boundary is responsible for resolving this URL.
   *
   * It may represent:
   * - a CDN URL;
   * - a controlled media endpoint;
   * - a signed URL;
   * - another application-approved public delivery mechanism.
   *
   * The frontend must not construct this URL from bucket, objectKey, or
   * storageProvider information.
   */
  url: string;

  /**
   * Optional accessible alternative text.
   *
   * This is presentation metadata and is deliberately separate from the
   * Asset's original filename.
   */
  alt: string | null;
}