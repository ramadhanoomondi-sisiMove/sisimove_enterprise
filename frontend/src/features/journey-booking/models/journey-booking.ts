
 // -----------------------------------------------------------------------------
 // Journey Booking Model
 // -----------------------------------------------------------------------------
 //
 // Frontend/application representation of a Journey Booking aggregate.
 //
 // The backend JourneyBookingAggregate is the authoritative owner of booking
 // lifecycle behavior, invariants, and state transitions.
 //
 // This frontend model is intentionally a transport/application representation.
 // It does not reproduce the backend aggregate, domain methods, value objects,
 // or lifecycle logic.
 //
 // Cross-domain references such as journeyPublicId and passengerPublicId remain
 // opaque public identifiers.
 // -----------------------------------------------------------------------------

import type { JourneyBookingCancellation } from './journey-booking-cancellation';
import type { JourneyBookingPayment } from './journey-booking-payment';
import type { JourneyBookingPricing } from './journey-booking-pricing';
import type { JourneyBookingSnapshot } from './journey-booking-snapshot';
import type { JourneyBookingStatus } from './journey-booking-status';

// -----------------------------------------------------------------------------
// Activity Summary
// -----------------------------------------------------------------------------

/**
 * Backend-provided activity counts associated with a Journey Booking.
 *
 * Messaging and participant information belongs to the Journey context.
 * The frontend consumes these values and does not calculate them locally.
 */
export interface JourneyBookingActivitySummary {
  /**
   * Number of bookings associated with the same Journey.
   */
  associatedBookingsCount: number;

  /**
   * Number of participants associated with the Journey Boarding.
   */
  participantsCount: number;

  /**
   * Number of visible messages associated with the Journey.
   */
  messagesCount: number;

  /**
   * Number of unread incoming messages for the authenticated passenger.
   */
  unreadMessagesCount: number;
}

// -----------------------------------------------------------------------------
// Model
// -----------------------------------------------------------------------------

/**
 * Journey Booking application model.
 *
 * A booking represents a passenger's reservation against a Journey.
 *
 * The model contains the booking root state together with the booking-owned
 * snapshot, pricing, payment, and cancellation information returned by the
 * backend.
 */
export interface JourneyBooking {
  /**
   * Public identity of the Journey Booking.
   */
  publicId: string;

  /**
   * Public identity of the Journey being booked.
   *
   * This is an opaque cross-domain reference.
   */
  journeyPublicId: string;

  /**
   * Public identity of the passenger associated with the booking.
   *
   * This is an opaque cross-domain identity reference.
   */
  passengerPublicId: string;

  /**
   * Current booking lifecycle status.
   */
  status: JourneyBookingStatus;

  /**
   * Number of seats reserved by the booking.
   */
  seats: number;

  /**
   * Historical Journey information captured when the booking was created.
   */
  snapshot?: JourneyBookingSnapshot;

  /**
   * Historical pricing information captured for the booking.
   */
  pricing?: JourneyBookingPricing;

  /**
   * Payment state associated with the booking.
   */
  payment?: JourneyBookingPayment;

  /**
   * Cancellation information when the booking has been cancelled.
   */
  cancellation?: JourneyBookingCancellation;

  /**
   * Activity summary supplied by the backend for this booking's Journey.
   *
   * Null when the backend does not provide an activity summary.
   */
  activitySummary?: JourneyBookingActivitySummary | null;

  /**
   * Number of unread incoming messages associated with this Journey.
   *
   * Convenience accessor for UI consumers that need only the unread count.
   * When present, this should agree with activitySummary.unreadMessagesCount.
   */
  unreadMessagesCount?: number;

  /**
   * Timestamp at which the booking was confirmed.
   */
  confirmedAt?: string;

  /**
   * Timestamp at which the booking was cancelled.
   */
  cancelledAt?: string;

  /**
   * Timestamp at which the booking was completed.
   */
  completedAt?: string;

  /**
   * Timestamp at which the booking expired.
   */
  expiredAt?: string;

  /**
   * Backend aggregate version.
   *
   * This value is exposed for concurrency/version awareness. The frontend
   * does not increment or otherwise manage it.
   */
  version: number;

  /**
   * Booking creation timestamp.
   */
  createdAt: string;

  /**
   * Booking last modification timestamp.
   */
  updatedAt: string;
}
