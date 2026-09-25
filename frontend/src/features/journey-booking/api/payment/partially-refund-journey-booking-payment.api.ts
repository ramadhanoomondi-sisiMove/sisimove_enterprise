// -----------------------------------------------------------------------------
// SisiMove — Partially Refund Journey Booking Payment API
// -----------------------------------------------------------------------------
//
// Authenticated API adapter for recording a partial refund associated with a
// Journey Booking.
//
// Backend endpoint:
//
//   POST /api/v1/journey-bookings/:journeyBookingPublicId/payment/refund/partial
//
// Backend authorization:
//   journey-booking:payment:refund
//
// The Journey Booking aggregate owns the booking-local payment state. Actual
// financial processing remains outside the Journey Booking domain.
//
// The backend operation receives both the amount refunded and the remaining
// amount. The frontend therefore forwards these values as integer monetary
// amounts without performing financial calculations locally.
//
// Architectural responsibilities:
//
// - Define the HTTP contract for partial payment refund.
// - Require the authenticated API boundary.
// - Validate required primitive monetary input.
// - Forward tracing metadata.
// - Return the updated booking representation.
//
// Non-responsibilities:
//
// - Processing the external financial transaction.
// - Calculating refund amounts from pricing.
// - Determining whether a refund is permitted.
// - Changing payment status locally.
// - Performing a full refund.
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
 * Request payload accepted by the Journey Booking partial refund endpoint.
 *
 * Monetary values are integer amounts in the smallest currency unit.
 *
 * `remainingAmount` is explicitly supplied because it is part of the current
 * backend HTTP contract. The backend remains authoritative for validating the
 * relationship between refunded and remaining amounts.
 */
export interface PartiallyRefundJourneyBookingPaymentRequest {
  /**
   * Amount refunded to the payer.
   */
  refundedAmount: number;

  /**
   * Payment amount remaining after the partial refund.
   */
  remainingAmount: number;

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
   */
  refundedAt?: string;
}

// -----------------------------------------------------------------------------
// API Response Contract
// -----------------------------------------------------------------------------

/**
 * Response returned after a partial payment refund.
 *
 * The backend returns the updated JourneyBookingAggregate through the standard
 * JourneyBookingResponse mapper.
 */
export type PartiallyRefundJourneyBookingPaymentResponse =
  JourneyBooking;

// -----------------------------------------------------------------------------
// API Function
// -----------------------------------------------------------------------------

/**
 * Record a partial refund for a Journey Booking payment.
 *
 * The frontend validates only the basic primitive shape. It deliberately does
 * not calculate or enforce the relationship between `refundedAmount`,
 * `remainingAmount`, and the original payment amount. Those are domain
 * invariants owned by the backend.
 *
 * @param journeyBookingPublicId
 *   Public identifier of the Journey Booking.
 *
 * @param request
 *   Partial refund information.
 *
 * @returns
 *   The updated Journey Booking.
 *
 * @throws
 *   TypeError when the booking identifier is empty or monetary values are
 *   invalid.
 *
 * @throws
 *   AuthenticationRequiredError when there is no authenticated session.
 *
 * @throws
 *   ApiError when the backend rejects the refund.
 */
export async function partiallyRefundJourneyBookingPayment(
  journeyBookingPublicId: string,
  request: PartiallyRefundJourneyBookingPaymentRequest,
): Promise<PartiallyRefundJourneyBookingPaymentResponse> {
  const normalizedPublicId = journeyBookingPublicId.trim();

  if (!normalizedPublicId) {
    throw new TypeError(
      'A Journey Booking public identifier is required.',
    );
  }

  if (
    !Number.isInteger(request.refundedAmount) ||
    request.refundedAmount < 0
  ) {
    throw new TypeError(
      'The refunded amount must be a non-negative integer.',
    );
  }

  if (
    !Number.isInteger(request.remainingAmount) ||
    request.remainingAmount < 0
  ) {
    throw new TypeError(
      'The remaining amount must be a non-negative integer.',
    );
  }

  return authenticatedApiClient.post<PartiallyRefundJourneyBookingPaymentResponse>(
    `/journey-bookings/${encodeURIComponent(normalizedPublicId)}/payment/refund/partial`,
    {
      refundedAmount: request.refundedAmount,
      remainingAmount: request.remainingAmount,
      correlationId: request.correlationId,
      causationId: request.causationId,
      refundedAt: request.refundedAt,
    },
  );
}