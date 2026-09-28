// src/features/journey/api/assets/attach-journey-asset.ts

// -----------------------------------------------------------------------------
// sisiMove — Attach Journey Asset API
// -----------------------------------------------------------------------------
//
// Mirrors:
//
//   POST /journeys/:journeyPublicId/assets
//
// The Journey aggregate owns the attachment of JourneyAssetEntity.
//
// The frontend submits the opaque Asset public identifier together with the
// Journey-owned asset role and ordering metadata.
//
// The backend creates the JourneyAssetEntity and generates its JourneyAsset
// public identifier.
//
// The frontend must not:
// - generate the JourneyAsset public identifier;
// - resolve/reconstruct the underlying Asset entity;
// - enforce duplicate-asset invariants;
// - fabricate the resulting JourneyAsset state.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from "@/features/authentication/http/authenticated-api-client";
import type { RequestOptions } from "@/foundation/http";

import type { JourneyAssetType } from "../../models/journey-asset-type";

// -----------------------------------------------------------------------------
// Request
// -----------------------------------------------------------------------------

/**
 * HTTP payload for attaching an Asset to a Journey.
 *
 * `assetPublicId` references an existing Asset owned by the Asset bounded
 * context.
 *
 * `type` describes the role of that Asset within the Journey.
 *
 * `sortOrder` controls Journey-owned ordering metadata.
 */
export interface AttachJourneyAssetRequest {
  readonly assetPublicId: string;
  readonly type: JourneyAssetType;
  readonly sortOrder: number;
}

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

/**
 * Attaches an Asset to an existing Journey.
 *
 * Backend:
 *   POST /journeys/:journeyPublicId/assets
 *
 * Request body:
 *   {
 *     assetPublicId: string;
 *     type: JourneyAssetType;
 *     sortOrder: number;
 *   }
 *
 * Response:
 *   no response body
 *
 * The resulting Journey state should be obtained through the canonical
 * authenticated Journey query rather than fabricated locally.
 */
export async function attachJourneyAsset(
  journeyPublicId: string,
  request: AttachJourneyAssetRequest,
  options: RequestOptions = {},
): Promise<void> {
  await authenticatedApiClient.post<void>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/assets`,
    request,
    options,
  );
}