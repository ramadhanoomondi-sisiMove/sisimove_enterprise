// -----------------------------------------------------------------------------
// SisiMove — Get Journey Booking API
// -----------------------------------------------------------------------------
//
// Authenticated API adapter for retrieving one Journey Booking by its public
// identifier.
//
// Backend endpoint:
//
//   GET /api/v1/journey-bookings/:journeyBookingPublicId
//
// Backend authorization:
//   journey-booking:read
//
// The endpoint returns the JourneyBooking aggregate through the backend
// response mapper. The frontend API layer deliberately treats the response as
// a transport representation and does not reproduce backend domain objects.
//
// Architectural responsibilities:
//
// - Define the HTTP contract for this specific use case.
// - Require the authenticated API boundary.
// - Pass the public booking identifier as an opaque path parameter.
// - Return the backend response without introducing feature/business logic.
//
// Non-responsibilities:
//
// - Authentication/session management.
// - Booking lifecycle rules.
// - Payment state transitions.
// - Response presentation.
// - React Query/cache management.
// - Mapping transport data into UI-specific view models.
//
// Mapping is intentionally deferred to the mapper layer so that the API
// adapter remains concerned only with HTTP transport.
//
// -----------------------------------------------------------------------------


import { authenticatedApiClient } from '@/features/authentication/http';

import type { JourneyBooking } from '../../models/journey-booking';

// -----------------------------------------------------------------------------
// API Response Contract
// -----------------------------------------------------------------------------

/**
 * Transport representation returned by the Journey Booking HTTP endpoint.
 *
 * The backend response mapper currently exposes the same structural shape as
 * the JourneyBooking application model. Keeping the API return type explicit
 * here prevents consumers from depending directly on the HTTP client's
 * generic `unknown` boundary.
 *
 * The mapper layer remains responsible for converting transport data into the
 * feature's application model when transport/application representations
 * diverge.
 */
export type GetJourneyBookingResponse = JourneyBooking;

// -----------------------------------------------------------------------------
// API Function
// -----------------------------------------------------------------------------

/**
 * Retrieve a single Journey Booking by its public identifier.
 *
 * This endpoint is protected and therefore uses the shared authenticated API
 * client. Feature code must not access authSessionStorage directly.
 *
 * @param journeyBookingPublicId
 *   Public identifier of the Journey Booking.
 *
 * @returns
 *   The Journey Booking returned by the backend.
 *
 * @throws
 *   AuthenticationRequiredError when there is no authenticated session.
 *
 * @throws
 *   ApiError when the backend rejects the request, including authorization,
 *   validation, not-found, or server errors.
 */
export async function getJourneyBooking(
  journeyBookingPublicId: string,
): Promise<GetJourneyBookingResponse> {
  const normalizedPublicId = journeyBookingPublicId.trim();

  if (!normalizedPublicId) {
    throw new TypeError(
      'A Journey Booking public identifier is required.',
    );
  }

  return authenticatedApiClient.get<GetJourneyBookingResponse>(
    `/journey-bookings/${encodeURIComponent(normalizedPublicId)}`,
  );
}