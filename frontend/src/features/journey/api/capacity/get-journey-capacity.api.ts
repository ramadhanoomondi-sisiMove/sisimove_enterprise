// -----------------------------------------------------------------------------
// sisiMove — Get Journey Capacity API
// -----------------------------------------------------------------------------

import { apiClient } from '@/foundation/http';

import type { JourneyCapacity } from '../../models/journey-capacity';

export async function getJourneyCapacity(
  journeyPublicId: string,
): Promise<JourneyCapacity | null> {
  return apiClient.get<JourneyCapacity | null>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/capacity`,
  );
}