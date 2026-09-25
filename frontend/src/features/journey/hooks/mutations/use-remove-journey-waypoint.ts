// -----------------------------------------------------------------------------
// sisiMove — useRemoveJourneyWaypoint
// -----------------------------------------------------------------------------
//
// React Query mutation hook for removing an attached Waypoint from a Journey.
//
// API boundary:
//
//     DELETE /api/v1/journeys/:journeyPublicId/waypoints/:waypointPublicId
//
// Request body:
//
//     None
//
// IMPORTANT:
//
// The Journey controller treats the Waypoint as Journey-owned configuration.
//
// This mutation removes the Waypoint from the Journey aggregate. The frontend
// does not interpret this operation as an independent Waypoint-resource
// deletion.
//
// The backend remains authoritative for:
//
// - Journey ownership.
// - Waypoint membership.
// - Journey lifecycle rules.
// - Waypoint removal invariants.
// - Route/sequence consistency.
// - Authorization.
// - Persistence.
//
// The hook is responsible only for:
//
// - Executing the Waypoint removal API.
// - Managing mutation state through React Query.
// - Invalidating affected Waypoint queries.
// - Invalidating Journey queries whose representations may have changed.
//
// This hook intentionally does NOT:
//
// - Delete a standalone Waypoint resource.
// - Modify Waypoint details.
// - Reorder Waypoints locally.
// - Modify Corridor data directly.
// - Validate Journey domain rules.
// - Perform authorization checks.
// - Navigate to another route.
// - Directly manipulate cached domain data.
//
// -----------------------------------------------------------------------------
//
// Architectural flow:
//
//   JourneyWaypoints UI
//          │
//          │ Journey + Waypoint public IDs
//          ▼
//   useRemoveJourneyWaypoint()
//          │
//          ▼
//   removeJourneyWaypoint()
//          │
//          ▼
//   Journey HTTP Controller
//          │
//          ▼
//   RemoveJourneyWaypointCommand
//          │
//          ▼
//   JourneyAggregate
//          │
//          ▼
//        save()
//          │
//          ▼
//   React Query cache invalidation
//
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { removeJourneyWaypoint } from '../../api/components/waypoints';

import {
  JOURNEY_WAYPOINTS_QUERY_KEY,
  JOURNEY_WAYPOINT_QUERY_KEY,
  MY_JOURNEYS_QUERY_KEY,
  JOURNEYS_BY_PROVIDER_QUERY_KEY,
  JOURNEYS_BY_PROVIDER_STATUS_QUERY_KEY,
} from '../queries';

// -----------------------------------------------------------------------------
// Variables
// -----------------------------------------------------------------------------

/**
 * Variables accepted by the Journey Waypoint removal mutation.
 *
 * Both identifiers are opaque public identifiers supplied by the UI/workflow.
 *
 * They remain transport/application values and are never converted into
 * frontend domain entities.
 */
export interface RemoveJourneyWaypointVariables {
  /**
   * Public identifier of the Journey being modified.
   */
  journeyPublicId: string;

  /**
   * Public identifier of the Waypoint attached to the Journey.
   */
  waypointPublicId: string;
}

// -----------------------------------------------------------------------------
// Mutation
// -----------------------------------------------------------------------------

/**
 * Removes a Waypoint from a Journey.
 *
 * The HTTP adapter performs only the transport operation.
 *
 * The backend application/domain layer determines whether the removal is
 * valid and persists the resulting Journey aggregate.
 */
export function useRemoveJourneyWaypoint() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, RemoveJourneyWaypointVariables>({
    /**
     * Execute the backend removal operation.
     *
     * No local Waypoint entity is created, modified, reordered, or deleted.
     */
    mutationFn: async ({
      journeyPublicId,
      waypointPublicId,
    }): Promise<void> => {
      await removeJourneyWaypoint(
        journeyPublicId,
        waypointPublicId,
      );
    },

    /**
     * Invalidate all cache namespaces whose data may have changed because
     * the Journey no longer contains this Waypoint.
     *
     * Namespace invalidation is intentional here. The query-key constants
     * represent the roots of their respective query families.
     */
    onSuccess: async () => {
      await Promise.all([
        /**
         * The Journey's Waypoint collection has changed.
         *
         * This covers Journey-specific collection queries beneath:
         *
         *     ['journeys', 'waypoints']
         */
        queryClient.invalidateQueries({
          queryKey: JOURNEY_WAYPOINTS_QUERY_KEY,
        }),

        /**
         * A previously cached individual Waypoint query may now represent
         * a Waypoint that is no longer attached to the Journey.
         *
         * This invalidates queries beneath:
         *
         *     ['journeys', 'waypoint']
         */
        queryClient.invalidateQueries({
          queryKey: JOURNEY_WAYPOINT_QUERY_KEY,
        }),

        /**
         * The authenticated user's Journey collection may contain Journey
         * configuration affected by the removal.
         */
        queryClient.invalidateQueries({
          queryKey: MY_JOURNEYS_QUERY_KEY,
        }),

        /**
         * Provider-based Journey collections may contain the changed Journey.
         */
        queryClient.invalidateQueries({
          queryKey: JOURNEYS_BY_PROVIDER_QUERY_KEY,
        }),

        /**
         * Provider/status Journey collections may also contain the changed
         * Journey.
         */
        queryClient.invalidateQueries({
          queryKey: JOURNEYS_BY_PROVIDER_STATUS_QUERY_KEY,
        }),
      ]);
    },
  });
}