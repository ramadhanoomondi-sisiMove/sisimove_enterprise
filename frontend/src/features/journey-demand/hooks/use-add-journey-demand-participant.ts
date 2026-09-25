// -----------------------------------------------------------------------------
// sisiMove — Add Journey Demand Participant Hook
// -----------------------------------------------------------------------------

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  addJourneyDemandParticipant,
} from '../api/participants/add-journey-demand-participant.api';

import type {
  JourneyDemandParticipantInput,
} from '../schemas';

import {
  JOURNEY_DEMAND_PARTICIPANTS_QUERY_KEY,
} from './use-journey-demand-participants';

export function useAddJourneyDemandParticipant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      journeyDemandPublicId,
      input,
    }: {
      journeyDemandPublicId: string;
      input: JourneyDemandParticipantInput;
    }) =>
      addJourneyDemandParticipant(
        journeyDemandPublicId,
        input,
      ),

    onSuccess: async (
      _data,
      variables,
    ) => {
      await queryClient.invalidateQueries({
        queryKey: [
          ...JOURNEY_DEMAND_PARTICIPANTS_QUERY_KEY,
          variables.journeyDemandPublicId,
        ],
      });
    },
  });
}