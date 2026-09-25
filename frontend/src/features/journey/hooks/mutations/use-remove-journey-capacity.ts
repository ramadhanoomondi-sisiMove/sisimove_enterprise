// -----------------------------------------------------------------------------
// sisiMove — useRemoveJourneyCapacity
// -----------------------------------------------------------------------------
//
// React Query mutation hook for removing the attached Capacity from a
// Journey.
//
// API boundary:
//     DELETE /api/v1/journeys/:journeyPublicId/capacity
//
// Request body:
//     None
//
// IMPORTANT:
//
// The frozen Journey controller removes the Journey-side Capacity attachment.
// It does NOT delete the underlying Capacity resource.
//
// Therefore this hook:
// - Identifies the Journey using its public identifier.
// - Sends no request body.
// - Delegates the removal operation to the backend.
//
// The backend remains authoritative for whether the Capacity can be removed.
//
// This hook is responsible for:
// - Executing the Capacity removal API.
// - Managing mutation state through React Query.
// - Invalidating affected Journey Capacity queries.
// - Invalidating authenticated Journey collections.
//
// This hook intentionally does NOT:
// - Delete the Capacity itself.
// - Modify total or booked seats.
// - Calculate available seats.
// - Validate Journey lifecycle rules.
// - Perform authorization checks.
// - Navigate to another route.
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { removeJourneyCapacity } from '../../api/components/capacity';

import {
  JOURNEY_CAPACITY_QUERY_KEY,
  MY_JOURNEYS_QUERY_KEY,
  JOURNEYS_BY_PROVIDER_QUERY_KEY,
  JOURNEYS_BY_PROVIDER_STATUS_QUERY_KEY,
} from '../queries';

// -----------------------------------------------------------------------------
// Variables
// -----------------------------------------------------------------------------

/**
 * Variables accepted by the Capacity removal mutation.
 *
 * `journeyPublicId` identifies the Journey whose Capacity attachment should
 * be removed.
 */
export interface RemoveJourneyCapacityVariables {
  journeyPublicId: string;
}

// -----------------------------------------------------------------------------
// Mutation
// -----------------------------------------------------------------------------

/**
 * Removes the attached Capacity from a Journey.
 */
export function useRemoveJourneyCapacity() {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    Error,
    RemoveJourneyCapacityVariables
  >({
    mutationFn: async ({
      journeyPublicId,
    }) => {
      return removeJourneyCapacity(
        journeyPublicId,
      );
    },

    onSuccess: async () => {
      /**
       * `JOURNEY_CAPACITY_QUERY_KEY` is a static query-key namespace:
       *
       *     ['journeys', 'capacity']
       *
       * It is intentionally passed directly to React Query rather than
       * invoked as a function.
       *
       * This invalidates Journey-specific Capacity queries such as:
       *
       *     ['journeys', 'capacity', journeyPublicId]
       */
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: JOURNEY_CAPACITY_QUERY_KEY,
        }),

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