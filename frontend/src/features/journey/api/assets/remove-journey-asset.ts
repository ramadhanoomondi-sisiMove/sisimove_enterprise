// src/features/journey/api/assets/remove-journey-asset.ts

// -----------------------------------------------------------------------------
// sisiMove — Remove Journey Asset API
// -----------------------------------------------------------------------------
//
// Mirrors:
//
//   DELETE /journeys/:journeyPublicId/assets/:assetPublicId
//
// The endpoint identifies the JourneyAsset association through the Journey
// public identifier and the referenced Asset public identifier.
//
// The Journey aggregate owns removal and its invariants.
//
// No request body is required.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from "@/features/authentication/http/authenticated-api-client";
import type { RequestOptions } from "@/foundation/http";

/**
 * Removes an Asset association from an existing Journey.
 *
 * Backend:
 *   DELETE /journeys/:journeyPublicId/assets/:assetPublicId
 *
 * Request body:
 *   none
 *
 * Response:
 *   no response body
 *
 * The resulting Journey state should be obtained through the canonical
 * authenticated Journey query rather than fabricated locally.
 */
export async function removeJourneyAsset(
  journeyPublicId: string,
  assetPublicId: string,
  options: RequestOptions = {},
): Promise<void> {
  await authenticatedApiClient.delete<void>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/assets/${encodeURIComponent(assetPublicId)}`,
    options,
  );
}