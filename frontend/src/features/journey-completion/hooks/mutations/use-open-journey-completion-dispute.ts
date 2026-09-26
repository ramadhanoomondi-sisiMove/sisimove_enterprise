// -----------------------------------------------------------------------------
// sisiMove — useOpenJourneyCompletionDispute
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  openJourneyCompletionDispute,
  type OpenJourneyCompletionDisputeRequest,
} from '../../api/disputes/open-journey-completion-dispute.api';

import {
  JourneyCompletionMapper,
  type JourneyCompletionMapperInput,
} from '../../mappers/journey-completion.mapper';

import type { JourneyCompletion } from '../../models/journey-completion';

import { journeyCompletionKeys } from '../query-keys/journey-completion.keys';

export function useOpenJourneyCompletionDispute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      journeyCompletionPublicId,
      request,
    }: {
      journeyCompletionPublicId: string;
      request: OpenJourneyCompletionDisputeRequest;
    }): Promise<JourneyCompletion> => {
      const response = await openJourneyCompletionDispute(
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

      await queryClient.invalidateQueries({
        queryKey: journeyCompletionKeys.disputes(),
      });
    },
  });
}

export default useOpenJourneyCompletionDispute;