
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  boardPassenger,
  type BoardPassengerParams,
  type BoardPassengerRequest,
} from '../../api';

import type { JourneyBoarding } from '../../models';
import { journeyBoardingMapper } from '../../mappers';

export interface BoardPassengerVariables {
  params: BoardPassengerParams;
  request?: BoardPassengerRequest;
}

export function useBoardPassenger() {
  const queryClient = useQueryClient();

  return useMutation<
    JourneyBoarding,
    Error,
    BoardPassengerVariables
  >({
    mutationFn: async ({ params, request }) => {
      const response = await boardPassenger(params, request);

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
      await queryClient.invalidateQueries({
        queryKey: [
          'journey-boardings',
          'journey',
          boarding.journeyId,
        ],
      });
    },
  });
}
