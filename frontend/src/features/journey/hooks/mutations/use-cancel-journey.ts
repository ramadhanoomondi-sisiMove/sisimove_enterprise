// -----------------------------------------------------------------------------
// sisiMove — useCancelJourney
// -----------------------------------------------------------------------------
//
// React Query mutation hook for cancelling a Journey.
//
// API boundary:
//     POST /api/v1/journeys/:journeyPublicId/cancel
//
// Request body:
//     {
//       reason: string
//       cancelledAt?: string
//     }
//
// The Journey cancellation transition remains owned by the backend Journey
// aggregate/application layer. The frontend only submits the values accepted
// by the frozen controller.
//
// This hook is responsible for:
// - Executing the Journey cancellation API.
// - Managing mutation state through React Query.
// - Mapping the returned Journey aggregate into the frontend Journey model.
// - Invalidating affected Journey query caches.
//
// This hook intentionally does NOT:
// - Change the Journey status locally.
// - Validate cancellation rules.
// - Decide whether cancellation is permitted.
// - Perform booking or financial cancellation workflows directly.
// - Perform authorization checks.
// - Navigate to another route.
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  cancelJourney,
  type CancelJourneyRequest,
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
 * Variables accepted by the cancel mutation.
 *
 * `reason` is required by the frozen controller.
 *
 * `cancelledAt` is optional because the backend may determine the cancellation
 * timestamp when the client does not provide one.
 */
export type CancelJourneyVariables = CancelJourneyRequest & {
  journeyPublicId: string;
};

// -----------------------------------------------------------------------------
// Mutation
// -----------------------------------------------------------------------------

/**
 * Cancels a Journey.
 */
export function useCancelJourney() {
  const queryClient = useQueryClient();

  return useMutation<
    Journey,
    Error,
    CancelJourneyVariables
  >({
    mutationFn: async ({
      journeyPublicId,
      reason,
      cancelledAt,
    }) => {
      const response = await cancelJourney(
        journeyPublicId,
        {
          reason,
          cancelledAt,
        },
      );

      return mapJourney(
        response as JourneyApiResponse,
      );
    },

    onSuccess: async () => {
      /**
       * Cancellation changes the authenticated Journey lifecycle
       * representation and may remove the Journey from public discovery.
       *
       * Invalidate the public collections as well so a previously cached
       * published Journey is not treated as currently discoverable.
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