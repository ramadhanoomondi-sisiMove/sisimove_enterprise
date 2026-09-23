// -----------------------------------------------------------------------------
// sisiMove — useJourneyPricing
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import { getJourneyPricing } from '../api';
import type { JourneyPricing } from '../models/journey-pricing';

// -----------------------------------------------------------------------------
// Query Key
// -----------------------------------------------------------------------------

export const journeyPricingQueryKeys = {
  detail: (journeyPublicId: string) =>
    ['journeys', 'pricing', journeyPublicId] as const,
};

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useJourneyPricing(
  journeyPublicId: string | null | undefined,
) {
  return useQuery<JourneyPricing | null>({
    queryKey: journeyPublicId
      ? journeyPricingQueryKeys.detail(journeyPublicId)
      : journeyPricingQueryKeys.detail(''),

    queryFn: () => getJourneyPricing(journeyPublicId!),

    enabled: Boolean(journeyPublicId),
  });
}