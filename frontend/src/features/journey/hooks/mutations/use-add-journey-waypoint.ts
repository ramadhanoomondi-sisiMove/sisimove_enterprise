// -----------------------------------------------------------------------------
// sisiMove — useAddJourneyWaypoint
// -----------------------------------------------------------------------------
//
// React Query mutation hook for adding a Journey-owned Waypoint.
//
// API boundary:
//
//     POST /api/v1/journeys/:journeyPublicId/waypoints
//
// Request body:
//
//     {
//       type: JourneyWaypointType;
//       sequence: number;
//       name: string;
//       latitude: number;
//       longitude: number;
//       pickupAllowed: boolean;
//       dropoffAllowed: boolean;
//     }
//
// IMPORTANT:
//
// A Waypoint is NOT an independent frontend resource.
//
// The frontend submits Waypoint configuration to the Journey boundary.
// The backend application layer then:
//
//   1. Resolves the Journey aggregate.
//   2. Creates the JourneyWaypoint entity.
//   3. Adds the waypoint through the Journey aggregate.
//   4. Persists the Journey aggregate.
//
// Therefore this hook accepts configuration rather than a Waypoint entity.
//
// Architectural responsibilities of this hook:
//
// - Execute the Waypoint mutation through the HTTP adapter.
// - Manage mutation state through React Query.
// - Invalidate stale Waypoint queries after successful mutation.
// - Invalidate Journey queries when their response representation contains
//   Waypoint-dependent data.
//
// This hook intentionally does NOT:
//
// - Create domain entities.
// - Generate public identifiers.
// - Generate presentation-only local IDs.
// - Validate Journey domain invariants.
// - Resolve Journey ownership.
// - Perform authorization decisions.
// - Navigate between routes.
// - Persist data directly.
//
// -----------------------------------------------------------------------------
//
// Architectural flow:
//
//   JourneyWaypointsForm
//          │
//          │ configuration
//          ▼
//   useAddJourneyWaypoint()
//          │
//          ▼
//   addJourneyWaypoint()
//          │
//          ▼
//   Journey HTTP Controller
//          │
//          ▼
//   AddJourneyWaypointCommand
//          │
//          ▼
//   JourneyAggregate
//          │
//          ▼
//        save()
//          │
//          ▼
//   React Query invalidation
//
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { addJourneyWaypoint } from '../../api/components/waypoints';

import type { JourneyWaypointType } from '../../models/journey-waypoint-type';

import {
  JOURNEY_WAYPOINTS_QUERY_KEY,
  MY_JOURNEYS_QUERY_KEY,
  JOURNEYS_BY_PROVIDER_QUERY_KEY,
  JOURNEYS_BY_PROVIDER_STATUS_QUERY_KEY,
} from '../queries';

// -----------------------------------------------------------------------------
// Variables
// -----------------------------------------------------------------------------

/**
 * Variables accepted by the Journey Waypoint mutation.
 *
 * `journeyPublicId` identifies the Journey aggregate being modified.
 *
 * The remaining fields represent the configuration from which the backend
 * creates the Journey-owned Waypoint entity.
 *
 * These are transport/application values, not domain entities.
 */
export interface AddJourneyWaypointVariables {
  /**
   * Public identifier of the Journey being configured.
   */
  journeyPublicId: string;

  /**
   * Type of Journey waypoint.
   */
  type: JourneyWaypointType;

  /**
   * Position of the waypoint within the Journey route.
   *
   * The backend remains authoritative for sequence validity and route
   * ordering invariants.
   */
  sequence: number;

  /**
   * Human-readable waypoint location name.
   */
  name: string;

  /**
   * Latitude of the waypoint.
   */
  latitude: number;

  /**
   * Longitude of the waypoint.
   */
  longitude: number;

  /**
   * Whether passenger pickup is permitted at this waypoint.
   */
  pickupAllowed: boolean;

  /**
   * Whether passenger drop-off is permitted at this waypoint.
   */
  dropoffAllowed: boolean;
}

// -----------------------------------------------------------------------------
// Mutation
// -----------------------------------------------------------------------------

/**
 * Adds a Journey-owned Waypoint.
 *
 * The backend owns creation of the JourneyWaypoint entity and its association
 * with the Journey aggregate.
 *
 * On success, affected React Query caches are invalidated so subsequent reads
 * obtain the authoritative Journey state from the backend.
 */
export function useAddJourneyWaypoint() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, AddJourneyWaypointVariables>({
    /**
     * Execute the HTTP mutation.
     *
     * The hook deliberately forwards only transport-safe configuration to the
     * API adapter. No domain entity is constructed here.
     */
    mutationFn: async ({
      journeyPublicId,
      type,
      sequence,
      name,
      latitude,
      longitude,
      pickupAllowed,
      dropoffAllowed,
    }) => {
      await addJourneyWaypoint(journeyPublicId, {
        type,
        sequence,
        name,
        latitude,
        longitude,
        pickupAllowed,
        dropoffAllowed,
      });
    },

    /**
     * Invalidate affected queries after the backend has successfully persisted
     * the waypoint.
     *
     * `variables` gives us the Journey public identifier associated with the
     * mutation, allowing Journey-specific query invalidation when the query
     * key structure supports it.
     */
    onSuccess: async (_data, variables) => {
      const { journeyPublicId } = variables;

      await Promise.all([
        /**
         * Invalidate the Waypoint query namespace.
         *
         * This covers Journey-specific queries such as:
         *
         *   ['journeys', 'waypoints', journeyPublicId]
         *
         * assuming JOURNEY_WAYPOINTS_QUERY_KEY is:
         *
         *   ['journeys', 'waypoints']
         */
        queryClient.invalidateQueries({
          queryKey: JOURNEY_WAYPOINTS_QUERY_KEY,
        }),

        /**
         * The authenticated Journey collection may contain a representation
         * affected by the newly-added waypoint.
         */
        queryClient.invalidateQueries({
          queryKey: MY_JOURNEYS_QUERY_KEY,
        }),

        /**
         * Provider Journey queries may also contain Journey configuration.
         */
        queryClient.invalidateQueries({
          queryKey: JOURNEYS_BY_PROVIDER_QUERY_KEY,
        }),

        /**
         * Provider/status Journey queries may also contain Journey
         * configuration.
         */
        queryClient.invalidateQueries({
          queryKey: JOURNEYS_BY_PROVIDER_STATUS_QUERY_KEY,
        }),
      ]);

      /**
       * Keep the Journey identifier available here even when namespace
       * invalidation is currently sufficient.
       *
       * If the query-key factory later becomes parameterized, this is the
       * natural place to invalidate the exact Journey-specific cache.
       */
      void journeyPublicId;
    },
  });
}