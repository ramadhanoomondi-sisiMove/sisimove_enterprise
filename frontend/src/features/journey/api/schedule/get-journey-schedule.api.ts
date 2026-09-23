// -----------------------------------------------------------------------------
// sisiMove — Get Journey Schedule API
// -----------------------------------------------------------------------------

import { apiClient } from '@/foundation/http';

import type { JourneySchedule } from '../../models/journey-schedule';

export async function getJourneySchedule(
  journeyPublicId: string,
): Promise<JourneySchedule | null> {
  return apiClient.get<JourneySchedule | null>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/schedule`,
  );
}