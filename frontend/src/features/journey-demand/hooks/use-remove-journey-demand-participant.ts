// -----------------------------------------------------------------------------
// sisiMove — Remove Journey Demand Participant Hook
// -----------------------------------------------------------------------------

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  removeJourneyDemandParticipant,
} from '../api/participants/remove-journey-demand-participant.api';

export interface RemoveJourneyDemandParticipantInput {
  correlationId?: string;
  causationId?: string;
}

export const JOURNEY_DEMAND_PARTICIPANTS_QUERY_KEY = [
  'journey-demand-participants',
] as const;

export function useRemoveJourneyDemandParticipant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      journeyDemandPublicId,
      participantPublicId,
      input,
    }: {
      journeyDemandPublicId: string;
      participantPublicId: string;
      input?: RemoveJourneyDemandParticipantInput;
    }) =>
      removeJourneyDemandParticipant(
        journeyDemandPublicId,
        participantPublicId,
        input ?? {},
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