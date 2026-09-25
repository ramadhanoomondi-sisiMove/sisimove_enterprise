// -----------------------------------------------------------------------------
// sisiMove — Get Public Journeys API
// -----------------------------------------------------------------------------
//
// HTTP adapter for the public Journey marketplace collection endpoint.
//
// Backend endpoint:
//
//   GET /api/v1/journeys/public
//
// Supported query parameters:
//
//   from
//   to
//   date
//
// The endpoint is public and therefore does NOT use the authenticated API
// client. Authentication must not become a prerequisite for marketplace
// discovery.
//
// Architectural boundary:
//
//   UI / Hook
//       │
//       ▼
//   getPublicJourneys()
//       │
//       ▼
//   Foundation ApiClient
//       │
//       ▼
//   GET /journeys/public
//
// This adapter performs HTTP transport only. Response transformation belongs
// to the Journey mappers layer.
//
// IMPORTANT:
// Do not add providerPublicId to the request. The public Journey endpoint
// owns its own marketplace composition and must not expose authenticated
// management concerns through the client contract.
//
// -----------------------------------------------------------------------------

import { apiClient } from '@/foundation/http';

import type { Journey } from '../../models';

/**
 * Filters supported by the public Journey discovery endpoint.
 *
 * All filters are optional. When omitted, the backend returns the complete
 * public discoverable Journey collection.
 */
export interface GetPublicJourneysParams {
  /**
   * Origin search value.
   */
  from?: string;

  /**
   * Destination search value.
   */
  to?: string;

  /**
   * Journey date filter.
   *
   * The value is sent to the backend as supplied by the caller.
   */
  date?: string;
}

/**
 * Fetch publicly discoverable Journeys.
 *
 * This maps directly to:
 *
 *   GET /journeys/public?from=&to=&date=
 *
 * The foundation ApiClient:
 *
 * - builds the query string,
 * - handles JSON parsing,
 * - unwraps the standard API response envelope,
 * - and normalizes HTTP/network errors.
 *
 * @param params Optional public marketplace filters.
 * @returns Publicly discoverable Journey representations.
 */
export async function getPublicJourneys(
  params: GetPublicJourneysParams = {},
): Promise<Journey[]> {
  return apiClient.get<Journey[]>(
    '/journeys/public',
    {
      query: {
        from: params.from,
        to: params.to,
        date: params.date,
      },
    },
  );
}