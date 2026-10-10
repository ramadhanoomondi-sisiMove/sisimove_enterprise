// -----------------------------------------------------------------------------
// SisiMove — Confirm Journey Booking API
// -----------------------------------------------------------------------------
//
// Authenticated API adapter for confirming a Journey Booking.
//
// Backend endpoint:
//
//   POST /api/v1/journey-bookings/:journeyBookingPublicId/confirm
//
// Backend authorization:
//   journey-booking:confirm
//
// Confirmation is an atomic backend aggregate operation.
//
// The backend performs, inside one transaction:
//
//   1. Payment authorization.
//   2. Financial account hold.
//   3. Financial transaction creation.
//   4. Journey Booking payment authorization.
//   5. Journey Booking confirmation.
//   6. Journey capacity reservation.
//
// If any operation fails, the backend rolls the entire transaction back.
//
// The frontend does not determine whether the booking can be confirmed.
// The backend JourneyBookingAggregate and the financial/capacity domains
// remain authoritative for all business invariants.
//
// Architectural responsibilities:
//
// - Define the HTTP contract for atomic booking confirmation.
// - Require the authenticated API boundary.
// - Pass the booking public identifier safely as a URL path segment.
// - Pass the payment transaction public identifier required by the backend.
// - Forward optional command-correlation metadata.
//
// Non-responsibilities:
//
// - Determining whether the booking can be confirmed.
// - Validating payment completeness.
// - Changing booking status locally.
// - Performing payment authorization locally.
// - Creating financial holds locally.
// - Reserving journey capacity locally.
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
 * Input required by the atomic booking confirmation operation.
 *
 * The transaction public identifier comes from the Journey Booking payment
 * created earlier in the booking workflow.
 *
 * The frontend does not generate this identifier.
 */
export interface ConfirmJourneyBookingRequest {
  /**
   * Public identifier of the payment transaction associated with the
   * Journey Booking payment.
   *
   * This identifier is required because the backend atomic confirmation
   * operation authorizes that payment and creates the corresponding
   * financial hold inside the same transaction as booking confirmation.
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
}

// -----------------------------------------------------------------------------
// API Response Contract
// -----------------------------------------------------------------------------

/**
 * Response returned after atomic booking confirmation.
 *
 * The backend returns the updated JourneyBookingAggregate through the standard
 * JourneyBookingResponse mapper.
 */
export type ConfirmJourneyBookingResponse = JourneyBooking;

// -----------------------------------------------------------------------------
// API Function
// -----------------------------------------------------------------------------

/**
 * Confirm a Journey Booking atomically with payment authorization.
 *
 * The backend performs payment authorization, financial hold creation,
 * booking confirmation, and journey capacity reservation inside one
 * transaction.
 *
 * The frontend should update its cached representation from the returned
 * booking rather than mutating the booking status optimistically.
 *
 * @param journeyBookingPublicId
 *   Public identifier of the Journey Booking.
 *
 * @param request
 *   Payment transaction identifier and optional confirmation metadata.
 *
 * @returns
 *   The updated Journey Booking.
 *
 * @throws
 *   TypeError when the booking public identifier is empty.
 *
 * @throws
 *   TypeError when the payment transaction public identifier is empty.
 *
 * @throws
 *   AuthenticationRequiredError when there is no authenticated session.
 *
 * @throws
 *   ApiError when the backend rejects the atomic confirmation.
 */
export async function confirmJourneyBooking(
  journeyBookingPublicId: string,
  request: ConfirmJourneyBookingRequest,
): Promise<ConfirmJourneyBookingResponse> {
  const normalizedPublicId = journeyBookingPublicId.trim();

  if (!normalizedPublicId) {
    throw new TypeError(
      'A Journey Booking public identifier is required.',
    );
  }

  const normalizedTransactionPublicId =
    request.transactionPublicId.trim();

  if (!normalizedTransactionPublicId) {
    throw new TypeError(
      'A payment transaction public identifier is required.',
    );
  }

  return authenticatedApiClient.post<ConfirmJourneyBookingResponse>(
    `/journey-bookings/${encodeURIComponent(normalizedPublicId)}/confirm`,
    {
      transactionPublicId: normalizedTransactionPublicId,
      correlationId: request.correlationId,
      causationId: request.causationId,
    },
  );
}
