// -----------------------------------------------------------------------------
// sisiMove — useAttachJourneyVehicle
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  attachJourneyVehicle,
  type AttachJourneyVehicleInput,
} from '../api';

import { journeyVehicleQueryKeys } from './use-journey-vehicle';

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useAttachJourneyVehicle() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    {
      journeyPublicId: string;
      input: AttachJourneyVehicleInput;
    }
  >({
    mutationFn: ({ journeyPublicId, input }) =>
      attachJourneyVehicle(journeyPublicId, input),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: journeyVehicleQueryKeys.detail(
          variables.journeyPublicId,
        ),
      });
    },
  });
}