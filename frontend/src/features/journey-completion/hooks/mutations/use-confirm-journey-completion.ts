// -----------------------------------------------------------------------------
// sisiMove — useConfirmJourneyCompletion
// -----------------------------------------------------------------------------
//
// Confirms Journey Completion for the authenticated member.
//
// The backend derives the member identity from the authenticated session.
// Therefore this mutation does NOT accept memberPublicId.
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  confirmJourneyCompletion,
  type ConfirmJourneyCompletionRequest,
} from '../../api/lifecycle/confirm-journey-completion.api';

import {
  JourneyCompletionMapper,
  type JourneyCompletionMapperInput,
} from '../../mappers/journey-completion.mapper';

import type { JourneyCompletion } from '../../models/journey-completion';

import { journeyCompletionKeys } from '../query-keys/journey-completion.keys';

export function useConfirmJourneyCompletion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      journeyCompletionPublicId,
      request,
    }: {
      journeyCompletionPublicId: string;
      request?: ConfirmJourneyCompletionRequest;
    }): Promise<JourneyCompletion> => {
      const response = await confirmJourneyCompletion(
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

      // -----------------------------------------------------------------------
      // Settlement is backend-owned. Confirmation may cause settlement state
      // to change, but the frontend must not orchestrate that transition.
      //
      // The settlement query is therefore invalidated by its resource key,
      // allowing the backend to provide the authoritative result.
      // -----------------------------------------------------------------------

      await queryClient.invalidateQueries({
        queryKey: ['journey-settlement'],
      });
    },
  });
}

export default useConfirmJourneyCompletion;