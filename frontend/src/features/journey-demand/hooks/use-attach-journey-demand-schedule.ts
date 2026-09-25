// -----------------------------------------------------------------------------
// sisiMove — Attach Journey Demand Schedule Hook
// -----------------------------------------------------------------------------

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  attachJourneyDemandSchedule,
} from '../api/schedule/attach-journey-demand-schedule.api';

import type {
  JourneyDemandScheduleInput,
} from '../schemas';

import {
  JOURNEY_DEMAND_SCHEDULE_QUERY_KEY,
} from './use-journey-demand-schedule';

export function useAttachJourneyDemandSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      journeyDemandPublicId,
      input,
    }: {
      journeyDemandPublicId: string;
      input: JourneyDemandScheduleInput;
    }) =>
      attachJourneyDemandSchedule(
        journeyDemandPublicId,
        input,
      ),

    onSuccess: async (
      _data,
      variables,
    ) => {
      await queryClient.invalidateQueries({
        queryKey: [
          ...JOURNEY_DEMAND_SCHEDULE_QUERY_KEY,
          variables.journeyDemandPublicId,
        ],
      });
    },
  });
}