// -----------------------------------------------------------------------------
// sisiMove — useJourneyWaypoint
// -----------------------------------------------------------------------------
//
// React Query hook for retrieving one waypoint attached to a Journey.
//
// API boundary:
//     GET /api/v1/journeys/:journeyPublicId/waypoints/:waypointPublicId
//
// This hook reads an existing Journey ↔ Waypoint association.
//
// The Journey controller does NOT create waypoint details. A waypoint public
// identifier is attached to a Journey through the mutation endpoint, while
// this hook only retrieves the resulting association.
//
// This hook is responsible for:
// - Executing the authenticated Journey waypoint API.
// - Managing request state and caching through React Query.
// - Mapping the transport response into JourneyWaypoint.
//
// This hook intentionally does NOT:
// - Create or modify waypoint data.
// - Resolve geographic locations.
// - Reorder waypoints.
// - Perform authorization decisions.
// - Format waypoint information for a particular UI.
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import { getJourneyWaypoint } from '../../api/components/waypoints';

import {
  mapJourneyWaypoint,
  type JourneyWaypointApiResponse,
} from '../../mappers';

import type { JourneyWaypoint } from '../../models';

// -----------------------------------------------------------------------------
// Query Key
// -----------------------------------------------------------------------------

/**
 * Stable query-key namespace for an individual Journey waypoint.
 *
 * Both identifiers form part of the cache identity because the same waypoint
 * public identifier can be referenced in different Journey contexts.
 */
export const JOURNEY_WAYPOINT_QUERY_KEY = [
  'journeys',
  'waypoint',
] as const;

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Fetches one waypoint attached to a Journey.
 *
 * The backend remains authoritative for whether the requested waypoint is
 * associated with the specified Journey and whether the caller may access it.
 */
export function useJourneyWaypoint(
  journeyPublicId: string,
  waypointPublicId: string,
) {
  return useQuery<JourneyWaypoint | null, Error>({
    queryKey: [
      ...JOURNEY_WAYPOINT_QUERY_KEY,
      journeyPublicId,
      waypointPublicId,
    ],

    queryFn: async () => {
      const response = await getJourneyWaypoint(
        journeyPublicId,
        waypointPublicId,
      );

      if (response === null) {
        return null;
      }

      return mapJourneyWaypoint(
        response as JourneyWaypointApiResponse,
      );
    },

    enabled:
      Boolean(journeyPublicId) &&
      Boolean(waypointPublicId),
  });
}