// -----------------------------------------------------------------------------
// sisiMove — Search Published Journeys API
// -----------------------------------------------------------------------------
//
// HTTP adapter for the published Journey search endpoint.
//
// Backend endpoint:
//
//   GET /api/v1/journeys/search
//
// Supported query parameters:
//
//   from
//   to
//   date
//
// Architectural boundary:
//
//   UI / Hook
//       │
//       ▼
//   searchPublishedJourneys()
//       │
//       ▼
//   Foundation ApiClient
//       │
//       ▼
//   GET /journeys/search
//
// This adapter is intentionally separate from the public marketplace
// collection adapter because `/journeys/search` is a distinct backend
// endpoint and therefore represents a distinct API capability.
//
// The adapter performs HTTP transport only. Response transformation belongs
// to the Journey mappers layer.
//
// -----------------------------------------------------------------------------

import { apiClient } from '@/foundation/http';

import type { Journey } from '../../models';

/**
 * Filters supported by the published Journey search endpoint.
 *
 * All filters are optional.
 */
export interface SearchPublishedJourneysParams {
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
   */
  date?: string;
}

/**
 * Search published Journeys.
 *
 * Maps directly to:
 *
 *   GET /journeys/search?from=&to=&date=
 *
 * The foundation ApiClient is responsible for query-string construction,
 * response parsing, response-envelope unwrapping, and standardized errors.
 *
 * @param params Optional search filters.
 * @returns Journeys matching the supplied published Journey search criteria.
 */
export async function searchPublishedJourneys(
  params: SearchPublishedJourneysParams = {},
): Promise<Journey[]> {
  return apiClient.get<Journey[]>(
    '/journeys/search',
    {
      query: {
        from: params.from,
        to: params.to,
        date: params.date,
      },
    },
  );
}