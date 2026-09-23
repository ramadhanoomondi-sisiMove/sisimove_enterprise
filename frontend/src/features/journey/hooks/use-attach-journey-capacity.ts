import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  attachJourneyCapacity,
  type AttachJourneyCapacityInput,
} from '../api';

import {
  journeyCapacityQueryKeys,
} from './use-journey-capacity';

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useAttachJourneyCapacity() {
  const queryClient =
    useQueryClient();

  return useMutation<
    void,
    Error,
    {
      journeyPublicId: string;
      input: AttachJourneyCapacityInput;
    }
  >({
    // -------------------------------------------------------------------------
    // Mutation function
    // -------------------------------------------------------------------------
    //
    // The Journey public ID identifies the Journey being configured.
    // The input contains only provider-supplied capacity data.
    //
    mutationFn: ({
      journeyPublicId,
      input,
    }) =>
      attachJourneyCapacity(
        journeyPublicId,
        input,
      ),

    // -------------------------------------------------------------------------
    // Cache invalidation
    // -------------------------------------------------------------------------
    //
    // After a successful write, invalidate the persisted Journey capacity so
    // subsequent reads obtain the server-authoritative state.
    //
    onSuccess: (
      _data,
      variables,
    ) => {
      queryClient.invalidateQueries({
        queryKey:
          journeyCapacityQueryKeys.detail(
            variables.journeyPublicId,
          ),
      });
    },
  });
}

