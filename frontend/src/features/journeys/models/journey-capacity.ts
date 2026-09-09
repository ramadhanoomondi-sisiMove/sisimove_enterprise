// -----------------------------------------------------------------------------
// SisiMove — Journey Capacity
// -----------------------------------------------------------------------------
//
// Public/frontend representation of Journey seat capacity.
//
// This model is a frontend read model and is intentionally independent of:
// - Prisma models
// - backend domain entities
// - aggregates
// - persistence structures
//
// The backend is authoritative for Journey capacity and seat availability.
//
// The frontend must treat `availableSeats` as the authoritative public
// availability projection and must not derive or recalculate it locally.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Journey Capacity
// -----------------------------------------------------------------------------

export interface JourneyCapacity {
  /**
   * Stable public identifier of the capacity representation.
   *
   * This is an opaque frontend-safe identifier and must not be treated as an
   * internal database identifier.
   */
  publicId: string;

  /**
   * Total passenger seats offered by the Journey.
   *
   * This is a non-negative integer.
   */
  totalSeats: number;

  /**
   * Number of seats currently booked.
   *
   * This is a non-negative integer representing the backend's current public
   * booking projection.
   */
  bookedSeats: number;

  /**
   * Number of seats currently available for booking.
   *
   * This is a non-negative integer and is authoritative for public
   * availability.
   *
   * The frontend must not calculate this value from `totalSeats` and
   * `bookedSeats`, because booking state can change concurrently and the
   * backend owns the authoritative availability calculation.
   */
  availableSeats: number;
}