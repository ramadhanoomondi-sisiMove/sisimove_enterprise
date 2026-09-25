// -----------------------------------------------------------------------------
// sisiMove — useJourneyWaypoints
// -----------------------------------------------------------------------------
//
// React Query hook for retrieving the waypoints attached to a Journey.
//
// API boundary:
//     GET /api/v1/journeys/:journeyPublicId/waypoints
//
// Important architectural boundary:
//
// The Journey controller does NOT create waypoint details. It only attaches
// an existing waypoint public identifier to the Journey. Therefore this hook
// only reads the waypoint associations exposed by the Journey API.
//
// This hook is responsible for:
// - Executing the authenticated Journey waypoints API.
// - Managing request state and caching through React Query.
// - Mapping transport waypoint data into JourneyWaypoint models.
//
// This hook intentionally does NOT:
// - Create waypoints.
// - Construct waypoint coordinates.
// - Reorder waypoints.
// - Resolve external geographic places.
// - Format waypoint names.
// - Perform authorization decisions.
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import { getJourneyWaypoints } from '../../api/components/waypoints';

import {
  mapJourneyWaypoint,
  type JourneyWaypointApiResponse,
} from '../../mappers';

import type { JourneyWaypoint } from '../../models';

// -----------------------------------------------------------------------------
// Query Key
// -----------------------------------------------------------------------------

/**
 * Stable query-key namespace for the waypoints attached to a Journey.
 */
export const JOURNEY_WAYPOINTS_QUERY_KEY = [
  'journeys',
  'waypoints',
] as const;

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Fetches all waypoints currently attached to a Journey.
 *
 * The backend owns the association and ordering semantics.
 */
export function useJourneyWaypoints(
  journeyPublicId: string,
) {
  return useQuery<JourneyWaypoint[], Error>({
    queryKey: [
      ...JOURNEY_WAYPOINTS_QUERY_KEY,
      journeyPublicId,
    ],

    queryFn: async () => {
      const response = await getJourneyWaypoints(
        journeyPublicId,
      );

      return (response as JourneyWaypointApiResponse[]).map(
        mapJourneyWaypoint,
      );
    },

    enabled: Boolean(journeyPublicId),
  });
}