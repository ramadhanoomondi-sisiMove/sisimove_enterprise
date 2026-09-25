// -----------------------------------------------------------------------------
// Journey Booking Cancellation Model
// -----------------------------------------------------------------------------
//
// Frontend representation of the cancellation information associated with a
// Journey Booking.
//
// Cancellation is booking-owned historical information. The backend
// JourneyBooking aggregate remains authoritative for determining whether a
// booking can be cancelled and for applying the cancellation transition.
// -----------------------------------------------------------------------------

import type { JourneyBookingCancellationReason } from './journey-booking-cancellation-reason';

// -----------------------------------------------------------------------------
// Model
// -----------------------------------------------------------------------------

/**
 * Cancellation information associated with a Journey Booking.
 */
export interface JourneyBookingCancellation {
  /**
   * Public identity of the cancellation entity.
   */
  publicId: string;

  /**
   * Reason the booking was cancelled.
   */
  reason: JourneyBookingCancellationReason;

  /**
   * Public identity of the person or system that initiated the cancellation.
   *
   * This is an opaque cross-domain identity reference.
   *
   * It may be absent when the cancellation was recorded without an explicit
   * actor.
   */
  cancelledByPublicId?: string;

  /**
   * Additional explanation supplied for the cancellation.
   *
   * The backend requires a description when the reason is OTHER.
   */
  reasonDescription?: string;

  /**
   * Timestamp at which the booking was cancelled.
   */
  cancelledAt: string;

  /**
   * Cancellation entity creation timestamp.
   */
  createdAt: string;

  /**
   * Cancellation entity last modification timestamp.
   */
  updatedAt: string;
}