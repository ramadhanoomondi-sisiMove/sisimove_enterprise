// -----------------------------------------------------------------------------
// sisiMove — Public Trust Badge
// -----------------------------------------------------------------------------
//
// Public read model for a Trust Badge.
//
// This is intentionally NOT a mirror of either:
//
// - TrustBadge
// - TrustProfileBadge
//
// The Trust domain separates badge definitions from badge assignments:
//
// TrustBadge
//     └── defines what a badge means
//
// TrustProfileBadge
//     └── records that a badge was awarded to a TrustProfile
//
// The public marketplace does not need that internal distinction. It needs
// the safe, renderable representation of an active badge belonging to a
// traveller.
//
// The public boundary therefore combines the badge definition with its public
// presentation asset while hiding internal Trust-domain relations and
// lifecycle data.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Public Trust Badge
// -----------------------------------------------------------------------------

export interface PublicTrustBadge {
  /**
   * Stable public identifier of the badge definition.
   *
   * This is the TrustBadge.publicId, not the internal database identifier.
   */
  publicId: string;

  /**
   * Semantic badge type.
   *
   * This mirrors the public meaning of TrustBadgeType without exposing the
   * Prisma enum itself.
   */
  type: PublicTrustBadgeType;

  /**
   * Human-readable badge name.
   *
   * Example:
   *
   *     Identity verified
   *     Reliable provider
   */
  name: string;

  /**
   * Optional explanation of what the badge represents.
   */
  description: string | null;

  /**
   * Optional public presentation asset.
   *
   * The Asset domain resolves the underlying asset reference into a safe,
   * renderable representation before it reaches this model.
   */
  asset: PublicTrustBadgeAsset | null;
}

// -----------------------------------------------------------------------------
// Public Trust Badge Type
// -----------------------------------------------------------------------------
//
// These values correspond to TrustBadgeType in the backend.
//
// Keeping this type local to the frontend preserves the feature boundary and
// prevents UI code from depending on backend/Prisma implementation details.
//
// -----------------------------------------------------------------------------

export type PublicTrustBadgeType =
  | "IDENTITY_VERIFIED"
  | "PHONE_VERIFIED"
  | "EXPERIENCED_PROVIDER"
  | "EXPERIENCED_TRAVELLER"
  | "RELIABLE_PROVIDER"
  | "RELIABLE_TRAVELLER"
  | "HIGHLY_RATED";

// -----------------------------------------------------------------------------
// Public Trust Badge Asset
// -----------------------------------------------------------------------------
//
// Only information required to render the badge image belongs here.
//
// Storage-provider information, bucket names, object keys, ownership,
// lifecycle state, internal Asset IDs, and other storage metadata remain
// inside the Asset domain.
//
// -----------------------------------------------------------------------------

export interface PublicTrustBadgeAsset {
  /**
   * Stable public Asset identifier.
   */
  publicId: string;

  /**
   * Safe renderable URL resolved by the public Asset boundary.
   */
  url: string;

  /**
   * Optional accessible alternative text.
   */
  alt: string | null;
}