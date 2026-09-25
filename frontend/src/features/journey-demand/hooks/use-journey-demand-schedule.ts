// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Schedule Hook
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import {
  getJourneyDemandSchedule,
} from '../api/schedule/get-journey-demand-schedule.api';

import type {
  JourneyDemandSchedule,
} from '../models';

export const JOURNEY_DEMAND_SCHEDULE_QUERY_KEY = [
  'journey-demand-schedule',
] as const;

export function useJourneyDemandSchedule(
  journeyDemandPublicId?: string,
) {
  return useQuery<JourneyDemandSchedule>({
    queryKey: [
      ...JOURNEY_DEMAND_SCHEDULE_QUERY_KEY,
      journeyDemandPublicId,
    ],
    queryFn: () =>
      getJourneyDemandSchedule(
        journeyDemandPublicId!,
      ),
    enabled: Boolean(journeyDemandPublicId),
  });
}