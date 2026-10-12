// -----------------------------------------------------------------------------
// sisiMove — useCreateJourneyBoarding
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Execute Journey Boarding creation.
// - Manage mutation state through React Query.
// - Map the HTTP response into the frontend JourneyBoarding model.
// - Invalidate affected queries after successful creation.
//
// Architectural rules:
// - The hook owns mutation orchestration only.
// - HTTP execution remains inside the API adapter.
// - Authentication remains inside AuthenticatedApiClient.
// - Response mapping remains inside the mapper.
// - No domain/business rules belong here.
// - Public identifiers remain opaque strings.
// - The backend aggregate remains authoritative for creation rules.
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
  createJourneyBoarding,
  type CreateJourneyBoardingRequest,
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
// Hook
// -----------------------------------------------------------------------------

/**
 * Creates a Journey Boarding.
 *
 * The mutation returns the frontend JourneyBoarding model rather than the
 * raw HTTP transport response.
 */
export function useCreateJourneyBoarding() {
  const queryClient = useQueryClient();

  return useMutation<
    JourneyBoarding,
    Error,
    CreateJourneyBoardingRequest
  >({
    mutationFn: async (request) => {
      const response = await createJourneyBoarding(request);

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
        // Refresh Journey Boarding lists.
        queryClient.invalidateQueries({
          queryKey: ['journey-boardings'],
        }),

        // Refresh the newly created boarding's detail view, if mounted.
        queryClient.invalidateQueries({
          queryKey: [
            'journey-boardings',
            'detail',
            boarding.publicId,
          ],
        }),

        // Refresh views associated with this journey.
        queryClient.invalidateQueries({
          queryKey: [
            'journey-boardings',
            'journey',
            boarding.journeyId,
          ],
        }),
      ]);
    },
  });
}
