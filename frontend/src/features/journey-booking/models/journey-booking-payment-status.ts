// -----------------------------------------------------------------------------
// Journey Booking Payment Status
// -----------------------------------------------------------------------------
//
// Frontend/application representation of the payment lifecycle state belonging
// to a Journey Booking.
//
// Payment processing itself remains outside the Journey Booking domain.
// The Journey Booking payment entity stores the payment state associated with
// the booking, while the Payment/Transaction domain performs actual payment
// processing.
//
// The frontend represents API values as string literals and does not import
// backend domain enums.
// -----------------------------------------------------------------------------

/**
 * Supported Journey Booking payment statuses.
 *
 * Lifecycle:
 *
 * PENDING
 *   ├── AUTHORIZED
 *   │     └── CAPTURED
 *   │           ├── PARTIALLY_REFUNDED
 *   │           └── REFUNDED
 *   └── FAILED
 *
 * Payment transitions are authoritative on the backend and must not be
 * simulated or inferred by the frontend.
 */
export const JOURNEY_BOOKING_PAYMENT_STATUSES = [
  'PENDING',
  'AUTHORIZED',
  'CAPTURED',
  'FAILED',
  'PARTIALLY_REFUNDED',
  'REFUNDED',
] as const;

/**
 * Journey Booking payment lifecycle status.
 */
export type JourneyBookingPaymentStatus =
  (typeof JOURNEY_BOOKING_PAYMENT_STATUSES)[number];