// -----------------------------------------------------------------------------
// sisiMove — useJourneySchedule
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import { getJourneySchedule } from '../api';
import type { JourneySchedule } from '../models/journey-schedule';

// -----------------------------------------------------------------------------
// Query Key
// -----------------------------------------------------------------------------

export const journeyScheduleQueryKeys = {
  detail: (journeyPublicId: string) =>
    ['journeys', 'schedule', journeyPublicId] as const,
};

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useJourneySchedule(
  journeyPublicId: string | null | undefined,
) {
  return useQuery<JourneySchedule | null>({
    queryKey: journeyPublicId
      ? journeyScheduleQueryKeys.detail(journeyPublicId)
      : journeyScheduleQueryKeys.detail(''),

    queryFn: () => getJourneySchedule(journeyPublicId!),

    enabled: Boolean(journeyPublicId),
  });
}