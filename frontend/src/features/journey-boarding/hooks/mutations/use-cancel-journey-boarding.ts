// -----------------------------------------------------------------------------
// sisiMove — useCancelJourneyBoarding
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  cancelJourneyBoarding,
  type CancelJourneyBoardingParams,
  type CancelJourneyBoardingRequest,
} from '../../api';

import type { JourneyBoarding } from '../../models';

import { journeyBoardingMapper } from '../../mappers';

export interface CancelJourneyBoardingVariables {
  params: CancelJourneyBoardingParams;
  request?: CancelJourneyBoardingRequest;
}

export function useCancelJourneyBoarding() {
  const queryClient = useQueryClient();

  return useMutation<
    JourneyBoarding,
    Error,
    CancelJourneyBoardingVariables
  >({
    mutationFn: async ({ params, request }) => {
      const response = await cancelJourneyBoarding(
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
