// -----------------------------------------------------------------------------
// SisiMove — Cancel Journey Booking API
// -----------------------------------------------------------------------------
//
// Authenticated API adapter for cancelling a Journey Booking.
//
// Backend endpoint:
//
//   POST /api/v1/journey-bookings/:journeyBookingPublicId/cancel
//
// Backend authorization:
//   journey-booking:cancel
//
// The backend JourneyBookingAggregate remains authoritative for determining
// whether the booking can be cancelled and for applying the cancellation
// transition.
//
// Architectural responsibilities:
//
// - Define the HTTP contract for booking cancellation.
// - Require the authenticated API boundary.
// - Validate required primitive input.
// - Pass the cancellation data to the backend.
// - Return the updated booking representation.
//
// Non-responsibilities:
//
// - Determining whether cancellation is permitted.
// - Applying cancellation lifecycle rules.
// - Creating cancellation domain entities.
// - Calculating refunds.
// - Managing payment state.
// - Authentication/session management.
// - React Query/cache management.
// - UI presentation.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type {
  JourneyBooking,
  JourneyBookingCancellationReason,
} from '../../models';

// -----------------------------------------------------------------------------
// Request Contract
// -----------------------------------------------------------------------------

/**
 * Request payload accepted by the Journey Booking cancellation endpoint.
 *
 * The backend controller constructs the cancellation reason value object,
 * cancelledBy public identifier, optional reason description, causation
 * identifier, and optional cancellation timestamp from this DTO.
 */
export interface CancelJourneyBookingRequest {
  /**
   * Reason for cancelling the Journey Booking.
   */
  reason: JourneyBookingCancellationReason;

  /**
   * Public identifier of the person or system responsible for the
   * cancellation.
   *
   * This is an opaque identity reference.
   */
  cancelledByPublicId?: string;

  /**
   * Additional explanation for the cancellation.
   *
   * The backend requires a description when the reason is OTHER.
   */
  reasonDescription?: string;

  /**
   * Optional causation identifier for distributed/application tracing.
   */
  causationId?: string;

  /**
   * Optional explicit cancellation timestamp.
   *
   * When omitted, the backend/domain layer determines the effective
   * cancellation timestamp.
   */
  cancelledAt?: string;
}

// -----------------------------------------------------------------------------
// API Response Contract
// -----------------------------------------------------------------------------

/**
 * Response returned after cancellation.
 *
 * The backend returns the updated JourneyBookingAggregate through the standard
 * JourneyBookingResponse mapper.
 */
export type CancelJourneyBookingResponse = JourneyBooking;

// -----------------------------------------------------------------------------
// API Function
// -----------------------------------------------------------------------------

/**
 * Cancel a Journey Booking.
 *
 * Cancellation is a server-side lifecycle transition. The frontend must not
 * change the booking status locally or assume that a cancellation implies a
 * particular payment/refund result.
 *
 * @param journeyBookingPublicId
 *   Public identifier of the Journey Booking.
 *
 * @param request
 *   Cancellation information supplied to the backend.
 *
 * @returns
 *   The updated Journey Booking.
 *
 * @throws
 *   TypeError when the booking identifier or cancellation reason is empty.
 *
 * @throws
 *   AuthenticationRequiredError when there is no authenticated session.
 *
 * @throws
 *   ApiError when the backend rejects the cancellation.
 */
export async function cancelJourneyBooking(
  journeyBookingPublicId: string,
  request: CancelJourneyBookingRequest,
): Promise<CancelJourneyBookingResponse> {
  const normalizedPublicId = journeyBookingPublicId.trim();
  const normalizedReason = request.reason.trim();

  if (!normalizedPublicId) {
    throw new TypeError(
      'A Journey Booking public identifier is required.',
    );
  }

  if (!normalizedReason) {
    throw new TypeError(
      'A Journey Booking cancellation reason is required.',
    );
  }

  const normalizedCancelledByPublicId =
    request.cancelledByPublicId?.trim();

  const normalizedReasonDescription =
    request.reasonDescription?.trim();

  return authenticatedApiClient.post<CancelJourneyBookingResponse>(
    `/journey-bookings/${encodeURIComponent(normalizedPublicId)}/cancel`,
    {
      reason: normalizedReason,
      cancelledByPublicId:
        normalizedCancelledByPublicId || undefined,
      reasonDescription:
        normalizedReasonDescription || undefined,
      causationId: request.causationId,
      cancelledAt: request.cancelledAt,
    },
  );
}