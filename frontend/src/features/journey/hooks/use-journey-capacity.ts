// -----------------------------------------------------------------------------
// sisiMove — useJourneyCapacity
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import { getJourneyCapacity } from '../api';
import type { JourneyCapacity } from '../models/journey-capacity';

// -----------------------------------------------------------------------------
// Query Key
// -----------------------------------------------------------------------------

export const journeyCapacityQueryKeys = {
  detail: (journeyPublicId: string) =>
    ['journeys', 'capacity', journeyPublicId] as const,
};

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useJourneyCapacity(
  journeyPublicId: string | null | undefined,
) {
  return useQuery<JourneyCapacity | null>({
    queryKey: journeyPublicId
      ? journeyCapacityQueryKeys.detail(journeyPublicId)
      : journeyCapacityQueryKeys.detail(''),

    queryFn: () => getJourneyCapacity(journeyPublicId!),

    enabled: Boolean(journeyPublicId),
  });
}