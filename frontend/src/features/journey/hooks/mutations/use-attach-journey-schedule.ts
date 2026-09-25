// -----------------------------------------------------------------------------
// sisiMove — useAttachJourneySchedule
// -----------------------------------------------------------------------------
//
// React Query mutation hook for configuring and attaching a Schedule to a
// Journey.
//
// API boundary:
//     POST /api/v1/journeys/:journeyPublicId/schedule
//
// Request body:
//     {
//       departureAt: string;
//       arrivalAt?: string;
//       timezone: string;
//     }
//
// IMPORTANT:
//
// Journey Schedule is Journey-owned configuration.
//
// The frontend does NOT create a standalone Schedule resource before this
// mutation. The backend application handler:
//
//   1. Resolves the Journey aggregate.
//   2. Creates the JourneySchedule entity from the supplied configuration.
//   3. Attaches the schedule to the Journey aggregate.
//   4. Persists the Journey aggregate.
//
// Therefore this hook accepts the schedule configuration itself.
//
// Date/time values remain transport strings at the HTTP boundary. The backend
// controller is responsible for converting them to Date values before
// constructing the application command.
//
// The backend remains authoritative for:
// - schedule validation;
// - date/time invariants;
// - timezone validation;
// - Journey lifecycle rules;
// - authorization;
// - aggregate persistence.
//
// This hook is responsible for:
// - Executing the Schedule configuration API.
// - Managing mutation state through React Query.
// - Invalidating affected Journey Schedule queries.
// - Invalidating authenticated Journey collections.
//
// This hook intentionally does NOT:
// - Create domain entities.
// - Generate schedule public identifiers.
// - Construct Date objects for the domain layer.
// - Validate Journey lifecycle rules.
// - Perform authorization checks.
// - Modify other Journey components.
// - Navigate to another route.
// -----------------------------------------------------------------------------
//
// Architectural flow:
//
//   JourneyScheduleStep
//          │
//          ▼
//   useAttachJourneySchedule()
//          │
//          ▼
//   attachJourneySchedule()
//          │
//          ▼
//   Journey HTTP Controller
//          │
//          ▼
//   AttachJourneyScheduleCommand
//          │
//          ▼
//   Journey Aggregate
//          │
//          ▼
//        save()
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { attachJourneySchedule } from '../../api/components/schedule';

import {
  JOURNEY_SCHEDULE_QUERY_KEY,
  MY_JOURNEYS_QUERY_KEY,
  JOURNEYS_BY_PROVIDER_QUERY_KEY,
  JOURNEYS_BY_PROVIDER_STATUS_QUERY_KEY,
} from '../queries';

// -----------------------------------------------------------------------------
// Variables
// -----------------------------------------------------------------------------

/**
 * Variables accepted by the Schedule configuration mutation.
 *
 * `journeyPublicId` identifies the Journey being modified.
 *
 * The remaining fields represent the schedule configuration that the backend
 * will create and attach to the Journey aggregate.
 */
export interface AttachJourneyScheduleVariables {
  /**
   * Public identifier of the Journey being modified.
   */
  journeyPublicId: string;

  /**
   * Journey departure time represented as an ISO-compatible transport string.
   */
  departureAt: string;

  /**
   * Optional Journey arrival time represented as an ISO-compatible transport
   * string.
   */
  arrivalAt?: string;

  /**
   * IANA timezone identifier used for the Journey schedule.
   *
   * Example:
   *
   *     Africa/Nairobi
   */
  timezone: string;
}

// -----------------------------------------------------------------------------
// Mutation
// -----------------------------------------------------------------------------

/**
 * Configures and attaches a Schedule to a Journey.
 *
 * The backend creates the JourneySchedule entity, attaches it to the
 * Journey aggregate, and persists the aggregate.
 */
export function useAttachJourneySchedule() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    AttachJourneyScheduleVariables
  >({
    mutationFn: async ({
      journeyPublicId,
      departureAt,
      arrivalAt,
      timezone,
    }) => {
      await attachJourneySchedule(journeyPublicId, {
        departureAt,
        arrivalAt,
        timezone,
      });
    },

    onSuccess: async () => {
      /**
       * Configuring Schedule changes the Journey's composed representation.
       *
       * `JOURNEY_SCHEDULE_QUERY_KEY` is intentionally a static namespace:
       *
       *     ['journeys', 'schedule']
       *
       * It is therefore passed directly to React Query rather than invoked
       * as a function.
       *
       * React Query will invalidate queries whose keys begin with this
       * namespace, including Journey-specific schedule queries such as:
       *
       *     ['journeys', 'schedule', journeyPublicId]
       */
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: JOURNEY_SCHEDULE_QUERY_KEY,
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