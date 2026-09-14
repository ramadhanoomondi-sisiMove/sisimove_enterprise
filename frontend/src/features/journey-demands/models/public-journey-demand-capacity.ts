// -----------------------------------------------------------------------------
// sisiMove — Public Journey Demand Capacity
// -----------------------------------------------------------------------------
//
// Public passenger requirement for a Journey Demand.
//
// requestedSeats represents the total number of seats requested.
//
// matchedSeats represents the number of those seats that have already been
// associated with a Journey through the demand's matching lifecycle.
//
// availableSeats is derived rather than persisted.
// -----------------------------------------------------------------------------

export interface PublicJourneyDemandCapacity {
  /**
   * Total number of passenger seats requested.
   */
  requestedSeats: number;

  /**
   * Number of requested seats currently matched.
   */
  matchedSeats: number;

  /**
   * Number of requested seats still looking for supply.
   *
   * Derived as:
   *
   *     requestedSeats - matchedSeats
   */
  remainingSeats: number;
}