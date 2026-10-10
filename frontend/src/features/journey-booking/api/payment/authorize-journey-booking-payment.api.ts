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
//   booking:manage
//
// Payment processing remains outside the Journey Booking domain. The backend
// authorizes the payment by coordinating the JourneyBooking aggregate with the
// Financial domain.
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
// - Creating the financial transaction locally.
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
 * The transaction public identifier is an opaque reference supplied by the
 * payment workflow.
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
 * The backend returns the updated Journey Booking representation through the
 * standard JourneyBookingResponse mapper.
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
 * payment has been captured or settled.
 *
 * Consumers should inspect the returned booking payment state rather than
 * assuming that authorization means successful capture or completion.
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
  // ---------------------------------------------------------------------------
  // Normalize required identifiers
  // ---------------------------------------------------------------------------

  const normalizedBookingPublicId =
    journeyBookingPublicId.trim();

  const normalizedTransactionPublicId =
    request.transactionPublicId.trim();

  // ---------------------------------------------------------------------------
  // Validate required identifiers
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Normalize optional command metadata
  // ---------------------------------------------------------------------------

  const normalizedCorrelationId =
    request.correlationId?.trim() || undefined;

  const normalizedCausationId =
    request.causationId?.trim() || undefined;

  const normalizedAuthorizedAt =
    request.authorizedAt?.trim() || undefined;

  // ---------------------------------------------------------------------------
  // Authorize payment
  // ---------------------------------------------------------------------------

  return authenticatedApiClient.post<AuthorizeJourneyBookingPaymentResponse>(
    `/journey-bookings/${encodeURIComponent(normalizedBookingPublicId)}/payment/authorize`,
    {
      transactionPublicId: normalizedTransactionPublicId,
      correlationId: normalizedCorrelationId,
      causationId: normalizedCausationId,
      authorizedAt: normalizedAuthorizedAt,
    },
  );
}