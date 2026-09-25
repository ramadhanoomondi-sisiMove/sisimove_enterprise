// -----------------------------------------------------------------------------
// sisiMove — useSearchPublishedJourneys
// -----------------------------------------------------------------------------
//
// React Query hook for searching published Journeys.
//
// API boundary:
//     GET /api/v1/journeys/search?from=&to=&date=
//
// This hook is responsible for:
// - Executing the published Journey search API.
// - Managing request state and caching through React Query.
// - Mapping API transport responses into public Journey models.
//
// This hook intentionally does NOT:
// - Perform authenticated requests.
// - Accept providerPublicId.
// - Resolve provider/traveller information.
// - Construct API URLs directly.
// - Format dates, prices, or status labels.
// - Implement marketplace presentation logic.
//
// The backend remains authoritative for which Journeys are searchable and
// which lifecycle states qualify as published/discoverable.
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import {
  searchPublishedJourneys,
  type SearchPublishedJourneysParams,
} from '../../api/discovery';

import {
  mapPublicJourneys,
  type PublicJourney,
} from '../../mappers';

// -----------------------------------------------------------------------------
// Query Key
// -----------------------------------------------------------------------------

/**
 * Stable query-key namespace for published Journey search.
 *
 * Search parameters form part of the cache identity so distinct searches do
 * not share cached results accidentally.
 */
export const SEARCH_PUBLISHED_JOURNEYS_QUERY_KEY = [
  'journeys',
  'search',
  'published',
] as const;

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Searches publicly discoverable published Journeys.
 *
 * The backend owns search semantics and publication eligibility. The frontend
 * simply passes the supplied filters to the API adapter and maps the returned
 * transport representation.
 */
export function useSearchPublishedJourneys(
  params?: SearchPublishedJourneysParams,
) {
  return useQuery<PublicJourney[], Error>({
    queryKey: [
      ...SEARCH_PUBLISHED_JOURNEYS_QUERY_KEY,
      params?.from ?? null,
      params?.to ?? null,
      params?.date ?? null,
    ],

    queryFn: async () => {
      const response = await searchPublishedJourneys(params);

      return mapPublicJourneys(response);
    },
  });
}