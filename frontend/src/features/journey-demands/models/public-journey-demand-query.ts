// -----------------------------------------------------------------------------
// sisiMove — Public Journey Demand Query
// -----------------------------------------------------------------------------
//
// Query parameters used to refine publicly discoverable Journey Demands.
//
// An empty query is valid. The public marketplace initially loads available
// Journey Demands without requiring the visitor to search first.
//
// These fields represent marketplace discovery criteria only. They are not
// domain Value Objects and should remain primitive frontend query values.
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
   */
  readonly date?: string;
}

