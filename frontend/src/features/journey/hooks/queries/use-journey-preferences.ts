// -----------------------------------------------------------------------------
// sisiMove — useJourneyPreferences


import { useQuery } from '@tanstack/react-query';

import { getJourneyPreferences } from '../../api/components/preferences';

import {
  mapJourneyPreferences,
  type JourneyPreferencesApiResponse,
} from '../../mappers';

import type { JourneyPreferences } from '../../models';

// -----------------------------------------------------------------------------
// Query Key
// -----------------------------------------------------------------------------

/**
 * Stable query-key namespace for the preferences attached to a Journey.
 */
export const JOURNEY_PREFERENCES_QUERY_KEY = [
  'journeys',
  'preferences',
] as const;

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Fetches the preferences currently attached to a Journey.
 *
 * A Journey may exist without preferences, so the result can be null.
 */
export function useJourneyPreferences(
  journeyPublicId: string,
) {
  return useQuery<JourneyPreferences | null, Error>({
    queryKey: [
      ...JOURNEY_PREFERENCES_QUERY_KEY,
      journeyPublicId,
    ],

    queryFn: async () => {
      const response = await getJourneyPreferences(
        journeyPublicId,
      );

      if (response === null) {
        return null;
      }

      return mapJourneyPreferences(
        response as JourneyPreferencesApiResponse,
      );
    },

    enabled: Boolean(journeyPublicId),
  });
}