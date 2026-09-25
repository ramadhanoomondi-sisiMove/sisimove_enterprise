// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Hook
// -----------------------------------------------------------------------------
//
// Public marketplace query for Journey Demand supply/need discovery.
//
// Responsibilities:
// - Fetch public Journey Demand listings.
// - Manage TanStack Query caching.
// - Expose loading/error state to marketplace components.
//
// This hook intentionally uses the public API adapter.
// It does not require authentication.
//
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import {
  getJourneyDemands,
} from '../api/get-journey-demands.api';

import type {
  JourneyDemand,
} from '../models';

export interface UseJourneyDemandsParams {
  from?: string;
  to?: string;
  date?: string;
  limit?: number;
  offset?: number;
}

export const JOURNEY_DEMANDS_QUERY_KEY = [
  'journey-demands',
] as const;

export function useJourneyDemands(
  params: UseJourneyDemandsParams = {},
) {
  return useQuery<JourneyDemand[]>({
    queryKey: [
      ...JOURNEY_DEMANDS_QUERY_KEY,
      params,
    ],
    queryFn: () => getJourneyDemands(params),
  });
}