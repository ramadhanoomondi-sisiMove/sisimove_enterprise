// -----------------------------------------------------------------------------
// sisiMove — useJourneyPreferences
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import { getJourneyPreferences } from '../api';
import type { JourneyPreferences } from '../models/journey-preferences';

// =============================================================================
// Query Keys
// =============================================================================

export const journeyPreferencesQueryKeys = {
  detail: (journeyPublicId: string) =>
    ['journeys', 'preferences', journeyPublicId] as const,
};

// =============================================================================
// Hook
// =============================================================================

export function useJourneyPreferences(
  journeyPublicId: string | null | undefined,
) {
  return useQuery<JourneyPreferences | null>({
    queryKey: journeyPublicId
      ? journeyPreferencesQueryKeys.detail(journeyPublicId)
      : journeyPreferencesQueryKeys.detail(''),

    queryFn: () =>
      getJourneyPreferences(journeyPublicId!),

    enabled: Boolean(journeyPublicId),
  });
}