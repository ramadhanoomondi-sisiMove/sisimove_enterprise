// -----------------------------------------------------------------------------
// sisiMove — useAttachJourneySchedule
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { attachJourneySchedule } from '../api';
import type { AttachJourneyScheduleInput } from '../api';

import { journeyScheduleQueryKeys } from './use-journey-schedule';

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useAttachJourneySchedule() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    {
      journeyPublicId: string;
      input: AttachJourneyScheduleInput;
    }
  >({
    mutationFn: ({ journeyPublicId, input }) =>
      attachJourneySchedule(journeyPublicId, input),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: journeyScheduleQueryKeys.detail(
          variables.journeyPublicId,
        ),
      });
    },
  });
}