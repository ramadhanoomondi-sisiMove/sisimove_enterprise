// -----------------------------------------------------------------------------
// sisiMove — Get Journey Demand Corridor API
// -----------------------------------------------------------------------------
//
// Backend:
//     GET /journey-demands/:journeyDemandPublicId/corridor
//
// Authentication:
//     Not required by the current controller.
//
// -----------------------------------------------------------------------------

import { apiClient } from '@/foundation/http';

import type { JourneyDemandCorridor } from '../../models';

export async function getJourneyDemandCorridor(
  journeyDemandPublicId: string,
): Promise<JourneyDemandCorridor> {
  return apiClient.get<JourneyDemandCorridor>(
    `/journey-demands/${journeyDemandPublicId}/corridor`,
  );
}