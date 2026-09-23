// -----------------------------------------------------------------------------
// sisiMove — Add Journey Waypoint API
// -----------------------------------------------------------------------------
//
// Backend:
//     POST /journeys/:journeyPublicId/waypoints
//
// Request:
//     {
//       waypointPublicId: string
//     }
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/foundation/http/authenticated-api-client';

// -----------------------------------------------------------------------------
// Request
// -----------------------------------------------------------------------------

export interface AddJourneyWaypointInput {
  waypointPublicId: string;
}

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export async function addJourneyWaypoint(
  journeyPublicId: string,
  input: AddJourneyWaypointInput,
): Promise<void> {
  await authenticatedApiClient.post<void>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/waypoints`,
    input,
  );
}