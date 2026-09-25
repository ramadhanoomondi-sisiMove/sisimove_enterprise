// -----------------------------------------------------------------------------
// SisiMove — Authorize Journey Booking Payment API
// -----------------------------------------------------------------------------
//
// Authenticated API adapter for authorizing payment associated with a Journey
// Booking.
//
// Backend endpoint:
//
//   POST /api/v1/journey-bookings/:journeyBookingPublicId/payment/authorize
//
// Backend authorization:
//   journey-booking:payment:authorize
//
// Payment processing remains outside the Journey Booking domain. This endpoint
// records/advances the payment state associated with the booking through the
// JourneyBookingAggregate.
//
// The frontend must not infer that authorization means capture, settlement,
// or successful completion of the Journey Booking.
//
// Architectural responsibilities:
//
// - Define the HTTP contract for payment authorization.
// - Require the authenticated API boundary.
// - Validate required primitive input.
// - Pass the transaction public identifier and command metadata to the
//   backend.
// - Return the updated booking representation.
//
// Non-responsibilities:
//
// - Processing the actual payment.
// - Selecting a payment provider.
// - Creating a financial transaction.
// - Determining whether authorization is permitted.
// - Changing payment status locally.
// - Completing or confirming the booking locally.
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
 * Request payload accepted by the Journey Booking payment authorization
 * endpoint.
 *
 * The transaction public identifier is an opaque reference to the external
 * Financial/Transaction domain.
 */
export interface AuthorizeJourneyBookingPaymentRequest {
  /**
   * Public identifier of the transaction associated with this payment.
   */
  transactionPublicId: string;

  /**
   * Optional correlation identifier for distributed/application tracing.
   */
  correlationId?: string;

  /**
   * Optional causation identifier for distributed/application tracing.
   */
  causationId?: string;

  /**
   * Optional timestamp supplied by the payment workflow when authorization
   * occurred.
   *
   * When omitted, the backend/domain layer determines the effective
   * authorization timestamp.
   */
  authorizedAt?: string;
}

// -----------------------------------------------------------------------------
// API Response Contract
// -----------------------------------------------------------------------------

/**
 * Response returned after payment authorization.
 *
 * The backend returns the updated JourneyBookingAggregate through the standard
 * JourneyBookingResponse mapper.
 */
export type AuthorizeJourneyBookingPaymentResponse =
  JourneyBooking;

// -----------------------------------------------------------------------------
// API Function
// -----------------------------------------------------------------------------

/**
 * Authorize payment associated with a Journey Booking.
 *
 * Authorization is a payment-state transition and does not imply that the
 * payment has been captured. Consumers should inspect the returned booking's
 * payment status rather than assuming a successful capture.
 *
 * @param journeyBookingPublicId
 *   Public identifier of the Journey Booking.
 *
 * @param request
 *   Payment authorization data.
 *
 * @returns
 *   The updated Journey Booking.
 *
 * @throws
 *   TypeError when the booking or transaction public identifier is empty.
 *
 * @throws
 *   AuthenticationRequiredError when there is no authenticated session.
 *
 * @throws
 *   ApiError when the backend rejects payment authorization.
 */
export async function authorizeJourneyBookingPayment(
  journeyBookingPublicId: string,
  request: AuthorizeJourneyBookingPaymentRequest,
): Promise<AuthorizeJourneyBookingPaymentResponse> {
  const normalizedBookingPublicId =
    journeyBookingPublicId.trim();

  const normalizedTransactionPublicId =
    request.transactionPublicId.trim();

  if (!normalizedBookingPublicId) {
    throw new TypeError(
      'A Journey Booking public identifier is required.',
    );
  }

  if (!normalizedTransactionPublicId) {
    throw new TypeError(
      'A transaction public identifier is required.',
    );
  }

  return authenticatedApiClient.post<AuthorizeJourneyBookingPaymentResponse>(
    `/journey-bookings/${encodeURIComponent(normalizedBookingPublicId)}/payment/authorize`,
    {
      transactionPublicId: normalizedTransactionPublicId,
      correlationId: request.correlationId,
      causationId: request.causationId,
      authorizedAt: request.authorizedAt,
    },
  );
}