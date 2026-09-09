// -----------------------------------------------------------------------------
// sisiMove — Public Asset
// -----------------------------------------------------------------------------
//
// Public read model for an Asset.
//
// This model intentionally does NOT mirror the backend Asset entity.
// Storage details, ownership information, internal classifications,
// moderation state, and lifecycle information remain server-side.
//
// Public API consumers use `publicId` as the stable public identifier.
//
// Typical public assets include:
// - profile and avatar images
// - cover images
// - vehicle photos
// - approved journey images
// - other explicitly public media
//
// Sensitive or private assets must never be exposed through this model,
// including:
// - government IDs
// - passports
// - driver's licences
// - verification selfies
// - private attachments
// - internal moderation evidence
//
// The backend is responsible for determining whether an asset is public
// and for resolving its appropriate delivery URL.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Public Asset Type
// -----------------------------------------------------------------------------

export type PublicAssetType =
  | 'IMAGE'
  | 'VIDEO'
  | 'AUDIO'
  | 'OTHER';

// -----------------------------------------------------------------------------
// Public Asset
// -----------------------------------------------------------------------------

export interface PublicAsset {
  /**
   * Stable public identifier of the asset.
   *
   * This is the identifier used by public frontend APIs and cross-feature
   * references where a public asset is required.
   */
  readonly publicId: string;

  /**
   * URL used by the client to retrieve the public representation.
   *
   * The backend determines the appropriate delivery URL. Depending on the
   * asset and infrastructure, this may be a CDN URL, public media URL,
   * or signed URL.
   *
   * Raw storage-provider URLs and storage credentials must never be exposed.
   */
  readonly url: string;

  /**
   * Public media category.
   */
  readonly type: PublicAssetType;

  /**
   * MIME type of the publicly served representation.
   *
   * This is optional because the public API may intentionally omit
   * low-level media metadata.
   */
  readonly mimeType: string | null;

  /**
   * Human-readable alternative text for accessibility.
   *
   * Null when alternative text is not applicable or has not been provided.
   */
  readonly altText: string | null;

  /**
   * Display width of the public representation, when known.
   *
   * This is presentation metadata and does not describe storage dimensions.
   */
  readonly width: number | null;

  /**
   * Display height of the public representation, when known.
   *
   * This is presentation metadata and does not describe storage dimensions.
   */
  readonly height: number | null;

  /**
   * Duration of the public representation in seconds.
   *
   * Primarily applicable to audio and video assets.
   */
  readonly durationSeconds: number | null;
}