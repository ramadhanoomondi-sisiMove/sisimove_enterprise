// -----------------------------------------------------------------------------
// sisiMove — Remove Journey Asset API
// -----------------------------------------------------------------------------
//
// HTTP adapter for removing an asset attachment from a Journey.
//
// Backend endpoint:
//
//   DELETE /api/v1/journeys/:journeyPublicId/assets/:assetPublicId
//
// No request body is required.
//
// IMPORTANT:
//
// Removing a Journey asset only removes the Journey-side attachment. It does
// not delete the underlying Asset domain resource.
//
// Architectural boundary:
//
//   UI / Hook
//       │
//       ▼
//   removeJourneyAsset()
//       │
//       ▼
//   AuthenticatedApiClient
//       │
//       ▼
//   DELETE /journeys/:journeyPublicId/assets/:assetPublicId
//
// The backend owns validation, lifecycle rules, and the invariants governing
// removal of the Journey asset association.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

/**
 * Remove an asset attachment from a Journey.
 *
 * @param journeyPublicId Public identifier of the Journey.
 * @param assetPublicId Public identifier of the Journey asset attachment.
 *
 * The endpoint does not require a request body. The backend identifies the
 * attachment through the Journey and asset public identifier.
 */
export async function removeJourneyAsset(
  journeyPublicId: string,
  assetPublicId: string,
): Promise<void> {
  await authenticatedApiClient.delete<void>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/assets/${encodeURIComponent(assetPublicId)}`,
  );
}