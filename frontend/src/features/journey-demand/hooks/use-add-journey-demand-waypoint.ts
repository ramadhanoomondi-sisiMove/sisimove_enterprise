// -----------------------------------------------------------------------------
// sisiMove — Add Journey Demand Waypoint Hook
// -----------------------------------------------------------------------------

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  addJourneyDemandWaypoint,
} from '../api/waypoints/add-journey-demand-waypoint.api';

import type {
  JourneyDemandWaypointInput,
} from '../schemas';

import {
  JOURNEY_DEMAND_WAYPOINTS_QUERY_KEY,
} from './use-journey-demand-waypoints';

export function useAddJourneyDemandWaypoint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      journeyDemandPublicId,
      input,
    }: {
      journeyDemandPublicId: string;
      input: JourneyDemandWaypointInput;
    }) =>
      addJourneyDemandWaypoint(
        journeyDemandPublicId,
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