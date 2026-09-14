// -----------------------------------------------------------------------------
// sisiMove — Public Traveller
// -----------------------------------------------------------------------------
//
// Public read model for a Traveller Profile.
//
// This is intentionally NOT a mirror of the TravellerProfile Prisma model.
//
// The Traveller Profile domain owns:
// - profile lifecycle
// - visibility
// - journey statistics
// - profile preferences
// - frequent corridors
// - cross-domain Identity and Asset references
//
// The public model contains only information intentionally exposed to other
// marketplace visitors.
//
// The public read boundary resolves avatarAssetPublicId into a safe,
// renderable public asset representation.
//
// Internal Identity references, lifecycle information, profile preferences,
// and private operational data are not exposed.
// -----------------------------------------------------------------------------

export interface PublicTraveller {
  /**
   * Stable public identifier for the Traveller Profile.
   *
   * This is safe to use when referencing the public traveller resource.
   */
  publicId: string;

  /**
   * Public traveller handle.
   *
   * Example:
   *
   *     john_doe
   */
  handle: string;

  /**
   * Optional public biography.
   */
  bio: string | null;

  /**
   * Public avatar associated with the Traveller Profile.
   *
   * The avatar is resolved from the Asset domain into a renderable public
   * representation.
   */
  avatar: PublicTravellerAvatar | null;

  /**
   * ISO 3166-1 alpha-2 country code.
   *
   * Example:
   *
   *     KE
   */
  countryCode: string;
}

// -----------------------------------------------------------------------------
// Public Traveller Avatar
// -----------------------------------------------------------------------------
//
// This deliberately contains only information required to render the avatar.
//
// Storage-provider information, object keys, buckets, ownership references,
// internal Asset IDs, and Asset lifecycle state remain behind the public Asset
// boundary.
// -----------------------------------------------------------------------------

export interface PublicTravellerAvatar {
  /**
   * Public Asset identifier.
   */
  publicId: string;

  /**
   * Safe renderable URL returned by the public Asset boundary.
   */
  url: string;

  /**
   * Optional accessible alternative text.
   */
  alt: string | null;
}