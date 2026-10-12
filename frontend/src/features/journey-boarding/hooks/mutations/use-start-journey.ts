// -----------------------------------------------------------------------------
// sisiMove — useStartJourney
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Execute the Journey Boarding start operation.
// - Manage mutation state through the application's query layer.
// - Map the HTTP response into the frontend JourneyBoarding model.
// - Invalidate affected queries after a successful start.
//
// Architectural rules:
// - The hook owns mutation orchestration only.
// - HTTP execution remains inside the API adapter.
// - Authentication remains inside AuthenticatedApiClient.
// - Response mapping remains inside the mapper.
// - No domain/business rules belong here.
// - The backend aggregate remains authoritative for lifecycle transitions.
// - Public identifiers remain opaque strings.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// React Query
// -----------------------------------------------------------------------------

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

import {
  startJourney,
  type StartJourneyParams,
  type StartJourneyRequest,
} from '../../api';

// -----------------------------------------------------------------------------
// Model
// -----------------------------------------------------------------------------

import type { JourneyBoarding } from '../../models';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

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
 * Starts the Journey associated with the Journey Boarding.
 *
 * The mutation returns the frontend JourneyBoarding model rather than the
 * raw HTTP transport response.
 */
export function useStartJourney() {
  const queryClient = useQueryClient();

  return useMutation<
    JourneyBoarding,
    Error,
    StartJourneyVariables
  >({
    mutationFn: async ({ params, request }) => {
      const response = await startJourney(
        params,
        request,
      );

      return journeyBoardingMapper.toModel({
        publicId: response.publicId,
        journeyId: response.journeyId,
        providerPublicId: response.providerPublicId,
        status: response.status,
        boardingStartedAt: response.boardingStartedAt,
        journeyStartedAt: response.journeyStartedAt,
        cancelledAt: response.cancelledAt,
        version: response.version,
        participants: response.participants,
        events: response.events,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
      });
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
