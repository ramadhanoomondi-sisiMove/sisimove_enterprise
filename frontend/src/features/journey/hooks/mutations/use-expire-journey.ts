// -----------------------------------------------------------------------------
// sisiMove — useExpireJourney
// -----------------------------------------------------------------------------
//
// React Query mutation hook for expiring a Journey.
//
// API boundary:
//     POST /api/v1/journeys/:journeyPublicId/expire
//
// Request body:
//     {
//       expiredAt?: string
//     }
//
// The Journey expiration transition remains owned by the backend Journey
// aggregate/application layer. The frontend only submits the optional
// timestamp accepted by the frozen controller.
//
// This hook is responsible for:
// - Executing the Journey expiration API.
// - Managing mutation state through React Query.
// - Mapping the returned Journey aggregate into the frontend Journey model.
// - Invalidating affected Journey query caches.
//
// This hook intentionally does NOT:
// - Change the Journey status locally.
// - Determine whether the Journey should expire.
// - Validate lifecycle transition rules.
// - Perform authorization checks.
// - Navigate to another route.
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  expireJourney,
  type ExpireJourneyRequest,
} from '../../api/lifecycle';

import {
  mapJourney,
  type JourneyApiResponse,
} from '../../mappers';

import type { Journey } from '../../models';

import {
  MY_JOURNEYS_QUERY_KEY,
  JOURNEYS_BY_PROVIDER_QUERY_KEY,
  JOURNEYS_BY_PROVIDER_STATUS_QUERY_KEY,
  PUBLIC_JOURNEYS_QUERY_KEY,
  SEARCH_PUBLISHED_JOURNEYS_QUERY_KEY,
} from '../queries';

// -----------------------------------------------------------------------------
// Variables
// -----------------------------------------------------------------------------

/**
 * Variables accepted by the expire mutation.
 *
 * `expiredAt` is optional because the frozen controller permits the backend
 * to determine the expiration timestamp when it is omitted.
 */
export type ExpireJourneyVariables = ExpireJourneyRequest & {
  journeyPublicId: string;
};

// -----------------------------------------------------------------------------
// Mutation
// -----------------------------------------------------------------------------

/**
 * Expires a Journey.
 */
export function useExpireJourney() {
  const queryClient = useQueryClient();

  return useMutation<
    Journey,
    Error,
    ExpireJourneyVariables
  >({
    mutationFn: async ({
      journeyPublicId,
      expiredAt,
    }) => {
      const response = await expireJourney(
        journeyPublicId,
        {
          expiredAt,
        },
      );

      return mapJourney(
        response as JourneyApiResponse,
      );
    },

    onSuccess: async () => {
      /**
       * Expiration changes the Journey lifecycle representation and may make
       * the Journey unavailable through public discovery.
       *
       * Invalidate both authenticated and public Journey collections so cached
       * marketplace data can be refreshed from the backend.
       */
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: MY_JOURNEYS_QUERY_KEY,
        }),

        queryClient.invalidateQueries({
          queryKey: JOURNEYS_BY_PROVIDER_QUERY_KEY,
        }),

        queryClient.invalidateQueries({
          queryKey: JOURNEYS_BY_PROVIDER_STATUS_QUERY_KEY,
        }),

        queryClient.invalidateQueries({
          queryKey: PUBLIC_JOURNEYS_QUERY_KEY,
        }),

        queryClient.invalidateQueries({
          queryKey: SEARCH_PUBLISHED_JOURNEYS_QUERY_KEY,
        }),
      ]);
    },
  });
}