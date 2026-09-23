// -----------------------------------------------------------------------------
// sisiMove — useJourney
// -----------------------------------------------------------------------------
//
// Loads a single Journey by its public ID.
//
// This hook wraps the Journey API adapter and exposes server state through
// TanStack Query.
//
// The API adapter currently returns the frontend Journey model, which includes
// the Journey's persisted child resources:
//
// - corridor
// - schedule
// - vehicle
// - capacity
// - pricing
// - preferences
// - assets
//
// The backend remains authoritative for the Journey representation.
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import { getJourney } from '../api';

import type { Journey } from '../../journey/models';

// -----------------------------------------------------------------------------
// Query Keys
// -----------------------------------------------------------------------------

export const journeyQueryKeys = {
  all: ['journeys'] as const,

  detail: (journeyPublicId: string) =>
    ['journeys', 'detail', journeyPublicId] as const,
};

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useJourney(
  journeyPublicId: string | null | undefined,
) {
  return useQuery<Journey | null>({
    // -------------------------------------------------------------------------
    // Stable query key
    // -------------------------------------------------------------------------

    queryKey: journeyPublicId
      ? journeyQueryKeys.detail(journeyPublicId)
      : journeyQueryKeys.detail(''),

    // -------------------------------------------------------------------------
    // Query
    // -------------------------------------------------------------------------
    //
    // The non-null assertion is safe because React Query only enables this
    // query when `journeyPublicId` is truthy.
    //

    queryFn: () =>
      getJourney(journeyPublicId!),

    // -------------------------------------------------------------------------
    // Do not request the API until a Journey public ID exists.
    // -------------------------------------------------------------------------

    enabled: Boolean(journeyPublicId),
  });
}
