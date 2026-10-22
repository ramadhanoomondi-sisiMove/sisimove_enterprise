
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { assetsApi } from '../api';
import type { AssetModel, AssetVisibility } from '../models';
import { assetsQueryKeys } from './useAssets';

/**
 * sisiMove — Change Asset Visibility Hook
 *
 * Responsibilities:
 * - Request a visibility change for an asset.
 * - Invalidate asset list and detail queries after success.
 * - Expose mutation state for the admin UI.
 *
 * Authorization note:
 * The backend enforces ownership for visibility changes.
 * Confirm administrator authorization before exposing
 * this operation as an admin-wide capability.
 */
export function useChangeAssetVisibility() {
  const queryClient = useQueryClient();

  const visibilityMutation = useMutation<
    AssetModel,
    Error,
    { assetPublicId: string; visibility: AssetVisibility }
  >({
    mutationFn: ({ assetPublicId, visibility }) => {
      const normalizedPublicId = assetPublicId.trim();

      if (!normalizedPublicId) {
        throw new Error('Asset public ID is required.');
      }

      return assetsApi.changeVisibility(normalizedPublicId, {
        visibility,
      });
    },

    onSuccess: async (updatedAsset) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: assetsQueryKeys.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey: assetsQueryKeys.detail(updatedAsset.publicId),
        }),
      ]);
    },
  });

  return {
    changeVisibility: visibilityMutation.mutateAsync,
    isChangingVisibility: visibilityMutation.isPending,
    isError: visibilityMutation.isError,
    error: visibilityMutation.error,
    isSuccess: visibilityMutation.isSuccess,
    reset: visibilityMutation.reset,
  };
}

export default useChangeAssetVisibility;
