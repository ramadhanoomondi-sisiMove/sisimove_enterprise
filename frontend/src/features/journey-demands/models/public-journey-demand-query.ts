// -----------------------------------------------------------------------------
// sisiMove — Public Journey Demand Query
// -----------------------------------------------------------------------------
//
// Query parameters used to refine publicly discoverable Journey Demands.
//
// An empty query is valid. The public marketplace initially loads all
// publicly discoverable Journey Demands without requiring the visitor to
// search first.
//
// These fields represent marketplace discovery criteria only. They are not
// domain Value Objects and should remain primitive frontend query values.
//
// -----------------------------------------------------------------------------

export interface PublicJourneyDemandQuery {
  /**
   * Origin/location from which the traveller is looking to travel.
   */
  readonly from?: string;

  /**
   * Destination/location to which the traveller is looking to travel.
   */
  readonly to?: string;

  /**
   * Requested travel date.
   *
   * Kept as a string because this is an HTTP/query representation rather than
   * a domain date Value Object.
   *
   * Expected representation:
   *
   *     YYYY-MM-DD
   */
  readonly date?: string;

  /**
   * Maximum number of public Journey Demands to return.
   *
   * Pagination is part of marketplace discovery and does not change the
   * underlying public read model.
   */
  readonly limit?: number;

  /**
   * Number of public Journey Demands to skip before returning results.
   *
   * Used together with limit for collection pagination.
   */
  readonly offset?: number;
}