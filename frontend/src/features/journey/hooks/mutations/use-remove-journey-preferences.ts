// -----------------------------------------------------------------------------
// sisiMove — useRemoveJourneyPreferences
// -----------------------------------------------------------------------------
//
// React Query mutation hook for removing the attached Preferences from a
// Journey.
//
// API boundary:
//     DELETE /api/v1/journeys/:journeyPublicId/preferences
//
// Request body:
//     None
//
// IMPORTANT:
//
// The frozen Journey controller removes the Journey-side Preferences
// attachment. It does NOT delete the underlying Preferences resource.
//
// Therefore this hook:
// - Identifies the Journey using its public identifier.
// - Sends no request body.
// - Delegates the removal operation to the backend.
//
// The backend remains authoritative for whether the Preferences can be
// removed.
//
// This hook is responsible for:
// - Executing the Preferences removal API.
// - Managing mutation state through React Query.
// - Invalidating affected Journey Preferences queries.
// - Invalidating authenticated Journey collections.
//
// This hook intentionally does NOT:
// - Delete the Preferences resource itself.
// - Modify preference values.
// - Validate Journey lifecycle rules.
// - Perform authorization checks.
// - Navigate to another route.
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { removeJourneyPreferences } from '../../api/components/preferences';

import {
  JOURNEY_PREFERENCES_QUERY_KEY,
  MY_JOURNEYS_QUERY_KEY,
  JOURNEYS_BY_PROVIDER_QUERY_KEY,
  JOURNEYS_BY_PROVIDER_STATUS_QUERY_KEY,
} from '../queries';

// -----------------------------------------------------------------------------
// Variables
// -----------------------------------------------------------------------------

/**
 * Variables accepted by the Preferences removal mutation.
 *
 * `journeyPublicId` identifies the Journey whose Preferences attachment
 * should be removed.
 */
export interface RemoveJourneyPreferencesVariables {
  journeyPublicId: string;
}

// -----------------------------------------------------------------------------
// Mutation
// -----------------------------------------------------------------------------

/**
 * Removes the attached Preferences from a Journey.
 */
export function useRemoveJourneyPreferences() {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    Error,
    RemoveJourneyPreferencesVariables
  >({
    mutationFn: async ({
      journeyPublicId,
    }) => {
      return removeJourneyPreferences(
        journeyPublicId,
      );
    },

    onSuccess: async () => {
      /**
       * `JOURNEY_PREFERENCES_QUERY_KEY` is a static query-key namespace:
       *
       *     ['journeys', 'preferences']
       *
       * It is intentionally passed directly to React Query rather than
       * invoked as a function.
       *
       * This invalidates Journey-specific Preferences queries such as:
       *
       *     ['journeys', 'preferences', journeyPublicId]
       */
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: JOURNEY_PREFERENCES_QUERY_KEY,
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