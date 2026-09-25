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
// Confirmation is a backend aggregate operation. The frontend does not
// determine whether the booking has a valid snapshot, pricing, payment
// information, or an allowable lifecycle state.
//
// The backend JourneyBookingAggregate is authoritative for all confirmation
// invariants and lifecycle transitions.
//
// Architectural responsibilities:
//
// - Define the HTTP contract for booking confirmation.
// - Require the authenticated API boundary.
// - Pass the booking public identifier safely as a URL path segment.
// - Forward optional command-correlation metadata.
//
// Non-responsibilities:
//
// - Determining whether the booking can be confirmed.
// - Validating payment completeness.
// - Changing booking status locally.
// - Payment processing.
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
 * Optional metadata accepted by the confirmation HTTP DTO.
 *
 * The backend controller accepts ConfirmJourneyBookingDto. The exact command
 * metadata is kept optional because confirmation itself does not require
 * business input from the frontend.
 */
export interface ConfirmJourneyBookingRequest {
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
 * Response returned after booking confirmation.
 *
 * The backend returns the updated JourneyBookingAggregate through the standard
 * JourneyBookingResponse mapper.
 */
export type ConfirmJourneyBookingResponse = JourneyBooking;

// -----------------------------------------------------------------------------
// API Function
// -----------------------------------------------------------------------------

/**
 * Confirm a Journey Booking.
 *
 * Confirmation is a server-side state transition. The frontend should update
 * its cached representation from the returned booking rather than mutating
 * the booking status optimistically.
 *
 * @param journeyBookingPublicId
 *   Public identifier of the Journey Booking.
 *
 * @param request
 *   Optional confirmation command metadata.
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
 *   ApiError when the backend rejects the confirmation.
 */
export async function confirmJourneyBooking(
  journeyBookingPublicId: string,
  request: ConfirmJourneyBookingRequest = {},
): Promise<ConfirmJourneyBookingResponse> {
  const normalizedPublicId = journeyBookingPublicId.trim();

  if (!normalizedPublicId) {
    throw new TypeError(
      'A Journey Booking public identifier is required.',
    );
  }

  return authenticatedApiClient.post<ConfirmJourneyBookingResponse>(
    `/journey-bookings/${encodeURIComponent(normalizedPublicId)}/confirm`,
    {
      correlationId: request.correlationId,
      causationId: request.causationId,
    },
  );
}