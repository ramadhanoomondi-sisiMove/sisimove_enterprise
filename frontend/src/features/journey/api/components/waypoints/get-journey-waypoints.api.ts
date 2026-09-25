// -----------------------------------------------------------------------------
// sisiMove — Get Journey Waypoints API
// -----------------------------------------------------------------------------
//
// HTTP adapter for retrieving all waypoints attached to a Journey.
//
// Backend endpoint:
//
//   GET /api/v1/journeys/:journeyPublicId/waypoints
//
// Architectural boundary:
//
//   UI / Hook
//       │
//       ▼
//   getJourneyWaypoints()
//       │
//       ▼
//   HTTP Client
//       │
//       ▼
//   GET /journeys/:journeyPublicId/waypoints
//
// Responsibilities of this adapter:
//
// - Accept the Journey public identifier.
// - Encode the identifier before placing it in the URL path.
// - Issue the HTTP GET request.
// - Return the API response using the frontend transport model.
//
// This adapter does NOT:
//
// - Construct domain entities.
// - Construct value objects.
// - Validate Journey lifecycle rules.
// - Validate waypoint invariants.
// - Resolve waypoint ownership.
// - Access persistence.
// - Perform navigation.
// - Manage React state.
// - Manage query/cache state.
// - Fabricate missing waypoints.
// - Convert HTTP errors into empty results.
//
// The backend application/domain layer remains authoritative for Journey
// and waypoint rules.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type { JourneyWaypoint } from '../../../models';

/**
 * Get all waypoints attached to a Journey.
 *
 * The Journey is identified by its public identifier. The backend owns
 * waypoint ordering and all waypoint-related invariants.
 *
 * An empty array is a valid successful response when the Journey currently
 * has no waypoints.
 *
 * HTTP errors are intentionally allowed to propagate to the caller.
 * The adapter does not reinterpret transport failures as an empty list.
 *
 * @param journeyPublicId Public identifier of the Journey.
 * @returns Waypoints attached to the Journey.
 */
export async function getJourneyWaypoints(
  journeyPublicId: string,
): Promise<JourneyWaypoint[]> {
  return authenticatedApiClient.get<JourneyWaypoint[]>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/waypoints`,
  );
}