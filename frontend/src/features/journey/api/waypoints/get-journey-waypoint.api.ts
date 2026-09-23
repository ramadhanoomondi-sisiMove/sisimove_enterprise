// -----------------------------------------------------------------------------
// sisiMove — Get Journey Waypoint API
// -----------------------------------------------------------------------------

import { apiClient } from '@/foundation/http/authenticated-api-client';

import type { JourneyWaypoint } from '../../models/journey-waypoint';

export async function getJourneyWaypoint(
  journeyPublicId: string,
  waypointPublicId: string,
): Promise<JourneyWaypoint | null> {
  return apiClient.get<JourneyWaypoint | null>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/waypoints/${encodeURIComponent(waypointPublicId)}`,
  );
}