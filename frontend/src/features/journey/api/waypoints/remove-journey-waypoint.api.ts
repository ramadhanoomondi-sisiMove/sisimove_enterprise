// -----------------------------------------------------------------------------
// sisiMove — Remove Journey Waypoint API
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/foundation/http/authenticated-api-client';

export async function removeJourneyWaypoint(
  journeyPublicId: string,
  waypointPublicId: string,
): Promise<void> {
  await authenticatedApiClient.delete<void>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/waypoints/${encodeURIComponent(waypointPublicId)}`,
  );
}