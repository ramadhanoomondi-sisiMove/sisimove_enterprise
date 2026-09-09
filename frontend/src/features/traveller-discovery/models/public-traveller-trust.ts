// -----------------------------------------------------------------------------
// Public Traveller Trust
// -----------------------------------------------------------------------------
//
// Public trust representation for a traveller.
//
// This model is a decision-support contract for anonymous SisiMove users.
// It is NOT the Trust domain entity, TrustProfile, verification record,
// rating record, or any other backend persistence model.
//
// Trust owns the public representation of:
//
// - identity verification status
// - public ratings
// - public journey history
// - public trust badges
//
// The frontend must treat this projection as server-authoritative. It must
// not calculate, infer, or reconstruct trust information from other public
// data.
//
// The public trust contract must remain intentionally small, stable, and
// independent of backend domain enums and persistence structures.
//
// -----------------------------------------------------------------------------
//
// Never expose through this model:
//
// - identity IDs
// - verification evidence
// - verification documents
// - reviewer identities
// - moderation information
// - disputes
// - complaints
// - trust events
// - trust adjustments
// - internal trust scores
// - fraud/risk indicators
// - private rating details
// - private journey records
// - internal lifecycle metadata
//
// -----------------------------------------------------------------------------


// -----------------------------------------------------------------------------
// Public Verification Summary
// -----------------------------------------------------------------------------

/**
 * Public identity-verification summary.
 *
 * This represents only the verification result that the Trust domain has
 * approved for anonymous public display.
 *
 * It does not represent the underlying verification process or evidence.
 */
export interface PublicTravellerTrustVerification {
  /**
   * Whether the traveller currently has a publicly displayable
   * verified identity.
   */
  verified: boolean;

  /**
   * Public verification level.
   *
   * This is a public API representation rather than a backend domain enum.
   * The frontend must treat the value as an opaque public string and must
   * not depend on backend enum names or implementation details.
   *
   * Examples:
   *
   * - "BASIC"
   * - "VERIFIED"
   * - "HIGHLY_VERIFIED"
   *
   * Null means that no public verification level is currently displayed.
   */
  level: string | null;
}


// -----------------------------------------------------------------------------
// Public Rating Summary
// -----------------------------------------------------------------------------

/**
 * Public aggregate rating summary.
 *
 * This represents the rating information approved for public display by
 * the Trust domain.
 */
export interface PublicTravellerTrustRating {
  /**
   * Average public rating score.
   *
   * Null when the traveller does not yet have a publicly displayable
   * rating.
   */
  score: number | null;

  /**
   * Number of public ratings contributing to the displayed score.
   *
   * This value is supplied by the public trust projection and must not be
   * recalculated by the frontend.
   */
  count: number;
}


// -----------------------------------------------------------------------------
// Public Journey History Summary
// -----------------------------------------------------------------------------

/**
 * Public journey-history summary.
 *
 * This provides useful confidence signals without exposing individual
 * journey records.
 */
export interface PublicTravellerTrustJourneyHistory {
  /**
   * Number of completed journeys eligible for public display.
   *
   * This is a materialized public trust/profile statistic rather than
   * source-of-truth journey state.
   */
  completedJourneys: number;

  /**
   * Number of cancelled journeys eligible for public display.
   *
   * Null means that cancellation history is not currently exposed under
   * the public trust policy.
   */
  cancelledJourneys: number | null;
}


// -----------------------------------------------------------------------------
// Public Trust Badge
// -----------------------------------------------------------------------------

/**
 * Public trust badge.
 *
 * A badge is a public decision-support signal selected by the Trust domain.
 * It must never expose the internal rule, score, event, or moderation
 * decision that produced the badge.
 */
export interface PublicTravellerTrustBadge {
  /**
   * Opaque public badge identifier.
   *
   * This must not be an internal database identifier.
   */
  publicId: string;

  /**
   * Public badge type.
   *
   * This is an API-level representation and is intentionally kept as a
   * string so the frontend is not coupled to backend domain enums.
   *
   * Examples:
   *
   * - "IDENTITY_VERIFIED"
   * - "RELIABLE_PROVIDER"
   * - "HIGHLY_RATED"
   */
  type: string;

  /**
   * Human-readable badge name intended for public display.
   */
  name: string;

  /**
   * Optional public description explaining the badge in user-facing terms.
   *
   * This must not disclose internal trust rules, moderation decisions,
   * risk signals, or verification evidence.
   */
  description: string | null;

  /**
   * Optional public badge asset URL.
   *
   * The URL must be supplied by the public asset/read-model boundary and
   * must not expose private storage identifiers or internal storage paths.
   */
  assetUrl: string | null;
}


// -----------------------------------------------------------------------------
// Public Traveller Trust
// -----------------------------------------------------------------------------

/**
 * Complete public trust summary for a traveller.
 *
 * This is the public trust projection consumed by:
 *
 * - traveller discovery
 * - traveller cards
 * - public traveller profiles
 * - public journey pages
 * - other anonymous decision-support experiences
 *
 * Trust is intentionally composed separately from PublicTraveller.
 *
 * This prevents the public traveller identity contract from becoming
 * coupled to trust and reputation concerns.
 */
export interface PublicTravellerTrust {
  /**
   * Public verification summary.
   */
  verification: PublicTravellerTrustVerification;

  /**
   * Public aggregate rating summary.
   */
  rating: PublicTravellerTrustRating;

  /**
   * Public journey-history summary.
   */
  journeyHistory: PublicTravellerTrustJourneyHistory;

  /**
   * Public trust badges.
   *
   * The backend public projection determines which badges are currently
   * eligible for anonymous display.
   */
  badges: PublicTravellerTrustBadge[];
}