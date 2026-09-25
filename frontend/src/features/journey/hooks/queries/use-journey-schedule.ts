// -----------------------------------------------------------------------------
// sisiMove — useJourneySchedule
// -----------------------------------------------------------------------------
//
// React Query hook for retrieving the schedule attached to a Journey.
//
// API boundary:
//     GET /api/v1/journeys/:journeyPublicId/schedule
//
// This hook is responsible for:
// - Executing the authenticated Journey schedule API.
// - Managing request state and caching through React Query.
// - Mapping the transport response into JourneySchedule.
//
// The Journey controller attaches an existing schedule through its public
// identifier. Schedule creation/editing is therefore outside this hook and
// outside the frozen Journey controller boundary.
//
// This hook intentionally does NOT:
// - Create or modify schedules.
// - Interpret timezone values.
// - Format departure/arrival timestamps.
// - Infer arrival times.
// - Perform authorization decisions.
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import { getJourneySchedule } from '../../api/components/schedule';

import {
  mapJourneySchedule,
  type JourneyScheduleApiResponse,
} from '../../mappers';

import type { JourneySchedule } from '../../models';

// -----------------------------------------------------------------------------
// Query Key
// -----------------------------------------------------------------------------

/**
 * Stable query-key namespace for the schedule attached to a Journey.
 */
export const JOURNEY_SCHEDULE_QUERY_KEY = [
  'journeys',
  'schedule',
] as const;

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Fetches the schedule currently attached to a Journey.
 *
 * A Journey may exist without a schedule, so the result can be null.
 */
export function useJourneySchedule(
  journeyPublicId: string,
) {
  return useQuery<JourneySchedule | null, Error>({
    queryKey: [
      ...JOURNEY_SCHEDULE_QUERY_KEY,
      journeyPublicId,
    ],

    queryFn: async () => {
      const response = await getJourneySchedule(
        journeyPublicId,
      );

      if (response === null) {
        return null;
      }

      return mapJourneySchedule(
        response as JourneyScheduleApiResponse,
      );
    },

    enabled: Boolean(journeyPublicId),
  });
}