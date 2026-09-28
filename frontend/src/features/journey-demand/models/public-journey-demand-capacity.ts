// -----------------------------------------------------------------------------
// sisiMove — Public Journey Demand Capacity
// -----------------------------------------------------------------------------
//
// Public passenger requirement for a Journey Demand.
//
// `requestedSeats` represents the total number of passenger seats requested.
//
// `matchedSeats` represents the number of those requested seats currently
// associated with a Journey through the Demand matching lifecycle.
//
// The public projection intentionally exposes the values supplied by the
// backend without deriving additional business-state fields.
//
// In particular, the frontend must not calculate `remainingSeats` from:
//
//     requestedSeats - matchedSeats
//
// because the backend owns the semantics of matching and demand lifecycle
// state. If the product later requires a public "remaining seats" concept,
// that value should be explicitly defined and supplied by the backend
// projection.
// -----------------------------------------------------------------------------

export interface PublicJourneyDemandCapacity {
  /**
   * Total number of passenger seats requested.
   */
  readonly requestedSeats: number;

  /**
   * Number of requested seats currently matched.
   */
  readonly matchedSeats: number;
}