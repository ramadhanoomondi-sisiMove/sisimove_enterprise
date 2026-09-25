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
//   journey-booking:read
//
// The backend derives the passenger identity from the authenticated request
// context. The frontend therefore does NOT send passengerPublicId for this
// user-facing operation.
//
// This is the preferred discovery operation for the authenticated
// "My Bookings" workflow.
//
// Architectural responsibilities:
//
// - Define the HTTP contract for the current user's booking collection.
// - Require the authenticated API boundary.
// - Return the backend collection response.
//
// Non-responsibilities:
//
// - Resolving the current identity.
// - Reading authentication storage directly.
// - Passenger identity selection.
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
 * Response returned by the authenticated "my bookings" endpoint.
 *
 * The backend returns JourneyBookingEntity[] mapped into the standard
 * JourneyBookingResponse representation.
 */
export type GetMyJourneyBookingsResponse = JourneyBooking[];

// -----------------------------------------------------------------------------
// API Function
// -----------------------------------------------------------------------------

/**
 * Retrieve Journey Bookings belonging to the currently authenticated
 * passenger.
 *
 * Passenger identity is derived by the backend from the authenticated
 * request. This prevents the user-facing "my bookings" operation from
 * accepting an arbitrary passenger identifier.
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