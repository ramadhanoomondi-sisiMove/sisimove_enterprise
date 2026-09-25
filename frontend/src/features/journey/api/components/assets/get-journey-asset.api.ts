// -----------------------------------------------------------------------------
// sisiMove — Get Journey Asset API
// -----------------------------------------------------------------------------
//
// HTTP adapter for retrieving a single asset attachment from a Journey.
//
// Backend endpoint:
//
//   GET /api/v1/journeys/:journeyPublicId/assets/:assetPublicId
//
// IMPORTANT:
//
// `assetPublicId` identifies the Journey asset attachment through the frozen
// Journey controller route. The underlying Asset domain resource remains
// owned by the Assets domain.
//
// This adapter retrieves the JourneyAsset representation only. It does not
// directly access the Assets domain or resolve the underlying asset resource.
//
// Architectural boundary:
//
//   UI / Hook
//       │
//       ▼
//   getJourneyAsset()
//       │
//       ▼
//   AuthenticatedApiClient
//       │
//       ▼
//   GET /journeys/:journeyPublicId/assets/:assetPublicId
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type { JourneyAsset } from '../../../models';

/**
 * Get a single asset attachment from a Journey.
 *
 * @param journeyPublicId Public identifier of the Journey.
 * @param assetPublicId Public identifier of the Journey asset attachment.
 * @returns The requested Journey asset attachment.
 */
export async function getJourneyAsset(
  journeyPublicId: string,
  assetPublicId: string,
): Promise<JourneyAsset> {
  return authenticatedApiClient.get<JourneyAsset>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/assets/${encodeURIComponent(assetPublicId)}`,
  );
}