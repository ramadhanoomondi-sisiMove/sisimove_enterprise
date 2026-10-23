
/**
 * sisiMove — Admin Booking Enums
 *
 * Frontend enum contracts for the admin bookings feature.
 *
 * Values are aligned with the Prisma schema.
 * These enums describe persisted domain values; they do not
 * authorize lifecycle transitions or replace backend validation.
 */

// -----------------------------------------------------------------------------
// Booking lifecycle
// -----------------------------------------------------------------------------

export enum AdminBookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED',
}

// -----------------------------------------------------------------------------
// Booking payment
// -----------------------------------------------------------------------------

export enum AdminBookingPaymentStatus {
  PENDING = 'PENDING',
  AUTHORIZED = 'AUTHORIZED',
  CAPTURED = 'CAPTURED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
}

// -----------------------------------------------------------------------------
// Booking cancellation reasons
// -----------------------------------------------------------------------------

export enum AdminBookingCancellationReason {
  PASSENGER_REQUEST = 'PASSENGER_REQUEST',
  PROVIDER_REQUEST = 'PROVIDER_REQUEST',
  JOURNEY_CANCELLED = 'JOURNEY_CANCELLED',
  NO_SHOW = 'NO_SHOW',
  SYSTEM = 'SYSTEM',
  OTHER = 'OTHER',
}

// -----------------------------------------------------------------------------
// Display and filtering types
// -----------------------------------------------------------------------------

/**
 * Shared visual tone for booking status badges.
 * This is a frontend presentation type, not a Prisma enum.
 */
export type AdminBookingStatusTone =
  | 'neutral'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger';

/**
 * Supported booking directory sort directions.
 */
export type AdminBookingSortDirection = 'asc' | 'desc';

/**
 * Booking directory sort fields.
 *
 * These are frontend sort identifiers. The API adapter must map them
 * to backend-supported query parameters before requesting server sorting.
 */
export type AdminBookingSortField =
  | 'createdAt'
  | 'updatedAt'
  | 'departureAt'
  | 'totalAmount';
