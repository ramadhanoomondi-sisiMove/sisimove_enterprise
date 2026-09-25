// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Capacity Hook
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import {
  getJourneyDemandCapacity,
} from '../api/capacity/get-journey-demand-capacity.api';

import type {
  JourneyDemandCapacity,
} from '../models';

export const JOURNEY_DEMAND_CAPACITY_QUERY_KEY = [
  'journey-demand-capacity',
] as const;

export function useJourneyDemandCapacity(
  journeyDemandPublicId?: string,
) {
  return useQuery<JourneyDemandCapacity>({
    queryKey: [
      ...JOURNEY_DEMAND_CAPACITY_QUERY_KEY,
      journeyDemandPublicId,
    ],
    queryFn: () =>
      getJourneyDemandCapacity(
        journeyDemandPublicId!,
      ),
    enabled: Boolean(journeyDemandPublicId),
  });
}