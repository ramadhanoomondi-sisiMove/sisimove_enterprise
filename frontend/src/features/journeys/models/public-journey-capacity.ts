// -----------------------------------------------------------------------------
// sisiMove — Public Journey Capacity
// -----------------------------------------------------------------------------
//
// Public seat availability for a Journey.
//
// availableSeats is derived from totalSeats - bookedSeats rather than being
// persisted as a separate mutable value.
//
// This prevents duplicated seat state from becoming inconsistent.
// -----------------------------------------------------------------------------

export interface PublicJourneyCapacity {
  totalSeats: number;

  bookedSeats: number;

  availableSeats: number;
}