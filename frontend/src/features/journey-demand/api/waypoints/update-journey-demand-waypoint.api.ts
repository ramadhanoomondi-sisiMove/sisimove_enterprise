// -----------------------------------------------------------------------------
// sisiMove — Update Journey Demand Waypoint API
// -----------------------------------------------------------------------------
//
// Backend:
//     PUT /journey-demands/:journeyDemandPublicId/waypoints/:waypointPublicId
//
// Authentication:
//     Required.
//
// IMPORTANT:
//     The current backend update command supports:
//
//         name
//         latitude
//         longitude
//         sequence
//
//     It does not currently update:
//
//         type
//         pickupRequired
//         dropoffRequired
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

export interface UpdateJourneyDemandWaypointInput {
  name: string;
  latitude: number;
  longitude: number;
  sequence: number;
  correlationId?: string;
  causationId?: string;
}

export async function updateJourneyDemandWaypoint(
  journeyDemandPublicId: string,
  waypointPublicId: string,
  input: UpdateJourneyDemandWaypointInput,
): Promise<void> {
  await authenticatedApiClient.put(
    `/journey-demands/${journeyDemandPublicId}/waypoints/${waypointPublicId}`,
    input,
  );
}