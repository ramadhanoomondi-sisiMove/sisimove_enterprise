// -----------------------------------------------------------------------------
// sisiMove — usePublicJourneys
// -----------------------------------------------------------------------------
//
// React Query hook for public Journey discovery.
//
// API boundary:
//     GET /api/v1/journeys/public?from=&to=&date=
//
// This hook is responsible for:
// - Executing the public Journey discovery API.
// - Managing query caching and request lifecycle through React Query.
// - Mapping API transport data into the public Journey frontend model.
//
// This hook intentionally does NOT:
// - Perform authenticated requests.
// - Accept providerPublicId.
// - Resolve Traveller Profile or Trust Profile.
// - Construct Journey API URLs outside the API adapter.
// - Format dates or currency.
// - Implement marketplace presentation logic.
//
// Public Journey composition is owned by the backend's
// GetPublicJourneysQueryHandler.
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import {
  getPublicJourneys,
  type GetPublicJourneysParams,
} from '../../api/discovery';

import {
  mapPublicJourneys,
  type PublicJourney,
} from '../../mappers';

// -----------------------------------------------------------------------------
// Query Key
// -----------------------------------------------------------------------------

/**
 * Stable query-key namespace for public Journey discovery.
 *
 * Search parameters are included in the key so React Query keeps separate
 * cached results for separate marketplace queries.
 */
export const PUBLIC_JOURNEYS_QUERY_KEY = ['journeys', 'public'] as const;

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Fetches publicly discoverable Journeys.
 *
 * When no filters are supplied, the backend returns the public Journey
 * collection according to its own discovery rules.
 *
 * `from`, `to`, and `date` are passed through to the API adapter without
 * frontend-side interpretation.
 */
export function usePublicJourneys(
  params?: GetPublicJourneysParams,
) {
  return useQuery<PublicJourney[], Error>({
    queryKey: [
      ...PUBLIC_JOURNEYS_QUERY_KEY,
      params?.from ?? null,
      params?.to ?? null,
      params?.date ?? null,
    ],

    queryFn: async () => {
      const response = await getPublicJourneys(params);

      return mapPublicJourneys(response);
    },
  });
}