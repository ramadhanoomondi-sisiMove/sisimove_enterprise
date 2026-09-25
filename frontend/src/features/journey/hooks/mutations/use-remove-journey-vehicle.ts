// -----------------------------------------------------------------------------
// sisiMove — useRemoveJourneyVehicle
// -----------------------------------------------------------------------------
//
// React Query mutation hook for removing the attached Vehicle from a Journey.
//
// API boundary:
//     DELETE /api/v1/journeys/:journeyPublicId/vehicle
//
// Request body:
//     None
//
// IMPORTANT:
//
// The frozen Journey controller removes the Journey-side Vehicle attachment.
// It does NOT delete the underlying Vehicle resource.
//
// Therefore this hook:
// - Identifies the Journey using its public identifier.
// - Sends no request body.
// - Delegates the removal operation to the backend.
//
// The backend remains authoritative for whether the Vehicle can be removed.
//
// This hook is responsible for:
// - Executing the Vehicle removal API.
// - Managing mutation state through React Query.
// - Invalidating affected Journey Vehicle queries.
// - Invalidating authenticated Journey collections.
//
// This hook intentionally does NOT:
// - Delete the Vehicle itself.
// - Modify Vehicle details.
// - Validate Vehicle ownership.
// - Validate Journey lifecycle rules.
// - Perform authorization checks.
// - Navigate to another route.
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { removeJourneyVehicle } from '../../api/components/vehicle';

import {
  JOURNEY_VEHICLE_QUERY_KEY,
  MY_JOURNEYS_QUERY_KEY,
  JOURNEYS_BY_PROVIDER_QUERY_KEY,
  JOURNEYS_BY_PROVIDER_STATUS_QUERY_KEY,
} from '../queries';

// -----------------------------------------------------------------------------
// Variables
// -----------------------------------------------------------------------------

/**
 * Variables accepted by the Vehicle removal mutation.
 *
 * `journeyPublicId` identifies the Journey whose Vehicle attachment should
 * be removed.
 */
export interface RemoveJourneyVehicleVariables {
  journeyPublicId: string;
}

// -----------------------------------------------------------------------------
// Mutation
// -----------------------------------------------------------------------------

/**
 * Removes the attached Vehicle from a Journey.
 */
export function useRemoveJourneyVehicle() {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    Error,
    RemoveJourneyVehicleVariables
  >({
    mutationFn: async ({
      journeyPublicId,
    }) => {
      return removeJourneyVehicle(
        journeyPublicId,
      );
    },

    onSuccess: async () => {
      /**
       * `JOURNEY_VEHICLE_QUERY_KEY` is a static query-key namespace:
       *
       *     ['journeys', 'vehicle']
       *
       * It is intentionally passed directly to React Query rather than
       * invoked as a function.
       *
       * This invalidates Journey-specific Vehicle queries such as:
       *
       *     ['journeys', 'vehicle', journeyPublicId]
       */
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: JOURNEY_VEHICLE_QUERY_KEY,
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