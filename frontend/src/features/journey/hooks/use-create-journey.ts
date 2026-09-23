// -----------------------------------------------------------------------------
// sisiMove — useCreateJourney
// -----------------------------------------------------------------------------
//
// Creates a new Journey aggregate.
//
// The provider identity is NOT supplied by the frontend. The backend derives
// the authenticated provider from the current session.
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createJourney } from '../api';
import type { Journey } from '../models/journey';
import type { CreateJourneyInput } from '../schemas/create-journey.schema';

import { myJourneysQueryKey } from './use-my-journeys';
import { journeyQueryKeys } from './use-journey';

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useCreateJourney() {
  const queryClient = useQueryClient();

  return useMutation<Journey, Error, CreateJourneyInput>({
    mutationFn: createJourney,

    onSuccess: (journey) => {
      queryClient.invalidateQueries({
        queryKey: myJourneysQueryKey,
      });

      queryClient.setQueryData(
        journeyQueryKeys.detail(journey.publicId),
        journey,
      );
    },
  });
}