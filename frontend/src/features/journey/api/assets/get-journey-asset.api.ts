// -----------------------------------------------------------------------------
// sisiMove — Get Journey Asset API
// -----------------------------------------------------------------------------

import { apiClient } from '@/foundation/http';

import type { JourneyAsset } from '../../models/journey-asset';

export async function getJourneyAsset(
  journeyPublicId: string,
  assetPublicId: string,
): Promise<JourneyAsset | null> {
  return apiClient.get<JourneyAsset | null>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/assets/${encodeURIComponent(assetPublicId)}`,
  );
}