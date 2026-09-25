// -----------------------------------------------------------------------------
// sisiMove — Get Journey Demand Pricing API
// -----------------------------------------------------------------------------
//
// Backend:
//     GET /journey-demands/:journeyDemandPublicId/pricing
//
// Authentication:
//     Not required by the current controller.
//
// -----------------------------------------------------------------------------

import { apiClient } from '@/foundation/http';

import type { JourneyDemandPricing } from '../../models';

export async function getJourneyDemandPricing(
  journeyDemandPublicId: string,
): Promise<JourneyDemandPricing> {
  return apiClient.get<JourneyDemandPricing>(
    `/journey-demands/${journeyDemandPublicId}/pricing`,
  );
}