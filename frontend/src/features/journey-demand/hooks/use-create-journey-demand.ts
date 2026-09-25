// -----------------------------------------------------------------------------
// sisiMove — Create Journey Demand Hook
// -----------------------------------------------------------------------------

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  createJourneyDemand,
} from '../api/create-journey-demand.api';

import type {
  CreateJourneyDemandInput,
} from '../schemas';

import {
  MY_JOURNEY_DEMANDS_QUERY_KEY,
} from './use-my-journey-demands';

export function useCreateJourneyDemand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      input: CreateJourneyDemandInput,
    ) => createJourneyDemand(input),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: MY_JOURNEY_DEMANDS_QUERY_KEY,
      });

      await queryClient.invalidateQueries({
        queryKey: ['journey-demands'],
      });
    },
  });
}