// -----------------------------------------------------------------------------
// Journey Booking Cancellation Reason
// -----------------------------------------------------------------------------
//
// Frontend/application representation of the reason a Journey Booking was
// cancelled.
//
// The cancellation reason is descriptive booking data. The backend
// JourneyBooking aggregate remains authoritative for cancellation rules,
// lifecycle transitions, and whether a particular reason is valid.
// -----------------------------------------------------------------------------

/**
 * Supported Journey Booking cancellation reasons.
 *
 * Passenger-initiated:
 *   PASSENGER_REQUEST
 *
 * Provider-initiated:
 *   PROVIDER_REQUEST
 *
 * Journey/system circumstances:
 *   JOURNEY_CANCELLED
 *   NO_SHOW
 *   SYSTEM
 *
 * Other:
 *   OTHER
 */
export const JOURNEY_BOOKING_CANCELLATION_REASONS = [
  'PASSENGER_REQUEST',
  'PROVIDER_REQUEST',
  'JOURNEY_CANCELLED',
  'NO_SHOW',
  'SYSTEM',
  'OTHER',
] as const;

/**
 * Journey Booking cancellation reason.
 */
export type JourneyBookingCancellationReason =
  (typeof JOURNEY_BOOKING_CANCELLATION_REASONS)[number];