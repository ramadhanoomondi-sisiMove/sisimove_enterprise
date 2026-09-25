// -----------------------------------------------------------------------------
// sisiMove — Attach Journey Demand Corridor Hook
// -----------------------------------------------------------------------------

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  attachJourneyDemandCorridor,
} from '../api/corridor/attach-journey-demand-corridor.api';

import type {
  JourneyDemandRouteInput,
} from '../schemas';

import {
  JOURNEY_DEMAND_CORRIDOR_QUERY_KEY,
} from './use-journey-demand-corridor';

import {
  JOURNEY_DEMAND_QUERY_KEY,
} from './use-journey-demand';

export function useAttachJourneyDemandCorridor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      journeyDemandPublicId,
      input,
    }: {
      journeyDemandPublicId: string;
      input: JourneyDemandRouteInput;
    }) =>
      attachJourneyDemandCorridor(
        journeyDemandPublicId,
        input,
      ),

    onSuccess: async (
      _data,
      variables,
    ) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [
            ...JOURNEY_DEMAND_CORRIDOR_QUERY_KEY,
            variables.journeyDemandPublicId,
          ],
        }),

        queryClient.invalidateQueries({
          queryKey: [
            ...JOURNEY_DEMAND_QUERY_KEY,
            variables.journeyDemandPublicId,
          ],
        }),
      ]);
    },
  });
}