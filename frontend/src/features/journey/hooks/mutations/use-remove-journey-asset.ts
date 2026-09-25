// -----------------------------------------------------------------------------
// sisiMove — Journey
// Mutation Hook — Remove Journey Asset
// -----------------------------------------------------------------------------
//
// Removes an asset attachment from a Journey.
//
// IMPORTANT
// -----------------------------------------------------------------------------
// This operation removes the JourneyAsset association only.
//
// It does NOT:
// - delete the underlying Asset,
// - delete the Asset record,
// - upload an Asset,
// - modify the Asset domain.
//
// The frozen Journey controller exposes:
//
//     DELETE /journeys/:journeyPublicId/assets/:assetPublicId
//
// Query invalidation uses the static Journey Assets namespace:
//
//     JOURNEY_ASSETS_QUERY_KEY
//
// There is intentionally no JOURNEY_ASSET_QUERY_KEY in the query layer.
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { removeJourneyAsset } from '../../api/components/assets';

import {
  JOURNEY_ASSETS_QUERY_KEY,
  MY_JOURNEYS_QUERY_KEY,
  JOURNEYS_BY_PROVIDER_QUERY_KEY,
  JOURNEYS_BY_PROVIDER_STATUS_QUERY_KEY,
} from '../queries';

// -----------------------------------------------------------------------------
// Mutation variables
// -----------------------------------------------------------------------------

export interface RemoveJourneyAssetVariables {
  journeyPublicId: string;
  assetPublicId: string;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useRemoveJourneyAsset() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, RemoveJourneyAssetVariables>({
    mutationFn: async ({
      journeyPublicId,
      assetPublicId,
    }) => {
      return removeJourneyAsset(
        journeyPublicId,
        assetPublicId,
      );
    },

    onSuccess: async () => {
      await Promise.all([
        // Journey asset collection.
        queryClient.invalidateQueries({
          queryKey: JOURNEY_ASSETS_QUERY_KEY,
        }),

        // Authenticated Journey collections.
        queryClient.invalidateQueries({
          queryKey: MY_JOURNEYS_QUERY_KEY,
        }),

        queryClient.invalidateQueries({
          queryKey: JOURNEYS_BY_PROVIDER_QUERY_KEY,
        }),

        queryClient.invalidateQueries({
          queryKey: JOURNEYS_BY_PROVIDER_STATUS_QUERY_KEY,
        }),
      ]);
    },
  });
}