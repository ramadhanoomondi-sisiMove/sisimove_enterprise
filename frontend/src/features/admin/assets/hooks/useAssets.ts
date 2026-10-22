
// -----------------------------------------------------------------------------
// sisiMove — Assets
// useAssets Hook
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - fetch the platform asset directory;
// - expose React Query loading and error states;
// - provide a refresh operation;
// - share cached asset data across consumers.
//
// Architecture:
//   Asset Directory
//        ↓
//   useAssets
//        ↓
//   assetsApi
//        ↓
//   AuthenticatedApiClient
//        ↓
//   GET /assets
//
// Authorization remains backend-owned. The endpoint requires the authenticated
// caller to have the asset:read permission.
// -----------------------------------------------------------------------------

'use client';

import {
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { assetsApi } from '../api';

import type { AssetModel } from '../models';

// =============================================================================
// Query Keys
// =============================================================================

export const assetsQueryKeys = {
  all: ['assets'] as const,

  lists: () => [...assetsQueryKeys.all, 'list'] as const,

  details: () => [...assetsQueryKeys.all, 'detail'] as const,

  detail: (publicId: string) =>
    [...assetsQueryKeys.details(), publicId] as const,
};

// =============================================================================
// Hook
// =============================================================================

export function useAssets() {
  const queryClient = useQueryClient();

  const assetsQuery = useQuery<AssetModel[], Error>({
    queryKey: assetsQueryKeys.lists(),

    queryFn: () => assetsApi.getAll(),

    // Avoid repeated requests while navigating between admin sections.
    staleTime: 30_000,

    // Retain cached data briefly after the directory is no longer observed.
    gcTime: 5 * 60_000,

    // Recheck the directory when the browser window regains focus.
    refetchOnWindowFocus: true,
  });

  const refresh = async (): Promise<void> => {
    await queryClient.invalidateQueries({
      queryKey: assetsQueryKeys.lists(),
      exact: true,
    });
  };

  return {
    assets: assetsQuery.data ?? [],

    isLoading: assetsQuery.isLoading,
    isFetching: assetsQuery.isFetching,
    isError: assetsQuery.isError,
    error: assetsQuery.error,

    refresh,
  };
}

export default useAssets;
