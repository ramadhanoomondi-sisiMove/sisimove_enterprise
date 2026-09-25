// -----------------------------------------------------------------------------
// sisiMove — useStartJourney
// -----------------------------------------------------------------------------
//
// React Query mutation hook for starting a Journey.
//
// API boundary:
//     POST /api/v1/journeys/:journeyPublicId/start
//
// Request body:
//     {
//       startedAt?: string
//     }
//
// The Journey lifecycle transition remains owned by the backend Journey
// aggregate/application layer. The frontend only submits the optional
// timestamp accepted by the frozen controller.
//
// This hook is responsible for:
// - Executing the Journey start API.
// - Managing mutation state through React Query.
// - Mapping the returned Journey aggregate into the frontend Journey model.
// - Invalidating affected Journey query caches.
//
// This hook intentionally does NOT:
// - Change the Journey status locally.
// - Validate lifecycle transition rules.
// - Attach or modify Journey components.
// - Construct provider identity.
// - Perform authorization checks.
// - Navigate to another route.
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  startJourney,
  type StartJourneyRequest,
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
} from '../queries';

// -----------------------------------------------------------------------------
// Variables
// -----------------------------------------------------------------------------

/**
 * Variables accepted by the start mutation.
 *
 * `startedAt` is optional because the frozen controller permits the backend
 * to determine the timestamp when it is omitted.
 */
export type StartJourneyVariables = StartJourneyRequest & {
  journeyPublicId: string;
};

// -----------------------------------------------------------------------------
// Mutation
// -----------------------------------------------------------------------------

/**
 * Starts a Journey.
 */
export function useStartJourney() {
  const queryClient = useQueryClient();

  return useMutation<
    Journey,
    Error,
    StartJourneyVariables
  >({
    mutationFn: async ({
      journeyPublicId,
      startedAt,
    }) => {
      const response = await startJourney(
        journeyPublicId,
        {
          startedAt,
        },
      );

      return mapJourney(
        response as JourneyApiResponse,
      );
    },

    onSuccess: async () => {
      /**
       * Starting a Journey changes its authenticated lifecycle representation.
       *
       * Provider-specific collections are invalidated as a namespace rather
       * than attempting to construct provider identifiers in the mutation.
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
      ]);
    },
  });
}