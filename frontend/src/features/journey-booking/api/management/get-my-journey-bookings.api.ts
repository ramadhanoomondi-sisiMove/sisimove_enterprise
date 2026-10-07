// src/features/journey-booking/api/management/get-my-journey-bookings.api.ts

// -----------------------------------------------------------------------------
// SisiMove — Get My Journey Bookings API
// -----------------------------------------------------------------------------
//
// Authenticated API adapter for retrieving the bookings belonging to the
// currently authenticated passenger.
//
// Backend endpoint:
//
//   GET /api/v1/journey-bookings/mine
//
// Backend authorization:
//
//   journey-booking:read
//
// The backend derives the passenger identity from the authenticated request
// context. The frontend therefore does NOT send passengerPublicId.
//
// This is the collection/discovery operation for the authenticated
// "My Bookings" workflow.
//
// Detailed booking information is provided separately by:
//
//   GET /api/v1/journey-bookings/mine/detail
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type { JourneyBooking } from '../../models/journey-booking';

// -----------------------------------------------------------------------------
// API Response Contract
// -----------------------------------------------------------------------------

/**
 * Response returned by the authenticated "my bookings" collection endpoint.
 *
 * The backend returns the current passenger's Journey Booking collection
 * using the standard JourneyBooking response representation.
 */
export type GetMyJourneyBookingsResponse = readonly JourneyBooking[];

// -----------------------------------------------------------------------------
// API Function
// -----------------------------------------------------------------------------

/**
 * Retrieve Journey Bookings belonging to the currently authenticated
 * passenger.
 *
 * Passenger identity is derived by the backend from the authenticated
 * request.
 *
 * No passenger public identifier is accepted by this user-facing operation.
 *
 * @returns
 *   Journey Bookings associated with the authenticated passenger.
 *
 * @throws
 *   AuthenticationRequiredError when there is no authenticated session.
 *
 * @throws
 *   ApiError when the backend rejects the request.
 */
export async function getMyJourneyBookings(): Promise<
  GetMyJourneyBookingsResponse
> {
  return authenticatedApiClient.get<GetMyJourneyBookingsResponse>(
    '/journey-bookings/mine',
  );
}