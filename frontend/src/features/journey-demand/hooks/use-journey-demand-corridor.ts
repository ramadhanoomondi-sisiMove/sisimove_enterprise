// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Corridor Hook
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import {
  getJourneyDemandCorridor,
} from '../api/corridor/get-journey-demand-corridor.api';

import type {
  JourneyDemandCorridor,
} from '../models';

export const JOURNEY_DEMAND_CORRIDOR_QUERY_KEY = [
  'journey-demand-corridor',
] as const;

export function useJourneyDemandCorridor(
  journeyDemandPublicId?: string,
) {
  return useQuery<JourneyDemandCorridor>({
    queryKey: [
      ...JOURNEY_DEMAND_CORRIDOR_QUERY_KEY,
      journeyDemandPublicId,
    ],
    queryFn: () =>
      getJourneyDemandCorridor(
        journeyDemandPublicId!,
      ),
    enabled: Boolean(journeyDemandPublicId),
  });
}