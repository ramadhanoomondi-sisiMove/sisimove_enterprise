// -----------------------------------------------------------------------------
// sisiMove — useRequestJourneyCompletion
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  requestJourneyCompletion,
  type RequestJourneyCompletionRequest,
} from '../../api/lifecycle/request-journey-completion.api';

import {
  JourneyCompletionMapper,
  type JourneyCompletionMapperInput,
} from '../../mappers/journey-completion.mapper';

import type { JourneyCompletion } from '../../models/journey-completion';

import { journeyCompletionKeys } from '../query-keys/journey-completion.keys';

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useRequestJourneyCompletion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      journeyCompletionPublicId,
      request,
    }: {
      journeyCompletionPublicId: string;
      request?: RequestJourneyCompletionRequest;
    }): Promise<JourneyCompletion> => {
      const response = await requestJourneyCompletion(
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

export default useRequestJourneyCompletion;