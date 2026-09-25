// -----------------------------------------------------------------------------
// sisiMove — Attach Journey Demand Capacity Hook
// -----------------------------------------------------------------------------

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  attachJourneyDemandCapacity,
} from '../api/capacity/attach-journey-demand-capacity.api';

import type {
  JourneyDemandCapacityInput,
} from '../schemas';

import {
  JOURNEY_DEMAND_CAPACITY_QUERY_KEY,
} from './use-journey-demand-capacity';

export function useAttachJourneyDemandCapacity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      journeyDemandPublicId,
      input,
    }: {
      journeyDemandPublicId: string;
      input: JourneyDemandCapacityInput;
    }) =>
      attachJourneyDemandCapacity(
        journeyDemandPublicId,
        input,
      ),

    onSuccess: async (
      _data,
      variables,
    ) => {
      await queryClient.invalidateQueries({
        queryKey: [
          ...JOURNEY_DEMAND_CAPACITY_QUERY_KEY,
          variables.journeyDemandPublicId,
        ],
      });
    },
  });
}