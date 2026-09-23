// -----------------------------------------------------------------------------
// sisiMove — Journey Capacity Model
// -----------------------------------------------------------------------------
//
// Represents the seat capacity of a Journey.
//
// bookedSeats is maintained by the Journey/Booking lifecycle and should be
// treated as server-owned state by the frontend.
// -----------------------------------------------------------------------------

export interface JourneyCapacity {
  publicId: string;

  totalSeats: number;

  bookedSeats: number;
}