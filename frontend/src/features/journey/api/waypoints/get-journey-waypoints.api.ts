// -----------------------------------------------------------------------------
// sisiMove — Get Journey Waypoints API
// -----------------------------------------------------------------------------

import { apiClient } from '@/foundation/http';

import type { JourneyWaypoint } from '../../models/journey-waypoint';

export async function getJourneyWaypoints(
  journeyPublicId: string,
): Promise<readonly JourneyWaypoint[]> {
  return apiClient.get<readonly JourneyWaypoint[]>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/waypoints`,
  );
}