
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { assetsApi } from '../api';
import type { AssetModel } from '../models';
import { assetsQueryKeys } from './useAssets';

/**
 * sisiMove — Delete Asset Hook
 *
 * Responsibilities:
 * - Execute the asset deletion request.
 * - Invalidate asset list and detail queries after success.
 * - Expose mutation state for the admin UI.
 *
 * Authorization note:
 * The backend enforces ownership for deletion.
 * Confirm administrator authorization before exposing
 * this operation in the admin control center.
 */
export function useDeleteAsset() {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation<AssetModel, Error, string>({
    mutationFn: (assetPublicId: string) => {
      const normalizedPublicId = assetPublicId.trim();

      if (!normalizedPublicId) {
        throw new Error('Asset public ID is required.');
      }

      return assetsApi.delete(normalizedPublicId);
    },

    onSuccess: async (deletedAsset) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: assetsQueryKeys.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey: assetsQueryKeys.detail(deletedAsset.publicId),
        }),
      ]);
    },
  });

  return {
    deleteAsset: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    isError: deleteMutation.isError,
    error: deleteMutation.error,
    isSuccess: deleteMutation.isSuccess,
    reset: deleteMutation.reset,
  };
}

export default useDeleteAsset;
