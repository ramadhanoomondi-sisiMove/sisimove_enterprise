// -----------------------------------------------------------------------------
// sisiMove — usePublishJourney
// -----------------------------------------------------------------------------
//
// Publishes a Journey after the Journey creation workflow has been completed.
//
// Publication remains a backend/domain decision. The frontend only invokes
// the lifecycle command.
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  publishJourney,
  type PublishJourneyInput,
} from '../api';

import { journeyQueryKeys } from './use-journey';
import { myJourneysQueryKey } from './use-my-journeys';

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function usePublishJourney() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    {
      journeyPublicId: string;
      input?: PublishJourneyInput;
    }
  >({
    mutationFn: ({ journeyPublicId, input }) =>
      publishJourney(
        journeyPublicId,
        input ?? {},
      ),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: myJourneysQueryKey,
      });

      queryClient.invalidateQueries({
        queryKey: journeyQueryKeys.detail(
          variables.journeyPublicId,
        ),
      });
    },
  });
}