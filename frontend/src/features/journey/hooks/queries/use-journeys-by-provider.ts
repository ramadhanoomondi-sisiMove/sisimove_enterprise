// -----------------------------------------------------------------------------
// sisiMove — useJourneysByProvider
// -----------------------------------------------------------------------------
//
// React Query hook for retrieving Journeys belonging to a specific provider.
//
// API boundary:
//     GET /api/v1/journeys/provider/:providerPublicId
//
// This endpoint is an authenticated management endpoint. The supplied
// providerPublicId is therefore an explicit public identity reference, not a
// replacement for the authenticated identity context.
//
// This hook is responsible for:
// - Executing the provider Journey API.
// - Managing query state and caching through React Query.
// - Mapping API transport responses into the frontend Journey model.
//
// This hook intentionally does NOT:
// - Infer or modify providerPublicId.
// - Resolve Traveller Profile or Trust Profile.
// - Perform authorization checks on the client.
// - Format Journey data.
// - Perform lifecycle mutations.
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import { getJourneysByProvider } from '../../api/management';

import {
  mapJourney,
  type JourneyApiResponse,
} from '../../mappers';

import type { Journey } from '../../models';

// -----------------------------------------------------------------------------
// Query Key
// -----------------------------------------------------------------------------

/**
 * Stable query-key namespace for provider Journey discovery.
 *
 * The provider public identifier is part of the cache identity because
 * different providers represent different Journey collections.
 */
export const JOURNEYS_BY_PROVIDER_QUERY_KEY = [
  'journeys',
  'provider',
] as const;

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Fetches Journeys belonging to the supplied provider.
 *
 * The backend remains authoritative for whether the authenticated caller may
 * access the requested provider's Journeys.
 */
export function useJourneysByProvider(
  providerPublicId: string,
) {
  return useQuery<Journey[], Error>({
    queryKey: [
      ...JOURNEYS_BY_PROVIDER_QUERY_KEY,
      providerPublicId,
    ],

    queryFn: async () => {
      const response = await getJourneysByProvider(
        providerPublicId,
      );

      return (response as JourneyApiResponse[]).map(mapJourney);
    },

    enabled: Boolean(providerPublicId),
  });
}