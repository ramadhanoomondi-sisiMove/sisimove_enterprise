// -----------------------------------------------------------------------------
// sisiMove — Get Journey Demand Capacity API
// -----------------------------------------------------------------------------
//
// Backend:
//     GET /journey-demands/:journeyDemandPublicId/capacity
//
// Authentication:
//     Not required by the current controller.
//
// -----------------------------------------------------------------------------

import { apiClient } from '@/foundation/http';

import type { JourneyDemandCapacity } from '../../models';

export async function getJourneyDemandCapacity(
  journeyDemandPublicId: string,
): Promise<JourneyDemandCapacity> {
  return apiClient.get<JourneyDemandCapacity>(
    `/journey-demands/${journeyDemandPublicId}/capacity`,
  );
}