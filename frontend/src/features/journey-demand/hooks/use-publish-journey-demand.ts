// -----------------------------------------------------------------------------
// sisiMove — Publish Journey Demand Hook
// -----------------------------------------------------------------------------

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  publishJourneyDemand,
} from '../api/publish-journey-demand.api';

import {
  MY_JOURNEY_DEMANDS_QUERY_KEY,
} from './use-my-journey-demands';

import {
  JOURNEY_DEMAND_QUERY_KEY,
} from './use-journey-demand';

export interface PublishJourneyDemandInput {
  correlationId?: string;
  causationId?: string;
}

export function usePublishJourneyDemand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      journeyDemandPublicId,
      input,
    }: {
      journeyDemandPublicId: string;
      input?: PublishJourneyDemandInput;
    }) =>
      publishJourneyDemand(
        journeyDemandPublicId,
        input ?? {},
      ),

    onSuccess: async (
      _data,
      variables,
    ) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: MY_JOURNEY_DEMANDS_QUERY_KEY,
        }),

        queryClient.invalidateQueries({
          queryKey: JOURNEY_DEMAND_QUERY_KEY,
        }),

        queryClient.invalidateQueries({
          queryKey: ['journey-demands'],
        }),
      ]);

      // Keep the specific demand immediately fresh.
      await queryClient.invalidateQueries({
        queryKey: [
          ...JOURNEY_DEMAND_QUERY_KEY,
          variables.journeyDemandPublicId,
        ],
      });
    },
  });
}