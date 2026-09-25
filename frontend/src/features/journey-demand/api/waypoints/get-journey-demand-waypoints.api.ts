// -----------------------------------------------------------------------------
// sisiMove — Get Journey Demand Waypoints API
// -----------------------------------------------------------------------------
//
// Backend:
//     GET /journey-demands/:journeyDemandPublicId/waypoints
//
// Authentication:
//     Not required by the current controller.
//
// -----------------------------------------------------------------------------

import { apiClient } from '@/foundation/http';

import type { JourneyDemandWaypoint } from '../../models';

export async function getJourneyDemandWaypoints(
  journeyDemandPublicId: string,
): Promise<JourneyDemandWaypoint[]> {
  return apiClient.get<JourneyDemandWaypoint[]>(
    `/journey-demands/${journeyDemandPublicId}/waypoints`,
  );
}