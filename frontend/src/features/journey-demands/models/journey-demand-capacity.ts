// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Capacity
// -----------------------------------------------------------------------------
//
// Frontend representation of the seat capacity requested by a Journey Demand.
//
// This model is independent of Prisma models, persistence records, domain
// entities, and aggregates.
//
// The backend remains authoritative for all capacity calculations.
//
// Public discovery may choose to expose only requestedSeats and remainingSeats.
// Matched-seat information is primarily useful to the authenticated demand
// owner and Journey Demand workflows.
//
// -----------------------------------------------------------------------------

export interface JourneyDemandCapacity {
  /**
   * Public identifier of the capacity record.
   */
  publicId: string;

  /**
   * Total number of seats requested.
   */
  requestedSeats: number;

  /**
   * Number of requested seats currently matched.
   */
  matchedSeats: number;

  /**
   * Number of requested seats still requiring a match.
   *
   * This value is calculated authoritatively by the backend.
   */
  remainingSeats: number;
}