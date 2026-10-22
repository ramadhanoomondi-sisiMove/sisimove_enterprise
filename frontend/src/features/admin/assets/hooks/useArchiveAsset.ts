
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { assetsApi } from '../api';
import type { AssetModel } from '../models';
import { assetsQueryKeys } from './useAssets';

/**
 * sisiMove — Archive Asset Hook
 *
 * Responsibilities:
 * - Execute the asset archive request.
 * - Invalidate asset list and detail queries after success.
 * - Expose mutation state for the admin UI.
 *
 * Authorization note:
 * The backend archive operation enforces ownership.
 * Do not expose this mutation as an admin-wide operation
 * until administrator authorization is confirmed.
 */
export function useArchiveAsset() {
  const queryClient = useQueryClient();

  const archiveMutation = useMutation<AssetModel, Error, string>({
    mutationFn: (assetPublicId: string) => {
      const normalizedPublicId = assetPublicId.trim();

      if (!normalizedPublicId) {
        throw new Error('Asset public ID is required.');
      }

      return assetsApi.archive(normalizedPublicId);
    },

    onSuccess: async (archivedAsset) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: assetsQueryKeys.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey: assetsQueryKeys.detail(archivedAsset.publicId),
        }),
      ]);
    },
  });

  return {
    archiveAsset: archiveMutation.mutateAsync,
    isArchiving: archiveMutation.isPending,
    isError: archiveMutation.isError,
    error: archiveMutation.error,
    isSuccess: archiveMutation.isSuccess,
    reset: archiveMutation.reset,
  };
}

export default useArchiveAsset;
