// -----------------------------------------------------------------------------
// sisiMove — Public Trust Profile Response
// -----------------------------------------------------------------------------
//
// This response is the deliberately reduced public representation of Trust
// required by public marketplace experiences.
//
// It is NOT a replacement for TrustProfileResponse.
//
// TrustProfileResponse remains the broad operational REST representation used
// by the Trust bounded context's existing endpoints.
//
// This contract exists because the public marketplace has a different concern:
// it needs enough trust information to help a traveller make an informed
// decision, without exposing Trust's internal operational model.
//
// Publicly exposed:
// - verification level;
// - aggregate rating;
// - rating count;
// - completed journeys;
// - active public badges;
// - public badge assets.
//
// Deliberately excluded:
// - database IDs;
// - memberPublicId;
// - Trust profile status;
// - provider/passenger cancellation statistics;
// - internal Trust events;
// - ratings/review identities;
// - booking identifiers;
// - journey identifiers;
// - internal timestamps;
// - profile-badge identifiers;
// - badge catalogue lifecycle state.
//
// -----------------------------------------------------------------------------

// =============================================================================
// Public Badge Asset
// =============================================================================

export interface PublicTrustBadgeAssetResponse {
  /**
   * Public identifier of the Asset bounded-context resource.
   *
   * This remains opaque to Trust.
   */
  publicId: string;

  /**
   * Browser-consumable public URL.
   */
  url: string;

  /**
   * Accessible alternative text.
   *
   * The Trust badge name is used as the semantic description because Asset
   * itself does not own marketplace-specific badge copy.
   */
  alt: string;
}

// =============================================================================
// Public Trust Badge
// =============================================================================

export interface PublicTrustBadgeResponse {
  /**
   * Public badge identifier.
   */
  publicId: string;

  /**
   * Stable public badge type.
   */
  type: string;

  /**
   * Human-readable badge name.
   */
  name: string;

  /**
   * Optional public badge description.
   */
  description: string | null;

  /**
   * Public badge artwork, when configured and publicly usable.
   */
  asset: PublicTrustBadgeAssetResponse | null;
}

// =============================================================================
// Public Trust Profile
// =============================================================================

export interface PublicTrustProfileResponse {
  /**
   * Public trust verification level.
   */
  verificationLevel: string;

  /**
   * Aggregate rating.
   */
  ratingAverage: number;

  /**
   * Number of ratings contributing to the aggregate rating.
   */
  ratingCount: number;

  /**
   * Number of completed journeys represented by Trust.
   */
  completedJourneys: number;

  /**
   * Active public badges awarded to this traveller.
   */
  badges: PublicTrustBadgeResponse[];
}
