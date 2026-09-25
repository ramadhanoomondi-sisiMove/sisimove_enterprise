// -----------------------------------------------------------------------------
// sisiMove — useJourneyCapacity
// -----------------------------------------------------------------------------
//
// React Query hook for retrieving the capacity attached to a Journey.
//
// API boundary:
//     GET /api/v1/journeys/:journeyPublicId/capacity
//
// This hook is responsible for:
// - Executing the authenticated Journey capacity API.
// - Managing request state and caching through React Query.
// - Mapping the transport response into JourneyCapacity.
//
// The Journey controller configures Journey-owned Capacity through the
// Journey aggregate. The frontend does not create a standalone Capacity
// resource before invoking the Journey capacity API.
//
// The mutation receives the capacity configuration itself:
//
//   {
//     totalSeats,
//     bookedSeats,
//   }
//
// The backend creates the JourneyCapacity entity, attaches it to the Journey
// aggregate, and persists the aggregate.
//
// This hook only reads the capacity currently attached to the Journey.
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import { getJourneyCapacity } from '../../api/components/capacity';

import {
  mapJourneyCapacity,
  type JourneyCapacityApiResponse,
} from '../../mappers';

import type { JourneyCapacity } from '../../models';

// -----------------------------------------------------------------------------
// Query Key
// -----------------------------------------------------------------------------

/**
 * Stable query-key namespace for the capacity attached to a Journey.
 */
export const JOURNEY_CAPACITY_QUERY_KEY = [
  'journeys',
  'capacity',
] as const;

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Fetches the capacity currently attached to a Journey.
 *
 * A Journey may exist without a capacity, so the result can be null.
 */
export function useJourneyCapacity(
  journeyPublicId: string,
) {
  return useQuery<JourneyCapacity | null, Error>({
    queryKey: [
      ...JOURNEY_CAPACITY_QUERY_KEY,
      journeyPublicId,
    ],

    queryFn: async () => {
      const response = await getJourneyCapacity(
        journeyPublicId,
      );

      if (response === null) {
        return null;
      }

      return mapJourneyCapacity(
        response as JourneyCapacityApiResponse,
      );
    },

    enabled: Boolean(journeyPublicId),
  });
}