// -----------------------------------------------------------------------------
// sisiMove — useCreateJourneyCompletion
// -----------------------------------------------------------------------------
//
// Mutation hook for creating a Journey Completion.
//
// Responsibilities:
// - call the backend create endpoint;
// - map the aggregate response into the frontend JourneyCompletion model;
// - invalidate/refetch affected Journey Completion queries.
//
// The backend remains the owner of completion lifecycle and authorization.
// The frontend only submits the command and synchronizes its server-state
// cache.
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  createJourneyCompletion,
  type CreateJourneyCompletionRequest,
} from '../../api/lifecycle/create-journey-completion.api';

import {
  JourneyCompletionMapper,
  type JourneyCompletionMapperInput,
} from '../../mappers/journey-completion.mapper';

import type { JourneyCompletion } from '../../models/journey-completion';

import { journeyCompletionKeys } from '../query-keys/journey-completion.keys';

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useCreateJourneyCompletion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      request: CreateJourneyCompletionRequest,
    ): Promise<JourneyCompletion> => {
      const response = await createJourneyCompletion(request);

      return JourneyCompletionMapper.fromResponse(
        response as JourneyCompletionMapperInput,
      );
    },

    onSuccess: async (completion) => {
      // -----------------------------------------------------------------------
      // Seed the newly created aggregate into its canonical detail cache.
      // -----------------------------------------------------------------------

      queryClient.setQueryData(
        journeyCompletionKeys.byId(completion.publicId),
        completion,
      );

      // -----------------------------------------------------------------------
      // Existing list/by-journey queries may now be stale.
      // Backend remains the source of truth, so invalidate rather than
      // constructing client-side list state.
      // -----------------------------------------------------------------------

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

export default useCreateJourneyCompletion;