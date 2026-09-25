// -----------------------------------------------------------------------------
// sisiMove — Update Journey Demand Participant Hook
// -----------------------------------------------------------------------------

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  updateJourneyDemandParticipant,
} from '../api/participants/update-journey-demand-participant.api';

import type {
  UpdateJourneyDemandParticipantInput,
} from '../schemas';

import {
  JOURNEY_DEMAND_PARTICIPANTS_QUERY_KEY,
} from './use-journey-demand-participants';

export function useUpdateJourneyDemandParticipant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      journeyDemandPublicId,
      participantPublicId,
      input,
    }: {
      journeyDemandPublicId: string;
      participantPublicId: string;
      input: UpdateJourneyDemandParticipantInput;
    }) =>
      updateJourneyDemandParticipant(
        journeyDemandPublicId,
        participantPublicId,
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