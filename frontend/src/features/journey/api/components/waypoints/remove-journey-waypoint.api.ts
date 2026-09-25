// -----------------------------------------------------------------------------
// sisiMove — Remove Journey Waypoint API
// -----------------------------------------------------------------------------
//
// HTTP adapter for removing a waypoint from a Journey.
//
// Backend endpoint:
//
//   DELETE /api/v1/journeys/:journeyPublicId/waypoints/:waypointPublicId
//
// No request body is required.
//
// The backend owns validation and lifecycle rules for removing the waypoint
// association.
//
// Architectural boundary:
//
//   UI / Hook
//       │
//       ▼
//   removeJourneyWaypoint()
//       │
//       ▼
//   AuthenticatedApiClient
//       │
//       ▼
//   DELETE /journeys/:journeyPublicId/waypoints/:waypointPublicId
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

/**
 * Remove a waypoint from a Journey.
 *
 * @param journeyPublicId Public identifier of the Journey.
 * @param waypointPublicId Public identifier of the attached waypoint.
 */
export async function removeJourneyWaypoint(
  journeyPublicId: string,
  waypointPublicId: string,
): Promise<void> {
  await authenticatedApiClient.delete<void>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/waypoints/${encodeURIComponent(waypointPublicId)}`,
  );
}