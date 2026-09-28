// -----------------------------------------------------------------------------
// sisiMove — Get My Journeys API
// -----------------------------------------------------------------------------
//
// Authenticated Journey collection query.
//
// Backend endpoint:
//
//   GET /api/v1/journeys/me
//
// The backend derives the provider identity from the authenticated session.
// The frontend therefore MUST NOT send providerPublicId as a query parameter
// or request body.
//
// Architectural boundary:
//
//   Authenticated My Journeys
//       │
//       ▼
//   getMyJourneys()
//       │
//       ▼
//   authenticatedApiClient
//       │
//       ▼
//   GET /journeys/me
//
// This adapter is responsible only for HTTP transport.
//
// It does not:
// - read authSessionStorage directly;
// - reconstruct the Journey aggregate;
// - determine Journey ownership;
// - perform React Query operations;
// - calculate available seats;
// - apply Journey lifecycle rules;
// - fabricate missing Journey components.
//
// The authenticated API client owns authentication concerns.
// -----------------------------------------------------------------------------

import {
  authenticatedApiClient,
} from "@/features/authentication/http/authenticated-api-client";

import type { RequestOptions } from "@/foundation/http";

import type { MyJourney } from "../../models/my-journey";

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

/**
 * Fetch Journeys belonging to the currently authenticated provider.
 *
 * Backend:
 *
 *   GET /journeys/me
 *
 * Authentication is supplied automatically by `authenticatedApiClient`.
 */
export async function getMyJourneys(
  options: RequestOptions = {},
): Promise<MyJourney[]> {
  return authenticatedApiClient.get<MyJourney[]>(
    "/journeys/me",
    options,
  );
}