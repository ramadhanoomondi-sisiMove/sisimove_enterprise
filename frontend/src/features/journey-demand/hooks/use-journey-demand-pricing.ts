// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Pricing Hook
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import {
  getJourneyDemandPricing,
} from '../api/pricing/get-journey-demand-pricing.api';

import type {
  JourneyDemandPricing,
} from '../models';

export const JOURNEY_DEMAND_PRICING_QUERY_KEY = [
  'journey-demand-pricing',
] as const;

export function useJourneyDemandPricing(
  journeyDemandPublicId?: string,
) {
  return useQuery<JourneyDemandPricing>({
    queryKey: [
      ...JOURNEY_DEMAND_PRICING_QUERY_KEY,
      journeyDemandPublicId,
    ],
    queryFn: () =>
      getJourneyDemandPricing(
        journeyDemandPublicId!,
      ),
    enabled: Boolean(journeyDemandPublicId),
  });
}