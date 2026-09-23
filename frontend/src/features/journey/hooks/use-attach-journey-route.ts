// -----------------------------------------------------------------------------
// sisiMove — useAttachJourneyRoute
// -----------------------------------------------------------------------------
//
// Attaches a sisiMove-controlled corridor and its selected supported
// waypoints to a Journey.
//
// This hook coordinates existing Journey API operations. It does NOT create
// corridors or waypoints.
//
// The backend remains authoritative and must reject invalid corridor/waypoint
// combinations.
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  addJourneyWaypoint,
  attachJourneyCorridor,
} from '../api';

import { journeyRouteQueryKeys } from './use-journey-route';

// -----------------------------------------------------------------------------
// Input
// -----------------------------------------------------------------------------

export interface AttachJourneyRouteInput {
  corridorPublicId: string;
  waypointPublicIds: readonly string[];
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useAttachJourneyRoute() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    {
      journeyPublicId: string;
      input: AttachJourneyRouteInput;
    }
  >({
    mutationFn: async ({ journeyPublicId, input }) => {
      await attachJourneyCorridor(journeyPublicId, {
        corridorPublicId: input.corridorPublicId,
      });

      for (const waypointPublicId of input.waypointPublicIds) {
        await addJourneyWaypoint(journeyPublicId, {
          waypointPublicId,
        });
      }
    },

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: journeyRouteQueryKeys.detail(
          variables.journeyPublicId,
        ),
      });
    },
  });
}