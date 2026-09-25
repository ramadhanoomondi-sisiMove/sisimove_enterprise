// -----------------------------------------------------------------------------
// sisiMove — useJourneyPricing

import { useQuery } from '@tanstack/react-query';

import { getJourneyPricing } from '../../api/components/pricing';

import {
  mapJourneyPricing,
  type JourneyPricingApiResponse,
} from '../../mappers';

import type { JourneyPricing } from '../../models';

// -----------------------------------------------------------------------------
// Query Key
// -----------------------------------------------------------------------------

/**
 * Stable query-key namespace for the pricing attached to a Journey.
 */
export const JOURNEY_PRICING_QUERY_KEY = [
  'journeys',
  'pricing',
] as const;

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Fetches the pricing currently attached to a Journey.
 *
 * A Journey may exist without pricing, so the result can be null.
 */
export function useJourneyPricing(
  journeyPublicId: string,
) {
  return useQuery<JourneyPricing | null, Error>({
    queryKey: [
      ...JOURNEY_PRICING_QUERY_KEY,
      journeyPublicId,
    ],

    queryFn: async () => {
      const response = await getJourneyPricing(
        journeyPublicId,
      );

      if (response === null) {
        return null;
      }

      return mapJourneyPricing(
        response as JourneyPricingApiResponse,
      );
    },

    enabled: Boolean(journeyPublicId),
  });
}