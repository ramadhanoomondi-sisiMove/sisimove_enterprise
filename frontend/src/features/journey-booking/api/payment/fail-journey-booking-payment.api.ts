// -----------------------------------------------------------------------------
// SisiMove — Fail Journey Booking Payment API
// -----------------------------------------------------------------------------
//
// Authenticated API adapter for recording a failed payment associated with a
// Journey Booking.
//
// Backend endpoint:
//
//   POST /api/v1/journey-bookings/:journeyBookingPublicId/payment/fail
//
// Backend authorization:
//   journey-booking:payment:fail
//
// The Journey Booking aggregate owns the booking-local payment state, while
// the external payment/transaction system remains responsible for actual
// payment processing.
//
// The frontend must not infer payment failure locally or alter the booking
// lifecycle as a consequence of this operation.
//
// Architectural responsibilities:
//
// - Define the HTTP contract for payment failure.
// - Require the authenticated API boundary.
// - Validate the required failure reason.
// - Forward optional tracing and timestamp metadata.
// - Return the updated booking representation.
//
// Non-responsibilities:
//
// - Processing the external payment.
// - Determining whether failure is a valid payment transition.
// - Changing payment status locally.
// - Cancelling or expiring the booking locally.
// - Authentication/session management.
// - React Query/cache management.
// - UI presentation.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type { JourneyBooking } from '../../models/journey-booking';

// -----------------------------------------------------------------------------
// Request Contract
// -----------------------------------------------------------------------------

/**
 * Request payload accepted by the Journey Booking payment failure endpoint.
 */
export interface FailJourneyBookingPaymentRequest {
  /**
   * Domain/application reason describing why the payment failed.
   */
  failureReason: string;

  /**
   * Optional correlation identifier for distributed/application tracing.
   */
  correlationId?: string;

  /**
   * Optional causation identifier for distributed/application tracing.
   */
  causationId?: string;

  /**
   * Optional timestamp supplied by the payment workflow when failure occurred.
   *
   * When omitted, the backend/domain layer determines the effective failure
   * timestamp.
   */
  failedAt?: string;
}

// -----------------------------------------------------------------------------
// API Response Contract
// -----------------------------------------------------------------------------

/**
 * Response returned after recording payment failure.
 *
 * The backend returns the updated JourneyBookingAggregate through the standard
 * JourneyBookingResponse mapper.
 */
export type FailJourneyBookingPaymentResponse = JourneyBooking;

// -----------------------------------------------------------------------------
// API Function
// -----------------------------------------------------------------------------

/**
 * Record a failed payment for a Journey Booking.
 *
 * Payment failure does not itself define the booking's lifecycle transition.
 * Consumers should inspect the returned booking and payment state rather than
 * making a local lifecycle decision.
 *
 * @param journeyBookingPublicId
 *   Public identifier of the Journey Booking.
 *
 * @param request
 *   Payment failure information.
 *
 * @returns
 *   The updated Journey Booking.
 *
 * @throws
 *   TypeError when the booking public identifier or failure reason is empty.
 *
 * @throws
 *   AuthenticationRequiredError when there is no authenticated session.
 *
 * @throws
 *   ApiError when the backend rejects the payment failure operation.
 */
export async function failJourneyBookingPayment(
  journeyBookingPublicId: string,
  request: FailJourneyBookingPaymentRequest,
): Promise<FailJourneyBookingPaymentResponse> {
  const normalizedPublicId = journeyBookingPublicId.trim();
  const normalizedFailureReason =
    request.failureReason.trim();

  if (!normalizedPublicId) {
    throw new TypeError(
      'A Journey Booking public identifier is required.',
    );
  }

  if (!normalizedFailureReason) {
    throw new TypeError(
      'A payment failure reason is required.',
    );
  }

  return authenticatedApiClient.post<FailJourneyBookingPaymentResponse>(
    `/journey-bookings/${encodeURIComponent(normalizedPublicId)}/payment/fail`,
    {
      failureReason: normalizedFailureReason,
      correlationId: request.correlationId,
      causationId: request.causationId,
      failedAt: request.failedAt,
    },
  );
}