// -----------------------------------------------------------------------------
// sisiMove — Remove Journey Demand Waypoint API
// -----------------------------------------------------------------------------
//
// Backend:
//     DELETE /journey-demands/:journeyDemandPublicId/waypoints/:waypointPublicId
//
// Authentication:
//     Required.
//
// IMPORTANT:
//     The current backend expects RemoveJourneyDemandWaypointDto through
//     @Body(). The current AuthenticatedApiClient deliberately does not support
//     DELETE request bodies.
//
//     This adapter therefore sends the DELETE request without a body.
//     If correlationId / causationId are required by the backend DTO, the
//     HTTP client contract should be extended before this operation is used.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

export interface RemoveJourneyDemandWaypointInput {
  correlationId?: string;
  causationId?: string;
}

export async function removeJourneyDemandWaypoint(
  journeyDemandPublicId: string,
  waypointPublicId: string,
  _input: RemoveJourneyDemandWaypointInput = {},
): Promise<void> {
  await authenticatedApiClient.delete(
    `/journey-demands/${journeyDemandPublicId}/waypoints/${waypointPublicId}`,
  );
}