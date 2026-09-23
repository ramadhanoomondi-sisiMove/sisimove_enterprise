// -----------------------------------------------------------------------------
// sisiMove — Get Journey Corridor API
// -----------------------------------------------------------------------------
//
// Backend:
//     GET /journeys/:journeyPublicId/corridor
//
// -----------------------------------------------------------------------------

import { apiClient } from '@/foundation/http';

import type { JourneyCorridor } from '../../models/journey-corridor';

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export async function getJourneyCorridor(
  journeyPublicId: string,
): Promise<JourneyCorridor | null> {
  return apiClient.get<JourneyCorridor | null>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/corridor`,
  );
}