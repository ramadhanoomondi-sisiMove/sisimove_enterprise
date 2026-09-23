// -----------------------------------------------------------------------------
// sisiMove — Get Journey Preferences API
// -----------------------------------------------------------------------------

import { apiClient } from '@/foundation/http';

import type { JourneyPreferences } from '../../models/journey-preferences';

export async function getJourneyPreferences(
  journeyPublicId: string,
): Promise<JourneyPreferences | null> {
  return apiClient.get<JourneyPreferences | null>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/preferences`,
  );
}