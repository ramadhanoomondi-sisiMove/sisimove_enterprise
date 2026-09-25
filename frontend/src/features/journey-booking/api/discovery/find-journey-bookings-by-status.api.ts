// -----------------------------------------------------------------------------
// SisiMove — Find Journey Bookings by Status API
// -----------------------------------------------------------------------------
//
// Authenticated API adapter for retrieving Journey Bookings filtered by their
// lifecycle status.
//
// Backend endpoint:
//
//   GET /api/v1/journey-bookings/status/:status
//
// Backend authorization:
//   journey-booking:read
//
// The status is constrained to the frontend's known Journey Booking lifecycle
// values before being sent to the backend. The backend remains authoritative
// for validating the requested status and applying any domain rules.
//
// Architectural responsibilities:
//
// - Define the HTTP contract for status-based discovery.
// - Require the authenticated API boundary.
// - Constrain the status parameter to the feature's known status model.
// - Return the backend collection response.
//
// Non-responsibilities:
//
// - Booking lifecycle transitions.
// - Local status inference.
// - Authentication/session management.
// - React Query/cache management.
// - UI presentation.
// - Payment processing.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type {
  JourneyBooking,
  JourneyBookingStatus,
} from '../../models';

// -----------------------------------------------------------------------------
// API Response Contract
// -----------------------------------------------------------------------------

/**
 * Response returned by the Journey Booking status discovery endpoint.
 *
 * The backend returns JourneyBookingEntity[] mapped into the standard
 * JourneyBookingResponse representation.
 */
export type FindJourneyBookingsByStatusResponse =
  JourneyBooking[];

// -----------------------------------------------------------------------------
// API Function
// -----------------------------------------------------------------------------

/**
 * Retrieve Journey Bookings having the requested lifecycle status.
 *
 * @param status
 *   Journey Booking lifecycle status used by the backend discovery endpoint.
 *
 * @returns
 *   Journey Bookings matching the requested status.
 *
 * @throws
 *   TypeError when the status is empty.
 *
 * @throws
 *   AuthenticationRequiredError when there is no authenticated session.
 *
 * @throws
 *   ApiError when the backend rejects the request.
 */
export async function findJourneyBookingsByStatus(
  status: JourneyBookingStatus,
): Promise<FindJourneyBookingsByStatusResponse> {
  const normalizedStatus = status.trim();

  if (!normalizedStatus) {
    throw new TypeError(
      'A Journey Booking status is required.',
    );
  }

  return authenticatedApiClient.get<FindJourneyBookingsByStatusResponse>(
    `/journey-bookings/status/${encodeURIComponent(normalizedStatus)}`,
  );
}