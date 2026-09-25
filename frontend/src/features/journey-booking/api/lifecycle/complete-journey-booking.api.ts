// -----------------------------------------------------------------------------
// SisiMove — Complete Journey Booking API
// -----------------------------------------------------------------------------
//
// Authenticated API adapter for completing a Journey Booking.
//
// Backend endpoint:
//
//   POST /api/v1/journey-bookings/:journeyBookingPublicId/complete
//
// Backend authorization:
//   journey-booking:complete
//
// Completion is a backend JourneyBookingAggregate lifecycle transition. The
// frontend does not determine whether the booking is CONFIRMED or otherwise
// eligible for completion.
//
// The backend aggregate remains authoritative for all lifecycle invariants.
//
// Architectural responsibilities:
//
// - Define the HTTP contract for booking completion.
// - Require the authenticated API boundary.
// - Pass the booking public identifier safely as a URL path segment.
// - Return the updated booking representation.
//
// Non-responsibilities:
//
// - Determining whether completion is permitted.
// - Changing booking status locally.
// - Recalculating pricing.
// - Processing payment.
// - Managing financial settlement.
// - Authentication/session management.
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
 * Response returned after Journey Booking completion.
 *
 * The backend returns the updated JourneyBookingAggregate through the standard
 * JourneyBookingResponse mapper.
 */
export type CompleteJourneyBookingResponse = JourneyBooking;

// -----------------------------------------------------------------------------
// API Function
// -----------------------------------------------------------------------------

/**
 * Complete a Journey Booking.
 *
 * Completion is a server-side lifecycle transition. The frontend should use
 * the returned booking as the authoritative representation of the resulting
 * state rather than mutating the existing booking locally.
 *
 * @param journeyBookingPublicId
 *   Public identifier of the Journey Booking to complete.
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
 *   ApiError when the backend rejects the completion.
 */
export async function completeJourneyBooking(
  journeyBookingPublicId: string,
): Promise<CompleteJourneyBookingResponse> {
  const normalizedPublicId = journeyBookingPublicId.trim();

  if (!normalizedPublicId) {
    throw new TypeError(
      'A Journey Booking public identifier is required.',
    );
  }

  return authenticatedApiClient.post<CompleteJourneyBookingResponse>(
    `/journey-bookings/${encodeURIComponent(normalizedPublicId)}/complete`,
  );
}