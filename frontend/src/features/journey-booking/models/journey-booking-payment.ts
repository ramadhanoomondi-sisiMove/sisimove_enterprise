// -----------------------------------------------------------------------------
// Journey Booking Payment Model
// -----------------------------------------------------------------------------
//
// Frontend representation of the payment state associated with a Journey
// Booking.
//
// The Journey Booking owns the payment state snapshot/reference, while actual
// payment processing remains outside the Journey Booking domain.
//
// The frontend must treat payment status as server-authoritative and must not
// perform payment lifecycle transitions locally.
// -----------------------------------------------------------------------------

import type { JourneyBookingPaymentStatus } from './journey-booking-payment-status';

// -----------------------------------------------------------------------------
// Model
// -----------------------------------------------------------------------------

/**
 * Payment state associated with a Journey Booking.
 */
export interface JourneyBookingPayment {
  /**
   * Public identity of the booking payment entity.
   */
  publicId: string;

  /**
   * Current payment lifecycle status.
   */
  status: JourneyBookingPaymentStatus;

  /**
   * Amount associated with the payment.
   *
   * Represented in the smallest currency unit.
   */
  amount: number;

  /**
   * Currency of the payment.
   *
   * ISO 4217 currency code.
   */
  currency: string;

  /**
   * Public identity of the corresponding transaction in the
   * Payment/Transaction domain.
   *
   * This is an opaque cross-domain reference.
   */
  transactionPublicId?: string;

  /**
   * Timestamp at which the payment was authorized.
   */
  authorizedAt?: string;

  /**
   * Timestamp at which the payment was captured.
   */
  capturedAt?: string;

  /**
   * Timestamp at which the payment failed.
   */
  failedAt?: string;

  /**
   * Timestamp at which the payment was refunded.
   */
  refundedAt?: string;

  /**
   * Machine-readable or domain-defined failure reason.
   *
   * The frontend should display this through an appropriate presentation
   * mapping rather than assuming a particular human-readable message.
   */
  failureReason?: string;

  /**
   * Payment entity creation timestamp.
   */
  createdAt: string;

  /**
   * Payment entity last modification timestamp.
   */
  updatedAt: string;
}