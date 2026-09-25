// -----------------------------------------------------------------------------
// sisiMove — Withdraw Journey Demand Participant Hook
// -----------------------------------------------------------------------------

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  withdrawJourneyDemandParticipant,
} from '../api/participants/withdraw-journey-demand-participant.api';

import {
  JOURNEY_DEMAND_PARTICIPANTS_QUERY_KEY,
} from './use-journey-demand-participants';

export interface WithdrawJourneyDemandParticipantInput {
  correlationId?: string;
  causationId?: string;
}

export function useWithdrawJourneyDemandParticipant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      journeyDemandPublicId,
      participantPublicId,
      input,
    }: {
      journeyDemandPublicId: string;
      participantPublicId: string;
      input?: WithdrawJourneyDemandParticipantInput;
    }) =>
      withdrawJourneyDemandParticipant(
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