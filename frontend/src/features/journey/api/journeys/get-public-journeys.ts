// -----------------------------------------------------------------------------
// sisiMove — Get Public Journeys API
// -----------------------------------------------------------------------------
//
// Public Journey marketplace query.
//
// Backend endpoint:
//
//   GET /api/v1/journeys/public
//
// Supported query parameters:
//
//   from?=...
//   to?=...
//   date?=...
//
// The endpoint returns the public Journey projection, including:
//
//   - Journey route
//   - schedule
//   - vehicle
//   - capacity
//   - pricing
//   - preferences
//   - assets
//   - public provider traveller projection
//   - public provider trust projection
//
// This is a public endpoint and therefore uses the foundation `apiClient`
// rather than `authenticatedApiClient`.
//
// Architectural boundary:
//
//   UI / Hook
//       │
//       ▼
//   getPublicJourneys()
//       │
//       ▼
//   foundation apiClient
//       │
//       ▼
//   GET /journeys/public
//
// This adapter is responsible only for HTTP transport. It does not:
//
// - perform React Query operations;
// - map backend values into UI labels;
// - reconstruct Journey domain objects;
// - fetch provider/trust information separately;
// - calculate available seats;
// - apply marketplace filtering locally;
// - enforce Journey lifecycle rules.
//
// The backend public query is the source of truth for the public Journey
// projection.
// -----------------------------------------------------------------------------

import {
  apiClient,
  type RequestOptions,
} from "@/foundation/http";

import type { PublicJourney } from "../../models/public-journey";

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

export interface GetPublicJourneysQuery {
  /**
   * Optional origin search/filter value.
   *
   * Passed directly to the backend `from` query parameter.
   */
  readonly from?: string;

  /**
   * Optional destination search/filter value.
   *
   * Passed directly to the backend `to` query parameter.
   */
  readonly to?: string;

  /**
   * Optional journey date filter.
   *
   * Passed directly to the backend `date` query parameter.
   */
  readonly date?: string;
}

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

/**
 * Fetch publicly discoverable Journeys.
 *
 * Backend:
 *
 *   GET /journeys/public?from=&to=&date=
 *
 * No authentication is required.
 */
export async function getPublicJourneys(
  query: GetPublicJourneysQuery = {},
  options: RequestOptions = {},
): Promise<PublicJourney[]> {
  return apiClient.get<PublicJourney[]>(
    "/journeys/public",
    {
      ...options,
      query: {
        from: query.from,
        to: query.to,
        date: query.date,
      },
    },
  );
}