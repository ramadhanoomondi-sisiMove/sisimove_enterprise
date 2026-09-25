// -----------------------------------------------------------------------------
// sisiMove — Get Journey Waypoint API
// -----------------------------------------------------------------------------
//
// HTTP adapter for retrieving a single waypoint attached to a Journey.
//
// Backend endpoint:
//
//   GET /api/v1/journeys/:journeyPublicId/waypoints/:waypointPublicId
//
// Architectural boundary:
//
//   UI / Hook
//       │
//       ▼
//   getJourneyWaypoint()
//       │
//       ▼
//   HTTP Client
//       │
//       ▼
//   GET /journeys/:journeyPublicId/waypoints/:waypointPublicId
//
// Responsibilities of this adapter:
//
// - Accept transport-safe public identifiers.
// - Encode identifiers before placing them in the URL path.
// - Issue the HTTP GET request.
// - Return the API response using the frontend transport model.
//
// This adapter does NOT:
//
// - Resolve or construct domain entities.
// - Create value objects.
// - Validate Journey lifecycle rules.
// - Validate waypoint ownership.
// - Access persistence.
// - Perform navigation.
// - Manage React state.
// - Manage query/cache state.
// - Convert missing/error responses into fabricated values.
//
// The backend application/domain layer remains authoritative for all
// Journey/waypoint invariants and authorization decisions.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type { JourneyWaypoint } from '../../../models';

/**
 * Get a single waypoint attached to a Journey.
 *
 * The waypoint is addressed by its public identifier within the context
 * of its parent Journey.
 *
 * The parent Journey identifier and waypoint identifier are both encoded
 * because they are placed directly into the HTTP path.
 *
 * HTTP errors are intentionally allowed to propagate to the caller.
 * The adapter does not reinterpret transport failures as missing data.
 *
 * @param journeyPublicId Public identifier of the Journey.
 * @param waypointPublicId Public identifier of the waypoint.
 * @returns The requested Journey waypoint.
 */
export async function getJourneyWaypoint(
  journeyPublicId: string,
  waypointPublicId: string,
): Promise<JourneyWaypoint> {
  return authenticatedApiClient.get<JourneyWaypoint>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/waypoints/${encodeURIComponent(waypointPublicId)}`,
  );
}