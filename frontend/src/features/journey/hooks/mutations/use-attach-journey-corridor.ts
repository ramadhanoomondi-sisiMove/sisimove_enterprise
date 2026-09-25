// -----------------------------------------------------------------------------
// sisiMove — useAttachJourneyCorridor
// -----------------------------------------------------------------------------
//
// React Query mutation hook for configuring and attaching a Corridor to a
// Journey.
//
// API boundary:
//
//     POST /api/v1/journeys/:journeyPublicId/corridor
//
// Request body:
//
//     {
//       originName: string;
//       originLatitude: number;
//       originLongitude: number;
//       destinationName: string;
//       destinationLatitude: number;
//       destinationLongitude: number;
//     }
//
// IMPORTANT:
//
// A Corridor is Journey-owned configuration.
//
// The frontend does NOT create or persist an independent Corridor resource.
// It submits Corridor configuration to the Journey aggregate boundary.
//
// The backend application/domain layer:
//
//   1. Resolves the Journey aggregate.
//   2. Creates the JourneyCorridor child entity.
//   3. Attaches the Corridor to the Journey aggregate.
//   4. Persists the Journey aggregate.
//
// Therefore this hook accepts Corridor configuration rather than a Corridor
// domain entity.
//
// The backend remains authoritative for:
//
// - Corridor validation.
// - Geographic/domain invariants.
// - Journey lifecycle rules.
// - Corridor attachment rules.
// - Authorization.
// - Aggregate persistence.
//
// This hook is responsible only for:
//
// - Executing the Corridor configuration API.
// - Managing mutation state through React Query.
// - Invalidating affected Corridor queries.
// - Invalidating Journey queries whose representations may have changed.
//
// This hook intentionally does NOT:
//
// - Create domain entities.
// - Generate Corridor public identifiers.
// - Resolve geographic locations.
// - Validate Journey domain rules.
// - Perform authorization checks.
// - Create or modify Waypoints.
// - Modify Journey state directly.
// - Navigate to another route.
//
// -----------------------------------------------------------------------------
//
// Architectural flow:
//
//   JourneyCorridorForm
//          │
//          │ Corridor configuration
//          ▼
//   useAttachJourneyCorridor()
//          │
//          ▼
//   attachJourneyCorridor()
//          │
//          ▼
//   Journey HTTP Controller
//          │
//          ▼
//   AttachJourneyCorridorCommand
//          │
//          ▼
//   JourneyAggregate
//          │
//          ├── create/attach JourneyCorridor
//          │
//          ▼
//        save()
//          │
//          ▼
//   React Query cache invalidation
//
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { attachJourneyCorridor } from '../../api/components/corridor';

import {
  JOURNEY_CORRIDOR_QUERY_KEY,
  MY_JOURNEYS_QUERY_KEY,
  JOURNEYS_BY_PROVIDER_QUERY_KEY,
  JOURNEYS_BY_PROVIDER_STATUS_QUERY_KEY,
} from '../queries';

// -----------------------------------------------------------------------------
// Variables
// -----------------------------------------------------------------------------

/**
 * Variables accepted by the Corridor attachment mutation.
 *
 * `journeyPublicId` identifies the Journey aggregate being modified.
 *
 * The remaining fields are transport/application values representing the
 * Corridor configuration supplied by the user.
 *
 * They are not frontend domain entities.
 */
export interface AttachJourneyCorridorVariables {
  /**
   * Public identifier of the Journey being modified.
   */
  journeyPublicId: string;

  /**
   * Human-readable name of the Journey origin.
   */
  originName: string;

  /**
   * Latitude of the Journey origin.
   */
  originLatitude: number;

  /**
   * Longitude of the Journey origin.
   */
  originLongitude: number;

  /**
   * Human-readable name of the Journey destination.
   */
  destinationName: string;

  /**
   * Latitude of the Journey destination.
   */
  destinationLatitude: number;

  /**
   * Longitude of the Journey destination.
   */
  destinationLongitude: number;
}

// -----------------------------------------------------------------------------
// Mutation
// -----------------------------------------------------------------------------

/**
 * Configures and attaches a Corridor to a Journey.
 *
 * The backend creates the Journey-owned JourneyCorridor entity and attaches
 * it through the Journey aggregate.
 *
 * The frontend receives no domain entity from this mutation. The resulting
 * authoritative state is obtained through subsequent queries.
 */
export function useAttachJourneyCorridor() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, AttachJourneyCorridorVariables>({
    /**
     * Execute the Corridor attachment request.
     *
     * The hook forwards only the values required by the HTTP adapter.
     *
     * No domain object is constructed here and no Journey invariant is
     * duplicated on the client.
     */
    mutationFn: async ({
      journeyPublicId,
      originName,
      originLatitude,
      originLongitude,
      destinationName,
      destinationLatitude,
      destinationLongitude,
    }): Promise<void> => {
      await attachJourneyCorridor(journeyPublicId, {
        originName,
        originLatitude,
        originLongitude,
        destinationName,
        destinationLatitude,
        destinationLongitude,
      });
    },

    /**
     * Invalidate queries affected by the newly attached Corridor.
     *
     * Namespace invalidation is intentional. The query-key constants represent
     * the roots of their respective query families.
     */
    onSuccess: async () => {
      await Promise.all([
        /**
         * The Journey's Corridor representation has changed.
         *
         * This covers Journey-specific queries such as:
         *
         *     ['journeys', 'corridor', journeyPublicId]
         *
         * when JOURNEY_CORRIDOR_QUERY_KEY is:
         *
         *     ['journeys', 'corridor']
         */
        queryClient.invalidateQueries({
          queryKey: JOURNEY_CORRIDOR_QUERY_KEY,
        }),

        /**
         * The authenticated user's Journey collection may contain Journey
         * configuration affected by the Corridor attachment.
         */
        queryClient.invalidateQueries({
          queryKey: MY_JOURNEYS_QUERY_KEY,
        }),

        /**
         * Provider-based Journey collections may contain the modified Journey.
         */
        queryClient.invalidateQueries({
          queryKey: JOURNEYS_BY_PROVIDER_QUERY_KEY,
        }),

        /**
         * Provider/status Journey collections may also contain the modified
         * Journey.
         */
        queryClient.invalidateQueries({
          queryKey: JOURNEYS_BY_PROVIDER_STATUS_QUERY_KEY,
        }),
      ]);
    },
  });
}