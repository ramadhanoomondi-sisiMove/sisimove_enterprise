// -----------------------------------------------------------------------------
// sisiMove — useJourneysByProviderStatus
// -----------------------------------------------------------------------------
//
// React Query hook for retrieving Journeys belonging to a provider filtered by
// Journey lifecycle status.
//
// API boundary:
//     GET /api/v1/journeys/provider/:providerPublicId/status/:status
//
// The providerPublicId is an explicit public identity reference. The backend
// remains responsible for determining whether the authenticated caller is
// authorized to access the requested provider's Journeys.
//
// This hook is responsible for:
// - Executing the provider/status Journey API.
// - Managing query state and caching through React Query.
// - Mapping API transport responses into the frontend Journey model.
//
// This hook intentionally does NOT:
// - Perform authorization decisions.
// - Infer provider identity.
// - Translate or reinterpret lifecycle states.
// - Format status labels.
// - Perform lifecycle mutations.
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import {
  getJourneysByProviderStatus,
} from '../../api/management';

import {
  mapJourney,
  type JourneyApiResponse,
} from '../../mappers';

import type {
  Journey,
  JourneyStatus,
} from '../../models';

// -----------------------------------------------------------------------------
// Query Key
// -----------------------------------------------------------------------------

/**
 * Stable query-key namespace for provider/status Journey queries.
 *
 * Both provider identity and Journey status are part of the cache identity.
 */
export const JOURNEYS_BY_PROVIDER_STATUS_QUERY_KEY = [
  'journeys',
  'provider',
  'status',
] as const;

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Fetches Journeys for a provider filtered by lifecycle status.
 *
 * The status is passed through unchanged to the API adapter. Backend
 * lifecycle semantics remain authoritative.
 */
export function useJourneysByProviderStatus(
  providerPublicId: string,
  status: JourneyStatus,
) {
  return useQuery<Journey[], Error>({
    queryKey: [
      ...JOURNEYS_BY_PROVIDER_STATUS_QUERY_KEY,
      providerPublicId,
      status,
    ],

    queryFn: async () => {
      const response = await getJourneysByProviderStatus(
        providerPublicId,
        status,
      );

      return (response as JourneyApiResponse[]).map(mapJourney);
    },

    enabled: Boolean(providerPublicId) && Boolean(status),
  });
}