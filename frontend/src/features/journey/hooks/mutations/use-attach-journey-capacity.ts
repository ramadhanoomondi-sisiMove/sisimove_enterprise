// -----------------------------------------------------------------------------
// sisiMove — useAttachJourneyCapacity
// -----------------------------------------------------------------------------
//
// React Query mutation hook for configuring and attaching Journey capacity.
//
// API boundary:
//     POST /api/v1/journeys/:journeyPublicId/capacity
//
// Request body:
//     {
//       totalSeats: number;
//       bookedSeats: number;
//     }
//
// IMPORTANT:
//
// Capacity is Journey-owned configuration.
//
// The frontend does NOT create a standalone Capacity resource before this
// mutation. The backend application handler:
//
//   1. Resolves the Journey aggregate.
//   2. Creates the JourneyCapacity entity from the supplied configuration.
//   3. Attaches the capacity to the Journey aggregate.
//   4. Persists the aggregate.
//
// Therefore this hook accepts the capacity configuration itself.
//
// The backend remains authoritative for:
// - capacity validation;
// - booked-seat invariants;
// - Journey lifecycle rules;
// - authorization;
// - aggregate persistence.
//
// This hook is responsible for:
// - Executing the Capacity configuration API.
// - Managing mutation state through React Query.
// - Invalidating affected Journey Capacity queries.
// - Invalidating authenticated Journey collections.
//
// This hook intentionally does NOT:
// - Create domain entities.
// - Generate capacity identifiers.
// - Calculate available seats.
// - Validate Journey lifecycle rules.
// - Perform authorization checks.
// - Navigate to another route.
// -----------------------------------------------------------------------------
//
// Architectural flow:
//
//   JourneySeatsForm
//          │
//          ▼
//   useAttachJourneyCapacity()
//          │
//          ▼
//   attachJourneyCapacity()
//          │
//          ▼
//   Journey HTTP Controller
//          │
//          ▼
//   AttachJourneyCapacityCommand
//          │
//          ▼
//   Journey Aggregate
//          │
//          ▼
//        save()
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { attachJourneyCapacity } from '../../api/components/capacity';

import {
  JOURNEY_CAPACITY_QUERY_KEY,
  MY_JOURNEYS_QUERY_KEY,
  JOURNEYS_BY_PROVIDER_QUERY_KEY,
  JOURNEYS_BY_PROVIDER_STATUS_QUERY_KEY,
} from '../queries';

// -----------------------------------------------------------------------------
// Variables
// -----------------------------------------------------------------------------

/**
 * Variables accepted by the Capacity configuration mutation.
 *
 * `journeyPublicId` identifies the Journey being modified.
 *
 * `totalSeats` and `bookedSeats` represent the capacity configuration that
 * the backend will create and attach to the Journey aggregate.
 */
export interface AttachJourneyCapacityVariables {
  /**
   * Public identifier of the Journey being modified.
   */
  journeyPublicId: string;

  /**
   * Total number of passenger seats available on the Journey.
   */
  totalSeats: number;

  /**
   * Number of passenger seats already booked.
   *
   * For a newly created Journey this should normally be zero.
   */
  bookedSeats: number;
}

// -----------------------------------------------------------------------------
// Mutation
// -----------------------------------------------------------------------------

/**
 * Configures and attaches capacity to a Journey.
 *
 * The backend creates the JourneyCapacity entity, attaches it to the
 * Journey aggregate, and persists the aggregate.
 */
export function useAttachJourneyCapacity() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    AttachJourneyCapacityVariables
  >({
    mutationFn: async ({
      journeyPublicId,
      totalSeats,
      bookedSeats,
    }) => {
      await attachJourneyCapacity(journeyPublicId, {
        totalSeats,
        bookedSeats,
      });
    },

    onSuccess: async () => {
      /**
       * `JOURNEY_CAPACITY_QUERY_KEY` is a static query-key namespace:
       *
       *     ['journeys', 'capacity']
       *
       * It is intentionally passed directly to React Query rather than
       * invoked as a function.
       *
       * This invalidates Journey-specific Capacity queries such as:
       *
       *     ['journeys', 'capacity', journeyPublicId]
       */
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: JOURNEY_CAPACITY_QUERY_KEY,
        }),

        queryClient.invalidateQueries({
          queryKey: MY_JOURNEYS_QUERY_KEY,
        }),

        queryClient.invalidateQueries({
          queryKey: JOURNEYS_BY_PROVIDER_QUERY_KEY,
        }),

        queryClient.invalidateQueries({
          queryKey: JOURNEYS_BY_PROVIDER_STATUS_QUERY_KEY,
        }),
      ]);
    },
  });
}