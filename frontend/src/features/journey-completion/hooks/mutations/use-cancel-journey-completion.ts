// -----------------------------------------------------------------------------
// sisiMove — useCancelJourneyCompletion
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  cancelJourneyCompletion,
  type CancelJourneyCompletionRequest,
} from '../../api/lifecycle/cancel-journey-completion.api';

import {
  JourneyCompletionMapper,
  type JourneyCompletionMapperInput,
} from '../../mappers/journey-completion.mapper';

import type { JourneyCompletion } from '../../models/journey-completion';

import { journeyCompletionKeys } from '../query-keys/journey-completion.keys';

export function useCancelJourneyCompletion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      journeyCompletionPublicId,
      request,
    }: {
      journeyCompletionPublicId: string;
      request?: CancelJourneyCompletionRequest;
    }): Promise<JourneyCompletion> => {
      const response = await cancelJourneyCompletion(
        journeyCompletionPublicId,
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
    },
  });
}

export default useCancelJourneyCompletion;