// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Capacity
// -----------------------------------------------------------------------------
//
// Presentation/API model for the number of seats requested by a demand.
//
// -----------------------------------------------------------------------------

export interface JourneyDemandCapacity {
  /**
   * Public identifier of the capacity component.
   */
  publicId: string;

  /**
   * Number of seats requested by the demand.
   */
  requestedSeats: number;

  /**
   * Number of requested seats currently matched.
   *
   * Backend default: 0.
   */
  matchedSeats: number;

  createdAt: string;
  updatedAt: string;
}