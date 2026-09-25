// -----------------------------------------------------------------------------
// SisiMove — Find Journey Bookings by Journey and Passenger API
// -----------------------------------------------------------------------------
//
// Authenticated API adapter for retrieving Journey Bookings for a specific
// Journey and passenger combination.
//
// Backend endpoint:
//
//   GET /api/v1/journey-bookings/journey/:journeyPublicId/passenger/:passengerPublicId
//
// Backend authorization:
//   journey-booking:read
//
// Both identifiers are opaque public identifiers. The Journey Booking feature
// does not resolve either identifier into another domain aggregate.
//
// Architectural responsibilities:
//
// - Define the HTTP contract for this discovery operation.
// - Require the authenticated API boundary.
// - Validate that both required public identifiers are present.
// - Encode identifiers safely for use as URL path segments.
// - Return the backend collection response.
//
// Non-responsibilities:
//
// - Authentication/session management.
// - Identity/profile resolution.
// - Journey resolution.
// - Booking lifecycle behavior.
// - Payment processing.
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
 * Response returned by the Journey + passenger discovery endpoint.
 *
 * The backend returns JourneyBookingEntity[] mapped into the standard
 * JourneyBookingResponse representation.
 */
export type FindJourneyBookingsByJourneyAndPassengerResponse =
  JourneyBooking[];

// -----------------------------------------------------------------------------
// API Function
// -----------------------------------------------------------------------------

/**
 * Retrieve Journey Bookings for a specific Journey and passenger.
 *
 * @param journeyPublicId
 *   Public identifier of the Journey.
 *
 * @param passengerPublicId
 *   Public identifier of the passenger.
 *
 * @returns
 *   Journey Bookings matching both identifiers.
 *
 * @throws
 *   TypeError when either identifier is empty.
 *
 * @throws
 *   AuthenticationRequiredError when there is no authenticated session.
 *
 * @throws
 *   ApiError when the backend rejects the request.
 */
export async function findJourneyBookingsByJourneyAndPassenger(
  journeyPublicId: string,
  passengerPublicId: string,
): Promise<FindJourneyBookingsByJourneyAndPassengerResponse> {
  const normalizedJourneyPublicId = journeyPublicId.trim();
  const normalizedPassengerPublicId = passengerPublicId.trim();

  if (!normalizedJourneyPublicId) {
    throw new TypeError(
      'A Journey public identifier is required.',
    );
  }

  if (!normalizedPassengerPublicId) {
    throw new TypeError(
      'A passenger public identifier is required.',
    );
  }

  return authenticatedApiClient.get<FindJourneyBookingsByJourneyAndPassengerResponse>(
    `/journey-bookings/journey/${encodeURIComponent(normalizedJourneyPublicId)}/passenger/${encodeURIComponent(normalizedPassengerPublicId)}`,
  );
}