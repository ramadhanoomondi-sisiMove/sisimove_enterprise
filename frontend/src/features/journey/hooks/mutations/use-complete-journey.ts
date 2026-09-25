// -----------------------------------------------------------------------------
// sisiMove — useCompleteJourney
// -----------------------------------------------------------------------------
//
// React Query mutation hook for completing a Journey.
//
// API boundary:
//     POST /api/v1/journeys/:journeyPublicId/complete
//
// Request body:
//     {
//       completedAt?: string
//     }
//
// The Journey lifecycle transition remains owned by the backend Journey
// aggregate/application layer. The frontend only submits the optional
// timestamp accepted by the frozen controller.
//
// This hook is responsible for:
// - Executing the Journey completion API.
// - Managing mutation state through React Query.
// - Mapping the returned Journey aggregate into the frontend Journey model.
// - Invalidating affected Journey query caches.
//
// Important:
// Completion may represent a business workflow involving passenger/driver
// confirmation and financial completion. The frontend must not reproduce
// those rules locally. The backend remains authoritative.
//
// This hook intentionally does NOT:
// - Mark a Journey completed locally.
// - Resolve passenger confirmations.
// - Trigger financial settlement directly.
// - Validate completion eligibility.
// - Perform authorization checks.
// - Navigate to another route.
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  completeJourney,
  type CompleteJourneyRequest,
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
 * Variables accepted by the complete mutation.
 *
 * `completedAt` is optional because the frozen controller permits the backend
 * to determine the completion timestamp when it is omitted.
 */
export type CompleteJourneyVariables = CompleteJourneyRequest & {
  journeyPublicId: string;
};

// -----------------------------------------------------------------------------
// Mutation
// -----------------------------------------------------------------------------

/**
 * Completes a Journey.
 */
export function useCompleteJourney() {
  const queryClient = useQueryClient();

  return useMutation<
    Journey,
    Error,
    CompleteJourneyVariables
  >({
    mutationFn: async ({
      journeyPublicId,
      completedAt,
    }) => {
      const response = await completeJourney(
        journeyPublicId,
        {
          completedAt,
        },
      );

      return mapJourney(
        response as JourneyApiResponse,
      );
    },

    onSuccess: async () => {
      /**
       * Completion changes the Journey lifecycle representation and can
       * remove the Journey from public discovery depending on backend
       * lifecycle rules.
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