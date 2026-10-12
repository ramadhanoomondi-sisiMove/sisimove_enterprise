// -----------------------------------------------------------------------------
// sisiMove — useBoardProvider
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Execute the provider boarding operation.
// - Manage mutation state through the application's query layer.
// - Map the HTTP response into the frontend JourneyBoarding model.
// - Invalidate affected queries after successful boarding.
//
// Architectural rules:
// - The hook owns mutation orchestration only.
// - HTTP execution remains inside the API adapter.
// - Authentication remains inside AuthenticatedApiClient.
// - Response mapping remains inside the mapper.
// - No domain/business rules belong here.
// - The backend aggregate remains authoritative for participant transitions.
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
  boardProvider,
  type BoardProviderParams,
  type BoardProviderRequest,
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

export interface BoardProviderVariables {
  params: BoardProviderParams;
  request?: BoardProviderRequest;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Boards the provider participating in the Journey Boarding.
 *
 * The mutation returns the frontend JourneyBoarding model rather than the
 * raw HTTP transport response.
 */
export function useBoardProvider() {
  const queryClient = useQueryClient();

  return useMutation<
    JourneyBoarding,
    Error,
    BoardProviderVariables
  >({
    mutationFn: async ({ params, request }) => {
      const response = await boardProvider(
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
          queryKey: ['journey-boardings'],
        }),

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
