// -----------------------------------------------------------------------------
// sisiMove — Get Journey Vehicle API
// -----------------------------------------------------------------------------

import { apiClient } from '@/foundation/http';

import type { JourneyVehicle } from '../../models/journey-vehicle';

export async function getJourneyVehicle(
  journeyPublicId: string,
): Promise<JourneyVehicle | null> {
  return apiClient.get<JourneyVehicle | null>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/vehicle`,
  );
}