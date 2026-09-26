// -----------------------------------------------------------------------------
// sisiMove — useWithdrawJourneyCompletionConfirmation
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  withdrawJourneyCompletionConfirmation,
  type WithdrawJourneyCompletionConfirmationRequest,
} from '../../api/lifecycle/withdraw-journey-completion-confirmation.api';

import {
  JourneyCompletionMapper,
  type JourneyCompletionMapperInput,
} from '../../mappers/journey-completion.mapper';

import type { JourneyCompletion } from '../../models/journey-completion';

import { journeyCompletionKeys } from '../query-keys/journey-completion.keys';

export function useWithdrawJourneyCompletionConfirmation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      journeyCompletionPublicId,
      confirmationPublicId,
      request,
    }: {
      journeyCompletionPublicId: string;
      confirmationPublicId: string;
      request?: WithdrawJourneyCompletionConfirmationRequest;
    }): Promise<JourneyCompletion> => {
      const response = await withdrawJourneyCompletionConfirmation(
        journeyCompletionPublicId,
        confirmationPublicId,
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
        queryKey: journeyCompletionKeys.confirmations(),
      });
    },
  });
}

export default useWithdrawJourneyCompletionConfirmation;