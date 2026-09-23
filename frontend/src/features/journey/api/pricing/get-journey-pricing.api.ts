// -----------------------------------------------------------------------------
// sisiMove — Get Journey Pricing API
// -----------------------------------------------------------------------------

import { apiClient } from '@/foundation/http';

import type { JourneyPricing } from '../../models/journey-pricing';

export async function getJourneyPricing(
  journeyPublicId: string,
): Promise<JourneyPricing | null> {
  return apiClient.get<JourneyPricing | null>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/pricing`,
  );
}