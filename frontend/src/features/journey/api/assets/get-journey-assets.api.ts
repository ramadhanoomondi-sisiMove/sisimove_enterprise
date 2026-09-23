// -----------------------------------------------------------------------------
// sisiMove — Get Journey Assets API
// -----------------------------------------------------------------------------

import { apiClient } from '@/foundation/http';

import type { JourneyAsset } from '../../models/journey-asset';

export async function getJourneyAssets(
  journeyPublicId: string,
): Promise<readonly JourneyAsset[]> {
  return apiClient.get<readonly JourneyAsset[]>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/assets`,
  );
}