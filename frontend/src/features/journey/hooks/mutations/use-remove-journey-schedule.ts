// -----------------------------------------------------------------------------
// sisiMove — useRemoveJourneySchedule
// -----------------------------------------------------------------------------
//
// React Query mutation hook for removing the attached Schedule from a
// Journey.
//
// API boundary:
//     DELETE /api/v1/journeys/:journeyPublicId/schedule
//
// Request body:
//     None
//
// IMPORTANT:
//
// The frozen Journey controller removes the Journey-side Schedule attachment.
// It does NOT delete the underlying Schedule resource.
//
// Therefore this hook:
// - Identifies the Journey using its public identifier.
// - Sends no request body.
// - Delegates the removal operation to the backend.
//
// The backend remains authoritative for whether the Schedule can be removed.
//
// This hook is responsible for:
// - Executing the Schedule removal API.
// - Managing mutation state through React Query.
// - Invalidating affected Journey Schedule queries.
// - Invalidating authenticated Journey collections.
//
// This hook intentionally does NOT:
// - Delete the Schedule itself.
// - Modify Schedule details.
// - Validate Journey lifecycle rules.
// - Perform authorization checks.
// - Navigate to another route.
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { removeJourneySchedule } from '../../api/components/schedule';

import {
  JOURNEY_SCHEDULE_QUERY_KEY,
  MY_JOURNEYS_QUERY_KEY,
  JOURNEYS_BY_PROVIDER_QUERY_KEY,
  JOURNEYS_BY_PROVIDER_STATUS_QUERY_KEY,
} from '../queries';

// -----------------------------------------------------------------------------
// Variables
// -----------------------------------------------------------------------------

/**
 * Variables accepted by the Schedule removal mutation.
 *
 * `journeyPublicId` identifies the Journey whose Schedule attachment should
 * be removed.
 */
export interface RemoveJourneyScheduleVariables {
  journeyPublicId: string;
}

// -----------------------------------------------------------------------------
// Mutation
// -----------------------------------------------------------------------------

/**
 * Removes the attached Schedule from a Journey.
 */
export function useRemoveJourneySchedule() {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    Error,
    RemoveJourneyScheduleVariables
  >({
    mutationFn: async ({
      journeyPublicId,
    }) => {
      return removeJourneySchedule(
        journeyPublicId,
      );
    },

    onSuccess: async () => {
      /**
       * `JOURNEY_SCHEDULE_QUERY_KEY` is a static query-key namespace:
       *
       *     ['journeys', 'schedule']
       *
       * It is intentionally passed directly to React Query rather than
       * invoked as a function.
       *
       * This invalidates Journey-specific Schedule queries such as:
       *
       *     ['journeys', 'schedule', journeyPublicId]
       */
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: JOURNEY_SCHEDULE_QUERY_KEY,
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