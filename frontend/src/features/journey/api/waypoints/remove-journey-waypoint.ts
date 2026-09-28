// src/features/journey/api/waypoints/remove-journey-waypoint.ts

// -----------------------------------------------------------------------------
// sisiMove — Remove Journey Waypoint API
// -----------------------------------------------------------------------------
//
// Mirrors:
//
//   DELETE /journeys/:journeyPublicId/waypoints/:waypointPublicId
//
// The waypoint public identifier comes from the backend Journey projection.
// The frontend uses it only to identify which existing waypoint should be
// removed.
//
// The Journey aggregate owns the removal operation and its invariants.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from "@/features/authentication/http/authenticated-api-client";
import type { RequestOptions } from "@/foundation/http";

/**
 * Removes an existing waypoint from a Journey.
 *
 * Backend:
 *   DELETE /journeys/:journeyPublicId/waypoints/:waypointPublicId
 *
 * Request body:
 *   none
 *
 * Response:
 *   no response body
 *
 * The resulting Journey state should be obtained through the canonical
 * authenticated Journey query rather than fabricated locally.
 */
export async function removeJourneyWaypoint(
  journeyPublicId: string,
  waypointPublicId: string,
  options: RequestOptions = {},
): Promise<void> {
  await authenticatedApiClient.delete<void>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/waypoints/${encodeURIComponent(waypointPublicId)}`,
    options,
  );
}