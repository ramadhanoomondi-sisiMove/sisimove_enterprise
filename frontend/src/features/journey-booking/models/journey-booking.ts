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