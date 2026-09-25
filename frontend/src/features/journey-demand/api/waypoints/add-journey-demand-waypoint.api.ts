// -----------------------------------------------------------------------------
// sisiMove — Add Journey Demand Waypoint API
// -----------------------------------------------------------------------------
//
// Backend:
//     POST /journey-demands/:journeyDemandPublicId/waypoints
//
// Authentication:
//     Required.
//
// IMPORTANT:
//     The current backend AddJourneyDemandWaypointDto accepts:
//
//         type
//         sequence
//         name
//         latitude
//         longitude
//         correlationId
//         causationId
//
//     pickupRequired/dropoffRequired are deliberately not sent because the
//     current controller does not pass those fields into the command.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type { JourneyDemandWaypointInput } from '../../schemas';

export async function addJourneyDemandWaypoint(
  journeyDemandPublicId: string,
  input: JourneyDemandWaypointInput,
): Promise<void> {
  await authenticatedApiClient.post(
    `/journey-demands/${journeyDemandPublicId}/waypoints`,
    input,
  );
}