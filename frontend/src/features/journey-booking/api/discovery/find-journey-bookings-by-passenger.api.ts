// -----------------------------------------------------------------------------
// SisiMove — Find Journey Bookings by Passenger API
// -----------------------------------------------------------------------------
//
// Authenticated API adapter for retrieving Journey Bookings associated with
// a specific passenger.
//
// Backend endpoint:
//
//   GET /api/v1/journey-bookings/passenger/:passengerPublicId
//
// Backend authorization:
//   journey-booking:read
//
// The passenger identifier is an opaque Identity public identifier. The
// Journey Booking feature does not resolve or reconstruct the passenger's
// Identity, TravellerProfile, or TrustProfile.
//
// Architectural responsibilities:
//
// - Define the HTTP contract for this discovery operation.
// - Require the authenticated API boundary.
// - Pass the passenger public identifier as an opaque identifier.
// - Return the backend collection response.
//
// Non-responsibilities:
//
// - Authentication/session management.
// - Passenger identity resolution.
// - Traveller profile resolution.
// - Trust/profile composition.
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
 * Response returned by the Journey Booking passenger discovery endpoint.
 *
 * The backend maps each JourneyBookingEntity into the standard
 * JourneyBookingResponse representation.
 */
export type FindJourneyBookingsByPassengerResponse =
  JourneyBooking[];

// -----------------------------------------------------------------------------
// API Function
// -----------------------------------------------------------------------------

/**
 * Retrieve Journey Bookings associated with a passenger.
 *
 * The passenger public identifier is intentionally treated as an opaque
 * cross-domain identity reference.
 *
 * @param passengerPublicId
 *   Public identifier of the passenger whose bookings should be retrieved.
 *
 * @returns
 *   Journey Bookings associated with the specified passenger.
 *
 * @throws
 *   AuthenticationRequiredError when there is no authenticated session.
 *
 * @throws
 *   ApiError when the backend rejects the request.
 */
export async function findJourneyBookingsByPassenger(
  passengerPublicId: string,
): Promise<FindJourneyBookingsByPassengerResponse> {
  const normalizedPublicId = passengerPublicId.trim();

  if (!normalizedPublicId) {
    throw new TypeError(
      'A passenger public identifier is required.',
    );
  }

  return authenticatedApiClient.get<FindJourneyBookingsByPassengerResponse>(
    `/journey-bookings/passenger/${encodeURIComponent(normalizedPublicId)}`,
  );
}