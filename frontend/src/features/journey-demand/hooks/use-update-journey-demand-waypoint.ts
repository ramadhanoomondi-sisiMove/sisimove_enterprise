// -----------------------------------------------------------------------------
// sisiMove — Update Journey Demand Waypoint Hook
// -----------------------------------------------------------------------------

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  updateJourneyDemandWaypoint,
} from '../api/waypoints/update-journey-demand-waypoint.api';

import type {
  UpdateJourneyDemandWaypointInput,
} from '../schemas';

import {
  JOURNEY_DEMAND_WAYPOINTS_QUERY_KEY,
} from './use-journey-demand-waypoints';

export function useUpdateJourneyDemandWaypoint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      journeyDemandPublicId,
      waypointPublicId,
      input,
    }: {
      journeyDemandPublicId: string;
      waypointPublicId: string;
      input: UpdateJourneyDemandWaypointInput;
    }) =>
      updateJourneyDemandWaypoint(
        journeyDemandPublicId,
        waypointPublicId,
        input,
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