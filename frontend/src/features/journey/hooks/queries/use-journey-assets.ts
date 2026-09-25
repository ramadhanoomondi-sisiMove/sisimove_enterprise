// -----------------------------------------------------------------------------
// sisiMove — useJourneyAssets
// -----------------------------------------------------------------------------
//
// React Query hook for retrieving Assets attached to a Journey.
//
// API boundary:
//     GET /api/v1/journeys/:journeyPublicId/assets
//
// This hook is responsible for:
// - Executing the authenticated Journey Assets API.
// - Managing request state and caching through React Query.
// - Mapping transport Asset-association data into JourneyAsset models.
//
// Important architectural boundary:
//
// JourneyAsset contains an opaque `assetPublicId` reference to the Asset
// domain. This hook does NOT resolve that reference into an Asset resource.
//
// Asset resolution belongs to the Asset feature/API boundary.
//
// This hook intentionally does NOT:
// - Fetch Asset details or URLs.
// - Upload assets.
// - Modify Asset records.
// - Infer Asset metadata.
// - Reorder assets locally.
// - Perform authorization decisions.
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import { getJourneyAssets } from '../../api/components/assets';

import {
  mapJourneyAsset,
  type JourneyAssetApiResponse,
} from '../../mappers';

import type { JourneyAsset } from '../../models';

// -----------------------------------------------------------------------------
// Query Key
// -----------------------------------------------------------------------------

/**
 * Stable query-key namespace for Assets attached to a Journey.
 */
export const JOURNEY_ASSETS_QUERY_KEY = [
  'journeys',
  'assets',
] as const;

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Fetches all Asset associations currently attached to a Journey.
 *
 * The backend owns the association and sort-order semantics.
 */
export function useJourneyAssets(
  journeyPublicId: string,
) {
  return useQuery<JourneyAsset[], Error>({
    queryKey: [
      ...JOURNEY_ASSETS_QUERY_KEY,
      journeyPublicId,
    ],

    queryFn: async () => {
      const response = await getJourneyAssets(
        journeyPublicId,
      );

      return (response as JourneyAssetApiResponse[]).map(
        mapJourneyAsset,
      );
    },

    enabled: Boolean(journeyPublicId),
  });
}