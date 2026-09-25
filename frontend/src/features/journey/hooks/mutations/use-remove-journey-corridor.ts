// -----------------------------------------------------------------------------
// sisiMove — useRemoveJourneyCorridor
// -----------------------------------------------------------------------------
//
// React Query mutation hook for removing the attached Corridor from a
// Journey.
//
// API boundary:
//
//     DELETE /api/v1/journeys/:journeyPublicId/corridor
//
// Request body:
//
//     None
//
// IMPORTANT:
//
// The Journey aggregate owns the association between the Journey and its
// Corridor configuration.
//
// This mutation removes the Corridor attachment from the Journey. It does
// NOT represent deletion of an independent Corridor resource.
//
// The backend remains authoritative for:
//
// - Journey ownership.
// - Corridor attachment state.
// - Journey lifecycle rules.
// - Corridor removal invariants.
// - Persistence.
// - Authorization.
//
// This hook is responsible only for:
//
// - Executing the Corridor removal API.
// - Managing mutation state through React Query.
// - Invalidating affected Corridor queries.
// - Invalidating Journey queries whose representations may have changed.
//
// This hook intentionally does NOT:
//
// - Delete a standalone Corridor resource.
// - Modify Corridor data locally.
// - Remove Waypoints directly.
// - Reorder or modify Waypoints.
// - Validate Journey lifecycle rules.
// - Perform authorization checks.
// - Navigate to another route.
// - Directly manipulate cached domain data.
//
// -----------------------------------------------------------------------------
//
// Architectural flow:
//
//   JourneyRoute UI
//          │
//          │ Journey public ID
//          ▼
//   useRemoveJourneyCorridor()
//          │
//          ▼
//   removeJourneyCorridor()
//          │
//          ▼
//   Journey HTTP Controller
//          │
//          ▼
//   RemoveJourneyCorridorCommand
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

import { removeJourneyCorridor } from '../../api/components/corridor';

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
 * Variables accepted by the Corridor removal mutation.
 *
 * `journeyPublicId` identifies the Journey aggregate whose Corridor attachment
 * is being removed.
 *
 * The identifier is an opaque transport/application value. The frontend does
 * not resolve it into a domain entity.
 */
export interface RemoveJourneyCorridorVariables {
  /**
   * Public identifier of the Journey being modified.
   */
  journeyPublicId: string;
}

// -----------------------------------------------------------------------------
// Mutation
// -----------------------------------------------------------------------------

/**
 * Removes the attached Corridor from a Journey.
 *
 * The backend application/domain layer determines whether the operation is
 * valid and persists the resulting Journey aggregate.
 */
export function useRemoveJourneyCorridor() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, RemoveJourneyCorridorVariables>({
    /**
     * Execute the backend removal operation.
     *
     * The API adapter sends only the Journey public identifier in the URL.
     * There is intentionally no request body.
     */
    mutationFn: async ({
      journeyPublicId,
    }): Promise<void> => {
      await removeJourneyCorridor(journeyPublicId);
    },

    /**
     * Invalidate queries affected by removal of the Journey's Corridor.
     *
     * Namespace invalidation is intentional. Each query-key constant is the
     * root of a query family and therefore covers Journey-specific queries
     * beneath that namespace.
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
         * The authenticated user's Journey collection may expose Journey
         * configuration affected by the Corridor removal.
         */
        queryClient.invalidateQueries({
          queryKey: MY_JOURNEYS_QUERY_KEY,
        }),

        /**
         * Provider-based Journey collections may contain the modified
         * Journey and therefore need to be considered stale.
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