// -----------------------------------------------------------------------------
// sisiMove — Assets
// useAsset Hook
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - fetch one Asset by its public ID;
// - expose loading, error, and fetching states;
// - reuse the shared Assets API adapter;
// - share cached data through React Query.
//
// Backend:
//   GET /assets/:assetPublicId
//
// Authorization:
// - JWT authentication;
// - asset:read permission.
//
// This hook does not bypass backend authorization or construct asset URLs.
// -----------------------------------------------------------------------------

'use client';

import { useQuery } from '@tanstack/react-query';

import { assetsApi } from '../api';
import { assetsQueryKeys } from './useAssets';

import type { AssetModel } from '../models';

// =============================================================================
// Hook
// =============================================================================

export function useAsset(publicId: string | null | undefined) {
  const normalizedPublicId = publicId?.trim() ?? '';

  const assetQuery = useQuery<AssetModel | null, Error>({
    queryKey: assetsQueryKeys.detail(normalizedPublicId),

    queryFn: () => {
      if (!normalizedPublicId) {
        throw new Error('Asset public ID is required.');
      }

      return assetsApi.getByPublicId(normalizedPublicId);
    },

    enabled: normalizedPublicId.length > 0,

    staleTime: 30_000,

    gcTime: 5 * 60_000,

    refetchOnWindowFocus: true,
  });

  return {
    asset: assetQuery.data ?? null,

    isLoading: assetQuery.isLoading,
    isFetching: assetQuery.isFetching,
    isError: assetQuery.isError,
    error: assetQuery.error,

    refetch: assetQuery.refetch,
  };
}

export default useAsset;