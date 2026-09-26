// -----------------------------------------------------------------------------
// sisiMove — useWithdrawJourneyCompletionDispute
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  withdrawJourneyCompletionDispute,
  type WithdrawJourneyCompletionDisputeRequest,
} from '../../api/disputes/withdraw-journey-completion-dispute.api';

import {
  JourneyCompletionMapper,
  type JourneyCompletionMapperInput,
} from '../../mappers/journey-completion.mapper';

import type { JourneyCompletion } from '../../models/journey-completion';

import { journeyCompletionKeys } from '../query-keys/journey-completion.keys';

export function useWithdrawJourneyCompletionDispute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      journeyCompletionPublicId,
      disputePublicId,
      request,
    }: {
      journeyCompletionPublicId: string;
      disputePublicId: string;
      request?: WithdrawJourneyCompletionDisputeRequest;
    }): Promise<JourneyCompletion> => {
      const response = await withdrawJourneyCompletionDispute(
        journeyCompletionPublicId,
        disputePublicId,
        request,
      );

      return JourneyCompletionMapper.fromResponse(
        response as JourneyCompletionMapperInput,
      );
    },

    onSuccess: async (completion) => {
      queryClient.setQueryData(
        journeyCompletionKeys.byId(completion.publicId),
        completion,
      );

      await queryClient.invalidateQueries({
        queryKey: journeyCompletionKeys.lists(),
      });

      await queryClient.invalidateQueries({
        queryKey: journeyCompletionKeys.byJourney(
          completion.journeyPublicId,
        ),
      });

      await queryClient.invalidateQueries({
        queryKey: journeyCompletionKeys.disputes(),
      });
    },
  });
}

export default useWithdrawJourneyCompletionDispute;