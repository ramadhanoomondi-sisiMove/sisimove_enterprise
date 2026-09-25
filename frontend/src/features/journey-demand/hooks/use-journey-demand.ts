// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Detail Hook
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import {
  getJourneyDemand,
} from '../api/get-journey-demand.api';

import type {
  JourneyDemand,
} from '../models';

export const JOURNEY_DEMAND_QUERY_KEY = [
  'journey-demand',
] as const;

export function useJourneyDemand(
  journeyDemandPublicId?: string,
) {
  return useQuery<JourneyDemand>({
    queryKey: [
      ...JOURNEY_DEMAND_QUERY_KEY,
      journeyDemandPublicId,
    ],
    queryFn: () =>
      getJourneyDemand(
        journeyDemandPublicId!,
      ),
    enabled: Boolean(journeyDemandPublicId),
  });
}