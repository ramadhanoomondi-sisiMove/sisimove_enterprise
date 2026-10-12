// -----------------------------------------------------------------------------
// sisiMove — useMarkPassengerNoShow
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Execute the passenger no-show operation.
// - Manage mutation state through React Query.
// - Map the HTTP response into the frontend JourneyBoarding model.
// - Invalidate affected queries after a successful operation.
//
// Architectural rules:
// - No boarding business rules belong in this hook.
// - The API adapter owns HTTP execution.
// - Authentication remains inside AuthenticatedApiClient.
// - The mapper owns transport-to-domain-model conversion.
// - The backend JourneyBoardingAggregate remains authoritative.
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
  markPassengerNoShow,
  type MarkPassengerNoShowParams,
  type MarkPassengerNoShowRequest,
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

export interface MarkPassengerNoShowVariables {
  params: MarkPassengerNoShowParams;
  request?: MarkPassengerNoShowRequest;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Marks a passenger participant as a no-show.
 *
 * The mutation returns the updated frontend JourneyBoarding model rather
 * than exposing the raw HTTP transport response to consuming components.
 */
export function useMarkPassengerNoShow() {
  const queryClient = useQueryClient();

  return useMutation<
    JourneyBoarding,
    Error,
    MarkPassengerNoShowVariables
  >({
    mutationFn: async ({ params, request }) => {
      const response = await markPassengerNoShow(
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
