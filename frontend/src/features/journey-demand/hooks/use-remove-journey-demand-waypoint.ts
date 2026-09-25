// -----------------------------------------------------------------------------
// sisiMove — Remove Journey Demand Waypoint Hook
// -----------------------------------------------------------------------------

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  removeJourneyDemandWaypoint,
} from '../api/waypoints/remove-journey-demand-waypoint.api';

import {
  JOURNEY_DEMAND_WAYPOINTS_QUERY_KEY,
} from './use-journey-demand-waypoints';

export interface RemoveJourneyDemandWaypointInput {
  correlationId?: string;
  causationId?: string;
}

export function useRemoveJourneyDemandWaypoint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      journeyDemandPublicId,
      waypointPublicId,
      input,
    }: {
      journeyDemandPublicId: string;
      waypointPublicId: string;
      input?: RemoveJourneyDemandWaypointInput;
    }) =>
      removeJourneyDemandWaypoint(
        journeyDemandPublicId,
        waypointPublicId,
        input ?? {},
      ),

    onSuccess: async (
      _data,
      variables,
    ) => {
      await queryClient.invalidateQueries({
        queryKey: [
          ...JOURNEY_DEMAND_WAYPOINTS_QUERY_KEY,
          variables.journeyDemandPublicId,
        ],
      });
    },
  });
}