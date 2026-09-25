// -----------------------------------------------------------------------------
// SisiMove — Refund Journey Booking Payment API
// -----------------------------------------------------------------------------
//
// Authenticated API adapter for refunding payment associated with a Journey
// Booking.
//
// Backend endpoint:
//
//   POST /api/v1/journey-bookings/:journeyBookingPublicId/payment/refund
//
// Backend authorization:
//   journey-booking:payment:refund
//
// The Journey Booking aggregate owns the booking-local payment state. Actual
// financial processing remains outside the Journey Booking domain.
//
// A full refund is distinct from a partial refund. This operation does not
// accept an amount because the backend refund command represents the complete
// refund transition. Partial refunds are handled by the dedicated partial
// refund API adapter.
//
// Architectural responsibilities:
//
// - Define the HTTP contract for full payment refund.
// - Require the authenticated API boundary.
// - Forward optional command metadata.
// - Return the updated booking representation.
//
// Non-responsibilities:
//
// - Processing the external financial transaction.
// - Determining whether a refund is permitted.
// - Calculating refund amounts.
// - Changing payment status locally.
// - Performing partial refunds.
// - Cancelling or completing the booking locally.
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
 * Request payload accepted by the full Journey Booking payment refund
 * endpoint.
 *
 * The backend refund DTO does not require a refund amount for a full refund.
 * Optional tracing metadata can be supplied by the calling workflow.
 */
export interface RefundJourneyBookingPaymentRequest {
  /**
   * Optional correlation identifier for distributed/application tracing.
   */
  correlationId?: string;

  /**
   * Optional causation identifier for distributed/application tracing.
   */
  causationId?: string;

  /**
   * Optional timestamp supplied by the payment workflow when the refund
   * occurred.
   *
   * When omitted, the backend/domain layer determines the effective refund
   * timestamp.
   */
  refundedAt?: string;
}

// -----------------------------------------------------------------------------
// API Response Contract
// -----------------------------------------------------------------------------

/**
 * Response returned after a full payment refund.
 *
 * The backend returns the updated JourneyBookingAggregate through the standard
 * JourneyBookingResponse mapper.
 */
export type RefundJourneyBookingPaymentResponse = JourneyBooking;

// -----------------------------------------------------------------------------
// API Function
// -----------------------------------------------------------------------------

/**
 * Refund the full payment associated with a Journey Booking.
 *
 * This operation represents a full refund. It must not be used to express a
 * partial refund; partial refunds have their own API operation.
 *
 * The frontend should use the returned booking as the authoritative payment
 * representation rather than mutating payment status locally.
 *
 * @param journeyBookingPublicId
 *   Public identifier of the Journey Booking.
 *
 * @param request
 *   Optional refund command metadata.
 *
 * @returns
 *   The updated Journey Booking.
 *
 * @throws
 *   TypeError when the booking public identifier is empty.
 *
 * @throws
 *   AuthenticationRequiredError when there is no authenticated session.
 *
 * @throws
 *   ApiError when the backend rejects the refund.
 */
export async function refundJourneyBookingPayment(
  journeyBookingPublicId: string,
  request: RefundJourneyBookingPaymentRequest = {},
): Promise<RefundJourneyBookingPaymentResponse> {
  const normalizedPublicId = journeyBookingPublicId.trim();

  if (!normalizedPublicId) {
    throw new TypeError(
      'A Journey Booking public identifier is required.',
    );
  }

  return authenticatedApiClient.post<RefundJourneyBookingPaymentResponse>(
    `/journey-bookings/${encodeURIComponent(normalizedPublicId)}/payment/refund`,
    {
      correlationId: request.correlationId,
      causationId: request.causationId,
      refundedAt: request.refundedAt,
    },
  );
}