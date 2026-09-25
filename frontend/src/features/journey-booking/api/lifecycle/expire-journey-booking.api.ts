// -----------------------------------------------------------------------------
// SisiMove — Expire Journey Booking API
// -----------------------------------------------------------------------------
//
// Authenticated API adapter for expiring a Journey Booking.
//
// Backend endpoint:
//
//   POST /api/v1/journey-bookings/:journeyBookingPublicId/expire
//
// Backend authorization:
//   journey-booking:expire
//
// Expiration is a backend JourneyBookingAggregate lifecycle transition. The
// frontend does not determine whether the booking is pending or otherwise
// eligible for expiration.
//
// The backend aggregate remains authoritative for all expiration invariants
// and lifecycle transitions.
//
// Architectural responsibilities:
//
// - Define the HTTP contract for booking expiration.
// - Require the authenticated API boundary.
// - Pass the booking public identifier safely as a URL path segment.
// - Return the updated booking representation.
//
// Non-responsibilities:
//
// - Determining whether expiration is permitted.
// - Determining expiration timing.
// - Changing booking status locally.
// - Processing payment or refunds.
// - Managing authentication/session state.
// - React Query/cache management.
// - UI presentation.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type { JourneyBooking } from '../../models/journey-booking';

// -----------------------------------------------------------------------------
// API Response Contract
// -----------------------------------------------------------------------------

/**
 * Response returned after Journey Booking expiration.
 *
 * The backend returns the updated JourneyBookingAggregate through the standard
 * JourneyBookingResponse mapper.
 */
export type ExpireJourneyBookingResponse = JourneyBooking;

// -----------------------------------------------------------------------------
// API Function
// -----------------------------------------------------------------------------

/**
 * Expire a Journey Booking.
 *
 * Expiration is a server-side lifecycle transition. The frontend should use
 * the returned booking as the authoritative representation of the resulting
 * state rather than mutating the existing booking locally.
 *
 * @param journeyBookingPublicId
 *   Public identifier of the Journey Booking to expire.
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
 *   ApiError when the backend rejects the expiration.
 */
export async function expireJourneyBooking(
  journeyBookingPublicId: string,
): Promise<ExpireJourneyBookingResponse> {
  const normalizedPublicId = journeyBookingPublicId.trim();

  if (!normalizedPublicId) {
    throw new TypeError(
      'A Journey Booking public identifier is required.',
    );
  }

  return authenticatedApiClient.post<ExpireJourneyBookingResponse>(
    `/journey-bookings/${encodeURIComponent(normalizedPublicId)}/expire`,
  );
}