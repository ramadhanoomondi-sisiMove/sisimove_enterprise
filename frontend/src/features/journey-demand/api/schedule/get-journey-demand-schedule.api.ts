// -----------------------------------------------------------------------------
// sisiMove — Get Journey Demand Schedule API
// -----------------------------------------------------------------------------
//
// Backend:
//     GET /journey-demands/:journeyDemandPublicId/schedule
//
// Authentication:
//     Not required by the current controller.
//
// -----------------------------------------------------------------------------

import { apiClient } from '@/foundation/http';

import type { JourneyDemandSchedule } from '../../models';

export async function getJourneyDemandSchedule(
  journeyDemandPublicId: string,
): Promise<JourneyDemandSchedule> {
  return apiClient.get<JourneyDemandSchedule>(
    `/journey-demands/${journeyDemandPublicId}/schedule`,
  );
}