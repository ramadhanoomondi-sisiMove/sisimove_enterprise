// -----------------------------------------------------------------------------
// sisiMove — Public Journey Demand Query
// -----------------------------------------------------------------------------
//
// Query parameters used to refine publicly discoverable Journey Demands.
//
// An empty query is valid. The public marketplace initially loads publicly
// discoverable Journey Demands without requiring the visitor to search first.
//
// These fields represent marketplace discovery criteria only. They are not
// domain Value Objects and should remain primitive frontend query values.
//
// The query is intentionally smaller than the Journey Demand domain model.
// It describes what the visitor wants to discover, not how a Journey Demand
// is represented internally.
//
// -----------------------------------------------------------------------------

export interface PublicJourneyDemandQuery {
  /**
   * Origin/location from which the requested journey should begin.
   *
   * Used by marketplace discovery to find demands associated with the
   * requested origin/corridor.
   */
  readonly from?: string;

  /**
   * Destination/location to which the requested journey should end.
   *
   * Used by marketplace discovery to find demands associated with the
   * requested destination/corridor.
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
   *
   * The backend uses this value to discover demands whose requested schedule
   * is relevant to the selected date. A Journey Demand may still have a
   * flexible departure window within that date.
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
   * Used together with `limit` for collection pagination.
   */
  readonly offset?: number;
}