// -----------------------------------------------------------------------------
// sisiMove — usePublishJourney
// -----------------------------------------------------------------------------
//
// React Query mutation hook for publishing a Journey.
//
// API boundary:
//     POST /api/v1/journeys/:journeyPublicId/publish
//
// Request body:
//     {
//       publishedAt?: string
//     }
//
// The Journey lifecycle transition remains owned by the backend Journey
// aggregate/application layer. The frontend only submits the optional
// timestamp accepted by the frozen controller.
//
// This hook is responsible for:
// - Executing the Journey publish API.
// - Managing mutation state through React Query.
// - Mapping the returned Journey aggregate into the frontend Journey model.
// - Invalidating affected Journey query caches.
//
// This hook intentionally does NOT:
// - Validate Journey readiness for publication.
// - Change the Journey status locally.
// - Construct provider identity.
// - Attach Journey components.
// - Perform authorization checks.
// - Navigate to another route.
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  publishJourney,
  type PublishJourneyRequest,
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
 * Variables accepted by the publish mutation.
 *
 * `publishedAt` is optional because the frozen controller permits the backend
 * to determine the timestamp when it is omitted.
 */
export type PublishJourneyVariables = PublishJourneyRequest & {
  journeyPublicId: string;
};

// -----------------------------------------------------------------------------
// Mutation
// -----------------------------------------------------------------------------

/**
 * Publishes a Journey.
 */
export function usePublishJourney() {
  const queryClient = useQueryClient();

  return useMutation<
    Journey,
    Error,
    PublishJourneyVariables
  >({
    mutationFn: async ({
      journeyPublicId,
      publishedAt,
    }) => {
      const response = await publishJourney(
        journeyPublicId,
        {
          publishedAt,
        },
      );

      return mapJourney(
        response as JourneyApiResponse,
      );
    },

    onSuccess: async (journey) => {
      /**
       * Publishing changes the authenticated Journey collection and can also
       * make the Journey eligible for public discovery.
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

      /**
       * Keep the returned Journey available to consumers through the mutation
       * result. The lifecycle response remains the authoritative result of
       * this operation.
       */
      void journey;
    },
  });
}