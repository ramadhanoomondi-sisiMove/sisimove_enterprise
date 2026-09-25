// -----------------------------------------------------------------------------
// SisiMove — Find Journey Bookings by Journey API
// -----------------------------------------------------------------------------
//
// Authenticated API adapter for retrieving all Journey Bookings associated
// with a specific Journey.
//
// Backend endpoint:
//
//   GET /api/v1/journey-bookings/journey/:journeyPublicId
//
// Backend authorization:
//   journey-booking:read
//
// The endpoint returns JourneyBookingEntity[] through the backend response
// mapper. The frontend receives the mapped HTTP representation and does not
// reproduce backend entities or aggregate behavior.
//
// Architectural responsibilities:
//
// - Define the HTTP contract for this discovery operation.
// - Require the authenticated API boundary.
// - Pass the Journey public identifier as an opaque cross-domain identifier.
// - Return the backend collection response.
//
// Non-responsibilities:
//
// - Authentication/session management.
// - Booking lifecycle behavior.
// - Journey availability calculations.
// - Payment processing.
// - React Query/cache management.
// - UI presentation.
// - Business-rule evaluation.
//
// -----------------------------------------------------------------------------


import { authenticatedApiClient } from '@/features/authentication/http';

import type { JourneyBooking } from '../../models/journey-booking';

// -----------------------------------------------------------------------------
// API Response Contract
// -----------------------------------------------------------------------------

/**
 * Response returned by the Journey Booking discovery endpoint.
 *
 * The backend maps every JourneyBookingEntity into the same
 * JourneyBookingResponse shape used by the single-booking endpoint.
 */
export type FindJourneyBookingsByJourneyResponse =
  JourneyBooking[];

// -----------------------------------------------------------------------------
// API Function
// -----------------------------------------------------------------------------

/**
 * Retrieve Journey Bookings associated with a Journey.
 *
 * The Journey public identifier is intentionally treated as an opaque
 * cross-domain reference. The Journey Booking feature does not load or
 * reconstruct the Journey aggregate as part of this request.
 *
 * @param journeyPublicId
 *   Public identifier of the Journey whose bookings should be retrieved.
 *
 * @returns
 *   Journey Bookings associated with the specified Journey.
 *
 * @throws
 *   AuthenticationRequiredError when there is no authenticated session.
 *
 * @throws
 *   ApiError when the backend rejects the request.
 */
export async function findJourneyBookingsByJourney(
  journeyPublicId: string,
): Promise<FindJourneyBookingsByJourneyResponse> {
  const normalizedPublicId = journeyPublicId.trim();

  if (!normalizedPublicId) {
    throw new TypeError(
      'A Journey public identifier is required.',
    );
  }

  return authenticatedApiClient.get<FindJourneyBookingsByJourneyResponse>(
    `/journey-bookings/journey/${encodeURIComponent(normalizedPublicId)}`,
  );
}