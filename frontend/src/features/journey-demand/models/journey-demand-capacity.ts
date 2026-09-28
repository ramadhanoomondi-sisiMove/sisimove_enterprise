// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Capacity Model
// -----------------------------------------------------------------------------
//
// Frontend representation of JourneyDemandCapacityResponse.
//
// Capacity state is supplied by the backend. The frontend consumes the
// convenience flags rather than recreating capacity rules.
// -----------------------------------------------------------------------------

/**
 * Journey Demand capacity response model.
 */
export interface JourneyDemandCapacity {
  /**
   * Stable public identifier exposed by the backend.
   */
  readonly publicId: string;

  /**
   * Number of seats requested by the demand.
   */
  readonly requestedSeats: number;

  /**
   * Number of requested seats already matched.
   */
  readonly matchedSeats: number;

  /**
   * Number of seats still available to be matched.
   */
  readonly remainingSeats: number;

  /**
   * Backend-provided capacity state.
   */
  readonly hasCapacity: boolean;
  readonly isFull: boolean;
  readonly isEmpty: boolean;
  readonly isPartiallyMatched: boolean;
  readonly isFullyMatched: boolean;

  /**
   * Backend timestamps.
   */
  readonly createdAt: Date;
  readonly updatedAt: Date;
}