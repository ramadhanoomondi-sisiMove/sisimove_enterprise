// -----------------------------------------------------------------------------
// sisiMove — Public Trust Profile API Types
// -----------------------------------------------------------------------------
//
// Transport contracts for the public Trust profile API.
//
// These types represent the JSON contract returned by the Trust HTTP API.
// They are intentionally separate from the frontend Trust domain models.
//
// Responsibilities:
// - Describe the public Trust API response.
// - Define only presentation-safe Trust information.
// - Preserve the HTTP/API boundary.
//
// This file must not:
// - contain Trust business rules;
// - calculate ratings;
// - determine verification eligibility;
// - expose verification evidence;
// - expose internal risk/fraud information;
// - expose booking or financial records;
// - depend on Prisma or backend domain entities.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Public Trust Profile Response
// -----------------------------------------------------------------------------

/**
 * Public Trust profile returned for a traveller.
 *
 * The response contains only Trust signals approved for public consumption.
 */
export interface PublicTrustProfileResponse {
  /**
   * Public verification summary.
   */
  verification: PublicTrustVerificationResponse;

  /**
   * Aggregated public rating summary.
   */
  rating: PublicTrustRatingResponse;

  /**
   * Aggregated journey-history trust signals.
   */
  journeyHistory: PublicTrustJourneyHistoryResponse;

  /**
   * Public badges awarded to the traveller.
   */
  badges: PublicTrustBadgeResponse[];
}

// -----------------------------------------------------------------------------
// Verification
// -----------------------------------------------------------------------------

/**
 * Public verification representation.
 *
 * No verification evidence or sensitive identity information crosses
 * the public API boundary.
 */
export interface PublicTrustVerificationResponse {
  /**
   * Indicates whether the traveller has the public verification
   * status represented by this response.
   */
  verified: boolean;

  /**
   * Public verification level.
   *
   * Null means no public level is currently available or exposed.
   */
  level: string | null;
}

// -----------------------------------------------------------------------------
// Rating
// -----------------------------------------------------------------------------

/**
 * Public aggregated rating representation.
 */
export interface PublicTrustRatingResponse {
  /**
   * Aggregated rating score.
   *
   * Null means there is currently no publicly presentable score.
   */
  score: number | null;

  /**
   * Number of eligible ratings contributing to the public score.
   */
  count: number;
}

// -----------------------------------------------------------------------------
// Journey History
// -----------------------------------------------------------------------------

/**
 * Public aggregated journey-history representation.
 *
 * Individual journeys, booking records, traveller identities, cancellation
 * reasons, disputes, and internal Trust information are intentionally excluded.
 */
export interface PublicTrustJourneyHistoryResponse {
  /**
   * Number of successfully completed journeys.
   */
  completedJourneys: number;

  /**
   * Number of cancelled journeys appropriate to expose publicly.
   *
   * Null means the metric is unavailable or intentionally not exposed.
   */
  cancelledJourneys: number | null;
}

// -----------------------------------------------------------------------------
// Badge
// -----------------------------------------------------------------------------

/**
 * Public Trust badge representation.
 */
export interface PublicTrustBadgeResponse {
  /**
   * Public identifier of the badge.
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
   * Optional public explanation of the badge.
   */
  description: string | null;

  /**
   * Optional public badge artwork URL.
   */
  assetUrl: string | null;
}