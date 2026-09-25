// -----------------------------------------------------------------------------
// SisiMove — Capture Journey Booking Payment API
// -----------------------------------------------------------------------------
//
// Authenticated API adapter for capturing payment associated with a Journey
// Booking.
//
// Backend endpoint:
//
//   POST /api/v1/journey-bookings/:journeyBookingPublicId/payment/capture
//
// Backend authorization:
//   journey-booking:payment:capture
//
// Payment processing remains outside the Journey Booking domain. This endpoint
// advances the booking-owned payment state through the JourneyBookingAggregate.
//
// The frontend must not infer that a successful capture also means that the
// Journey Booking itself is confirmed or completed. Booking and payment
// lifecycles remain distinct server-authoritative states.
//
// Architectural responsibilities:
//
// - Define the HTTP contract for payment capture.
// - Require the authenticated API boundary.
// - Forward optional command metadata.
// - Return the updated booking representation.
//
// Non-responsibilities:
//
// - Processing the external payment.
// - Determining whether capture is permitted.
// - Changing payment state locally.
// - Confirming or completing the booking locally.
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
 * Request payload accepted by the Journey Booking payment capture endpoint.
 *
 * Capture itself does not require business data from the frontend. Correlation
 * and causation identifiers remain optional tracing metadata.
 */
export interface CaptureJourneyBookingPaymentRequest {
  /**
   * Optional correlation identifier for distributed/application tracing.
   */
  correlationId?: string;

  /**
   * Optional causation identifier for distributed/application tracing.
   */
  causationId?: string;

  /**
   * Optional timestamp supplied by the payment workflow when capture occurred.
   *
   * When omitted, the backend/domain layer determines the effective capture
   * timestamp.
   */
  capturedAt?: string;
}

// -----------------------------------------------------------------------------
// API Response Contract
// -----------------------------------------------------------------------------

/**
 * Response returned after payment capture.
 *
 * The backend returns the updated JourneyBookingAggregate through the standard
 * JourneyBookingResponse mapper.
 */
export type CaptureJourneyBookingPaymentResponse =
  JourneyBooking;

// -----------------------------------------------------------------------------
// API Function
// -----------------------------------------------------------------------------

/**
 * Capture payment associated with a Journey Booking.
 *
 * Capture is distinct from authorization. Consumers should inspect the
 * returned booking's payment state rather than inferring the resulting state
 * locally.
 *
 * @param journeyBookingPublicId
 *   Public identifier of the Journey Booking.
 *
 * @param request
 *   Optional payment capture metadata.
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
 *   ApiError when the backend rejects payment capture.
 */
export async function captureJourneyBookingPayment(
  journeyBookingPublicId: string,
  request: CaptureJourneyBookingPaymentRequest = {},
): Promise<CaptureJourneyBookingPaymentResponse> {
  const normalizedPublicId = journeyBookingPublicId.trim();

  if (!normalizedPublicId) {
    throw new TypeError(
      'A Journey Booking public identifier is required.',
    );
  }

  return authenticatedApiClient.post<CaptureJourneyBookingPaymentResponse>(
    `/journey-bookings/${encodeURIComponent(normalizedPublicId)}/payment/capture`,
    {
      correlationId: request.correlationId,
      causationId: request.causationId,
      capturedAt: request.capturedAt,
    },
  );
}