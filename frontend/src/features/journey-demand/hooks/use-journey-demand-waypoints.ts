// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Waypoints Hook
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import {
  getJourneyDemandWaypoints,
} from '../api/waypoints/get-journey-demand-waypoints.api';

import type {
  JourneyDemandWaypoint,
} from '../models';

export const JOURNEY_DEMAND_WAYPOINTS_QUERY_KEY = [
  'journey-demand-waypoints',
] as const;

export function useJourneyDemandWaypoints(
  journeyDemandPublicId?: string,
) {
  return useQuery<JourneyDemandWaypoint[]>({
    queryKey: [
      ...JOURNEY_DEMAND_WAYPOINTS_QUERY_KEY,
      journeyDemandPublicId,
    ],
    queryFn: () =>
      getJourneyDemandWaypoints(
        journeyDemandPublicId!,
      ),
    enabled: Boolean(journeyDemandPublicId),
  });
}