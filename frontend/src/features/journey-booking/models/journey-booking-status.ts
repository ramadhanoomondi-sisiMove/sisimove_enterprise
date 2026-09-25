// -----------------------------------------------------------------------------
// Journey Booking Status
// -----------------------------------------------------------------------------
//
// Frontend/application representation of the Journey Booking lifecycle state.
//
// The backend JourneyBookingStatus is a domain enum. The frontend deliberately
// represents the API value as a string-literal union rather than reproducing the
// backend enum or importing backend domain code.
//
// The backend aggregate remains authoritative for all lifecycle transitions.
// This file only defines the values that can be received from or sent to the
// Journey Booking HTTP API.
// -----------------------------------------------------------------------------

/**
 * Supported Journey Booking lifecycle statuses.
 *
 * Lifecycle:
 *
 * PENDING
 *   ├── CONFIRMED
 *   │     └── COMPLETED
 *   ├── CANCELLED
 *   └── EXPIRED
 *
 * The frontend must not infer or perform these transitions locally.
 * Transitions are performed by the backend JourneyBooking aggregate.
 */
export const JOURNEY_BOOKING_STATUSES = [
  'PENDING',
  'CONFIRMED',
  'CANCELLED',
  'COMPLETED',
  'EXPIRED',
] as const;

/**
 * Journey Booking lifecycle status.
 */
export type JourneyBookingStatus =
  (typeof JOURNEY_BOOKING_STATUSES)[number];