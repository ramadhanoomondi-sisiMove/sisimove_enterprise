// -----------------------------------------------------------------------------
// Trust Profile
// -----------------------------------------------------------------------------
//
// Canonical frontend representation of a SisiMove traveller's trust profile.
//
// Trust is a first-class product capability. It provides the information a
// traveller needs to assess another traveller before engaging in a journey.
//
// This model is intentionally independent of:
// - Identity persistence models
// - Verification evidence
// - Booking records
// - Financial records
// - Moderation/internal risk data
// - Prisma/domain entities
//
// Trust information is derived by the Trust domain and exposed through
// appropriate public or authenticated read models.
//
// -----------------------------------------------------------------------------

import type { TrustBadge } from './trust-badge';
import type { TrustRating } from './trust-rating';
import type { TrustVerification } from './trust-verification';

// -----------------------------------------------------------------------------
// Trust Profile
// -----------------------------------------------------------------------------

/**
 * Complete frontend trust summary for a traveller.
 *
 * This model can be composed with TravellerProfile and Traveller Activity
 * models to build:
 * - Public traveller profiles
 * - Traveller discovery cards
 * - Journey participant views
 * - Trust summaries
 * - Traveller decision-support experiences
 *
 * The model contains trust signals, not the underlying evidence used to
 * establish those signals.
 */
export interface TrustProfile {
  /**
   * Public verification summary.
   *
   * Contains only the verification state intended for the current consumer.
   * It must never contain identity documents or verification evidence.
   */
  verification: TrustVerification;

  /**
   * Public rating summary.
   *
   * Represents ratings generated from eligible SisiMove journey interactions.
   */
  rating: TrustRating;

  /**
   * Summary of the traveller's journey history relevant to trust.
   */
  journeyHistory: TrustJourneyHistory;

  /**
   * Public trust badges earned by the traveller.
   */
  badges: TrustBadge[];
}

// -----------------------------------------------------------------------------
// Journey History
// -----------------------------------------------------------------------------

/**
 * Public journey-history summary used as a trust signal.
 *
 * This is intentionally aggregated. Individual booking records, passenger
 * identities, cancellation reasons, disputes, and internal risk information
 * do not belong here.
 */
export interface TrustJourneyHistory {
  /**
   * Number of journeys successfully completed by the traveller.
   */
  completedJourneys: number;

  /**
   * Number of cancelled journeys that are appropriate to expose to the
   * current trust consumer.
   *
   * Null means the metric is unavailable or intentionally not exposed.
   */
  cancelledJourneys: number | null;
}