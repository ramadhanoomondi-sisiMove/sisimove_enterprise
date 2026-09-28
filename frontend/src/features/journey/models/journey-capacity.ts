// -----------------------------------------------------------------------------
// sisiMove — Journey Capacity Model
// -----------------------------------------------------------------------------
//
// Frontend projection of JourneyCapacity.
//
// The backend JourneyCapacity entity owns:
// - totalSeats
// - bookedSeats
// - derived availableSeats
//
// Important:
// - `availableSeats` is derived by the backend.
// - The frontend must never calculate or submit it as mutable state.
// - `bookedSeats` represents operational booking state and should be treated
//   as read-only by Journey configuration UI.
// - Journey creation/configuration supplies the capacity configuration;
//   booking operations belong to the Booking bounded context.
//
// This model intentionally contains only fields exposed by the Journey
// read projections. It does not expose persistence IDs or timestamps.
// -----------------------------------------------------------------------------

export interface JourneyCapacity {
  /**
   * JourneyCapacity public identifier.
   *
   * This is an opaque public reference supplied by the backend.
   */
  readonly publicId: string;

  /**
   * Total passenger seats available on the journey.
   */
  readonly totalSeats: number;

  /**
   * Seats currently occupied by confirmed bookings.
   *
   * This is operational state and is not a Journey configuration field.
   */
  readonly bookedSeats: number;

  /**
   * Seats currently available for booking.
   *
   * Derived by the backend from the capacity/booking state.
   */
  readonly availableSeats: number;
}