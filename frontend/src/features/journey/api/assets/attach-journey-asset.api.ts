// -----------------------------------------------------------------------------
// sisiMove — Attach Journey Asset API
// -----------------------------------------------------------------------------
//
// Generic Asset lifecycle remains inside features/assets.
//
// This adapter only creates the Journey → Asset association.
//
// Backend:
//     POST /journeys/:journeyPublicId/assets
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/foundation/http';

import type { JourneyAssetType } from '../../models/journey-asset';

export interface AttachJourneyAssetInput {
  assetPublicId: string;
  type: JourneyAssetType;
  sortOrder?: number;
}

export async function attachJourneyAsset(
  journeyPublicId: string,
  input: AttachJourneyAssetInput,
): Promise<void> {
  await authenticatedApiClient.post<void>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/assets`,
    input,
  );
}