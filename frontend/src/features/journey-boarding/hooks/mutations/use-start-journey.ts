
// -----------------------------------------------------------------------------
// sisiMove — useStartJourney
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Execute the Journey Boarding start operation.
// - Manage mutation state through React Query.
// - Map the HTTP response into the frontend JourneyBoarding model.
// - Invalidate affected queries after a successful start.
//
// Architectural rules:
// - The hook owns mutation orchestration only.
// - HTTP execution remains inside the API adapter.
// - Authentication remains inside AuthenticatedApiClient.
// - Response mapping remains inside the mapper.
// - No domain/business rules belong here.
// - The backend remains authoritative for lifecycle transitions.
// - Public identifiers remain opaque strings.
// -----------------------------------------------------------------------------

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  startJourney,
  type StartJourneyParams,
  type StartJourneyRequest,
} from '../../api';

import type { JourneyBoarding } from '../../models';

import { journeyBoardingMapper } from '../../mappers';

// -----------------------------------------------------------------------------
// Variables
// -----------------------------------------------------------------------------

export interface StartJourneyVariables {
  params: StartJourneyParams;
  request?: StartJourneyRequest;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Starts the Journey associated with a Journey Boarding.
 *
 * The mutation returns the frontend JourneyBoarding model rather than
 * the raw HTTP transport response.
 */
export function useStartJourney() {
  const queryClient = useQueryClient();

  return useMutation<
    JourneyBoarding,
    Error,
    StartJourneyVariables
  >({
    mutationFn: async ({ params, request }) => {
      const response = await startJourney(params, request);

      return journeyBoardingMapper.toModel(response);
    },

    onSuccess: async (boarding) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [
            'journey-boardings',
            'detail',
            boarding.publicId,
          ],
        }),

        queryClient.invalidateQueries({
          queryKey: [
            'journey-boardings',
            'journey',
            boarding.journeyId,
          ],
        }),

        queryClient.invalidateQueries({
          queryKey: [
            'journey-boardings',
            'participants',
            boarding.publicId,
          ],
        }),
      ]);
    },
  });
}
