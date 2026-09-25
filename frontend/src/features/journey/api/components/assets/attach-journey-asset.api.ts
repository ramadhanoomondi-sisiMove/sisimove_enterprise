// -----------------------------------------------------------------------------
// sisiMove — Attach Journey Asset API
// -----------------------------------------------------------------------------
//
// HTTP adapter for attaching an existing Asset domain resource to a Journey.
//
// Backend endpoint:
//
//   POST /api/v1/journeys/:journeyPublicId/assets
//
// Request body:
//
//   {
//     assetPublicId: string;
//     type: JourneyAssetType;
//     sortOrder: number;
//   }
//
// IMPORTANT:
//
// Unlike Journey-owned configuration such as corridor, schedule, capacity,
// pricing, and preferences, an Asset remains an external resource owned by
// the Assets domain.
//
// The Journey application handler creates the Journey-side asset attachment
// from the supplied Asset reference and configuration:
//
//   1. Resolve the Journey aggregate.
//   2. Create the JourneyAsset entity/reference.
//   3. Attach it to the Journey aggregate.
//   4. Persist the Journey aggregate.
//
// The actual Asset resource is NOT created by this endpoint.
//
// Architectural boundary:
//
//   UI / Hook
//       │
//       ▼
//   attachJourneyAsset()
//       │
//       ▼
//   AuthenticatedApiClient
//       │
//       ▼
//   POST /journeys/:journeyPublicId/assets
//       │
//       ▼
//   AttachJourneyAssetCommand
//       │
//       ▼
//   Journey Aggregate
//
// This adapter does NOT:
// - create Assets;
// - upload files;
// - generate Asset identifiers;
// - resolve Asset ownership;
// - validate Journey lifecycle rules;
// - persist the Journey;
// - navigate;
// - manage React Query state.
//
// Asset creation/upload remains owned by the Assets domain.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type { JourneyAssetType } from '../../../models';

/**
 * Request accepted by the attach Journey asset endpoint.
 *
 * The assetPublicId references an existing Asset owned by the Assets domain.
 * The type and sortOrder configure how that Asset is used by the Journey.
 */
export interface AttachJourneyAssetRequest {
  /**
   * Public identifier of the existing Asset domain resource.
   */
  assetPublicId: string;

  /**
   * Type of asset being attached to the Journey.
   */
  type: JourneyAssetType;

  /**
   * Display/order position of the asset within the Journey.
   */
  sortOrder: number;
}

/**
 * Attach an existing Asset to a Journey.
 *
 * The backend creates the Journey-side asset attachment, attaches it to the
 * Journey aggregate, and persists the aggregate.
 *
 * The underlying Asset remains owned by the Assets domain.
 *
 * @param journeyPublicId Public identifier of the Journey.
 * @param request Asset reference and Journey attachment configuration.
 */
export async function attachJourneyAsset(
  journeyPublicId: string,
  request: AttachJourneyAssetRequest,
): Promise<void> {
  await authenticatedApiClient.post<void>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/assets`,
    request,
  );
}