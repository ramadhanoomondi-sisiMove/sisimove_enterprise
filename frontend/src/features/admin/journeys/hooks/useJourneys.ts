'use client';

/**
 * sisiMove — useJourneys
 *
 * React Query hooks for detailed journeys.
 *
 * - useJourneys: detailed journeys belonging to one provider.
 * - useAllDetailedJourneys: detailed journeys across all providers,
 *   intended for the platform admin control center.
 */

import { useQuery } from '@tanstack/react-query';

import { journeysApi } from '../api/journeys.api';
import { mapJourneyResponses } from '../mappers/journey.mapper';

import type { JourneyBackendResponse } from '../mappers/journey.mapper';

// -----------------------------------------------------------------------------
// Query Keys
// -----------------------------------------------------------------------------

export const journeysQueryKeys = {
  all: ['journeys'] as const,

  lists: () => [...journeysQueryKeys.all, 'list'] as const,

  byProvider: (providerPublicId: string) =>
    [...journeysQueryKeys.lists(), 'provider', providerPublicId] as const,

  allDetailed: () =>
    [...journeysQueryKeys.lists(), 'all-detailed'] as const,
};

// -----------------------------------------------------------------------------
// Provider-scoped Hook
// -----------------------------------------------------------------------------

export function useJourneys(providerPublicId: string | undefined) {
  const normalizedProviderPublicId = providerPublicId?.trim() ?? '';

  return useQuery({
    queryKey: journeysQueryKeys.byProvider(normalizedProviderPublicId),

    queryFn: async () => {
      const responses =
        await journeysApi.getDetailedByProvider(normalizedProviderPublicId);

      return mapJourneyResponses(
        [...responses] as JourneyBackendResponse[],
      );
    },

    enabled: normalizedProviderPublicId.length > 0,

    staleTime: 30_000,
  });
}

// -----------------------------------------------------------------------------
// Platform-wide Admin Hook
// -----------------------------------------------------------------------------

export function useAllDetailedJourneys() {
  return useQuery({
    queryKey: journeysQueryKeys.allDetailed(),

    queryFn: async () => {
      const responses = await journeysApi.getAllDetailed();

      return mapJourneyResponses(
        [...responses] as JourneyBackendResponse[],
      );
    },

    staleTime: 30_000,
  });
}

export default useJourneys;