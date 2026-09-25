// -----------------------------------------------------------------------------
// sisiMove — My Journey Demands Hook
// -----------------------------------------------------------------------------
//
// Authenticated owner projection.
//
// The requester/member identity is intentionally NOT accepted from the
// component. The backend derives ownership from the authenticated session.
//
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import {
  getMyJourneyDemands,
} from '../api/get-my-journey-demands.api';

import type {
  JourneyDemand,
} from '../models';

export interface UseMyJourneyDemandsParams {
  limit?: number;
  offset?: number;
}

export const MY_JOURNEY_DEMANDS_QUERY_KEY = [
  'my-journey-demands',
] as const;

export function useMyJourneyDemands(
  params: UseMyJourneyDemandsParams = {},
) {
  return useQuery<JourneyDemand[]>({
    queryKey: [
      ...MY_JOURNEY_DEMANDS_QUERY_KEY,
      params,
    ],
    queryFn: () => getMyJourneyDemands(params),
  });
}