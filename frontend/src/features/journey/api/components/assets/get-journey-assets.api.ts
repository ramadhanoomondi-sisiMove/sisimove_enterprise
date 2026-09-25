// -----------------------------------------------------------------------------
// sisiMove — Get Journey Assets API
// -----------------------------------------------------------------------------
//
// HTTP adapter for retrieving all assets attached to a Journey.
//
// Backend endpoint:
//
//   GET /api/v1/journeys/:journeyPublicId/assets
//
// Architectural boundary:
//
//   UI / Hook
//       │
//       ▼
//   getJourneyAssets()
//       │
//       ▼
//   AuthenticatedApiClient
//       │
//       ▼
//   GET /journeys/:journeyPublicId/assets
//
// A JourneyAsset represents the Journey-side attachment to an existing Asset
// domain resource. The underlying Asset remains owned by the Assets domain.
//
// This adapter retrieves JourneyAsset attachment representations only. It
// does not resolve or fetch the underlying Asset resource.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type { JourneyAsset } from '../../../models';

/**
 * Get all assets attached to a Journey.
 *
 * @param journeyPublicId Public identifier of the Journey.
 * @returns Asset attachments belonging to the Journey.
 */
export async function getJourneyAssets(
  journeyPublicId: string,
): Promise<JourneyAsset[]> {
  return authenticatedApiClient.get<JourneyAsset[]>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/assets`,
  );
}