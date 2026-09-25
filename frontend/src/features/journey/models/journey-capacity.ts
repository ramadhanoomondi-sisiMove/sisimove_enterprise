// -----------------------------------------------------------------------------
// sisiMove — Journey Capacity Model
// -----------------------------------------------------------------------------
//
// Frontend representation of Journey capacity exposed by the Journey HTTP API.
//
// Capacity describes the total passenger-seat capacity of a Journey and the
// number of seats currently booked.
//
// Internal database identifiers are intentionally excluded.
//
// -----------------------------------------------------------------------------

/**
 * Journey passenger capacity.
 */
export interface JourneyCapacity {
  /**
   * Public identifier of the capacity configuration.
   */
  publicId: string;

  /**
   * Total passenger seats available for the Journey.
   */
  totalSeats: number;

  /**
   * Number of passenger seats currently booked.
   */
  bookedSeats: number;

  /**
   * Number of seats currently available.
   *
   * This is a derived frontend convenience value and should not be sent back
   * to the API as authoritative state.
   */
  readonly availableSeats: number;

  /**
   * Creation timestamp returned by the API, when available.
   */
  createdAt?: string;

  /**
   * Last update timestamp returned by the API, when available.
   */
  updatedAt?: string;
}