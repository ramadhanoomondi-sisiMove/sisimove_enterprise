// -----------------------------------------------------------------------------
// Trust Rating
// -----------------------------------------------------------------------------
//
// Frontend representation of a traveller's public rating summary.
//
// Ratings are trust signals derived from eligible SisiMove journey
// interactions. This model represents the aggregated public result, not the
// underlying rating records.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Trust Rating
// -----------------------------------------------------------------------------

/**
 * Aggregated public rating for a traveller.
 *
 * The Trust domain remains responsible for calculating and maintaining the
 * rating. The frontend only consumes the resulting public summary.
 *
 * This model intentionally does not contain:
 * - Individual reviewer identities
 * - Individual review records
 * - Review text
 * - Booking identifiers
 * - Internal moderation information
 * - Fraud/risk signals
 * - Rating calculation details
 */
export interface TrustRating {
  /**
   * Aggregated rating score.
   *
   * Null means the traveller does not yet have enough eligible ratings to
   * present a score.
   */
  score: number | null;

  /**
   * Number of eligible ratings contributing to the public score.
   */
  count: number;
}