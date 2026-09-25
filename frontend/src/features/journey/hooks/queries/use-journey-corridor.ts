// -----------------------------------------------------------------------------
// sisiMove — useJourneyCorridor
// -----------------------------------------------------------------------------
//
// React Query hook for retrieving the corridor attached to a Journey.
//
// API boundary:
//     GET /api/v1/journeys/:journeyPublicId/corridor
//
// This hook is responsible for:
// - Executing the authenticated Journey corridor API.
// - Managing request state and caching through React Query.
// - Mapping the transport response into JourneyCorridor.
//
// The backend Journey controller owns the attachment relationship. The
// frontend does not reconstruct or infer corridor ownership.
//
// This hook intentionally does NOT:
// - Create or attach corridors.
// - Resolve geographic locations.
// - Modify corridor data.
// - Format coordinates.
// - Perform authorization checks.
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import { getJourneyCorridor } from '../../api/components/corridor';

import {
  mapJourneyCorridor,
  type JourneyCorridorApiResponse,
} from '../../mappers';

import type { JourneyCorridor } from '../../models';

// -----------------------------------------------------------------------------
// Query Key
// -----------------------------------------------------------------------------

/**
 * Stable query-key namespace for a Journey's attached corridor.
 */
export const JOURNEY_CORRIDOR_QUERY_KEY = [
  'journeys',
  'corridor',
] as const;

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Fetches the corridor currently attached to a Journey.
 *
 * A Journey may exist without a corridor, so the result can be null.
 */
export function useJourneyCorridor(
  journeyPublicId: string,
) {
  return useQuery<JourneyCorridor | null, Error>({
    queryKey: [
      ...JOURNEY_CORRIDOR_QUERY_KEY,
      journeyPublicId,
    ],

    queryFn: async () => {
      const response = await getJourneyCorridor(
        journeyPublicId,
      );

      if (response === null) {
        return null;
      }

      return mapJourneyCorridor(
        response as JourneyCorridorApiResponse,
      );
    },

    enabled: Boolean(journeyPublicId),
  });
}