// -----------------------------------------------------------------------------
// sisiMove — Remove Journey Asset API
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/foundation/http';

export async function removeJourneyAsset(
  journeyPublicId: string,
  assetPublicId: string,
): Promise<void> {
  await authenticatedApiClient.delete<void>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/assets/${encodeURIComponent(assetPublicId)}`,
  );
}