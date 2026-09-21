// -----------------------------------------------------------------------------
// sisiMove — Asset Hook
// -----------------------------------------------------------------------------
//
// React hook for authenticated Asset operations.
//
// This hook provides the presentation layer with access to the current
// identity's Assets without exposing HTTP-client details.
//
// Architecture:
//
//     Component
//        │
//        ▼
//     useAsset()
//        │
//        ▼
//     Asset API
//        │
//        ▼
//     authenticatedApiClient
//        │
//        ▼
//     AssetController
//
// -----------------------------------------------------------------------------
//
// SECURITY
//
// Ownership is never supplied by the component.
//
// The authenticated backend derives ownership from:
//
//     access token
//          ↓
//     JwtAuthGuard
//          ↓
//     CurrentIdentity
//          ↓
//     authenticated identity
//
// The frontend therefore never sends:
//
//     ownerIdentityId
//     ownerPublicId
//
// for owner-scoped operations.
//
// -----------------------------------------------------------------------------
//
// AVAILABLE OPERATIONS
//
//     getMyAssets()
//     uploadAsset()
//     archiveAsset()
//     deleteAsset()
//     changeAssetVisibility()
//
// Public Asset delivery is intentionally NOT included here.
//
// Public Asset reads belong to:
//
//     public-assets.api.ts
//
// and use the public Asset delivery boundary.
// -----------------------------------------------------------------------------

import { useCallback, useState } from 'react';

import {
  archiveAsset,
  changeAssetVisibility,
  deleteAsset,
  getMyAssets,
  uploadAsset,
} from '../api';

import type {
  AssetUploadCategory,
  AssetUploadType,
  AssetVisibility,
  ChangeAssetVisibilityInput,
  UploadAssetInput,
} from '../api';

import type { Asset } from '../models';

// =============================================================================
// Types
// =============================================================================

export interface UseAssetState {
  /**
   * Assets belonging to the currently authenticated identity.
   */
  readonly assets: readonly Asset[];

  /**
   * Whether an Asset request is currently being processed.
   */
  readonly isLoading: boolean;

  /**
   * Last Asset-related error.
   *
   * Null means that no error is currently recorded.
   */
  readonly error: Error | null;
}

export interface UseAssetActions {
  /**
   * Load the authenticated identity's Assets.
   */
  readonly loadAssets: () => Promise<readonly Asset[]>;

  /**
   * Upload a new Asset for the authenticated identity.
   */
  readonly upload: (
    input: UploadAssetInput,
  ) => Promise<Asset>;

  /**
   * Archive an Asset owned by the authenticated identity.
   */
  readonly archive: (
    assetPublicId: string,
  ) => Promise<Asset>;

  /**
   * Delete an Asset owned by the authenticated identity.
   */
  readonly remove: (
    assetPublicId: string,
  ) => Promise<Asset>;

  /**
   * Change visibility of an Asset owned by the authenticated identity.
   */
  readonly changeVisibility: (
    assetPublicId: string,
    input: ChangeAssetVisibilityInput,
  ) => Promise<Asset>;

  /**
   * Clear the current Asset error.
   */
  readonly clearError: () => void;
}

export interface UseAssetResult
  extends UseAssetState,
    UseAssetActions {}


// =============================================================================
// Error Normalization
// =============================================================================

function toAssetError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === 'string') {
    return new Error(error);
  }

  return new Error('An Asset operation failed.');
}


// =============================================================================
// Hook
// =============================================================================

/**
 * Manage Assets belonging to the currently authenticated identity.
 *
 * This hook does not perform authorization itself.
 *
 * Authorization and ownership remain backend responsibilities.
 *
 * The hook only coordinates:
 *
 *     UI
 *      ↓
 *     Asset API
 *      ↓
 *     backend authorization
 *
 * Usage:
 *
 *     const {
 *       assets,
 *       isLoading,
 *       error,
 *       loadAssets,
 *       upload,
 *       archive,
 *       remove,
 *       changeVisibility,
 *     } = useAsset();
 */
export function useAsset(): UseAssetResult {
  const [assets, setAssets] = useState<readonly Asset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  // ---------------------------------------------------------------------------
  // Load Assets
  // ---------------------------------------------------------------------------

  const loadAssets = useCallback(
    async (): Promise<readonly Asset[]> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getMyAssets();

        setAssets(result);

        return result;
      } catch (cause: unknown) {
        const assetError = toAssetError(cause);

        setError(assetError);

        throw assetError;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Upload
  // ---------------------------------------------------------------------------

  const upload = useCallback(
    async (input: UploadAssetInput): Promise<Asset> => {
      setIsLoading(true);
      setError(null);

      try {
        const asset = await uploadAsset(input);

        setAssets((currentAssets) => [
          ...currentAssets,
          asset,
        ]);

        return asset;
      } catch (cause: unknown) {
        const assetError = toAssetError(cause);

        setError(assetError);

        throw assetError;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Archive
  // ---------------------------------------------------------------------------

  const archive = useCallback(
    async (assetPublicId: string): Promise<Asset> => {
      setIsLoading(true);
      setError(null);

      try {
        const asset = await archiveAsset(assetPublicId);

        setAssets((currentAssets) =>
          currentAssets.map((currentAsset) =>
            currentAsset.publicId === asset.publicId
              ? asset
              : currentAsset,
          ),
        );

        return asset;
      } catch (cause: unknown) {
        const assetError = toAssetError(cause);

        setError(assetError);

        throw assetError;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Delete
  // ---------------------------------------------------------------------------

  const remove = useCallback(
    async (assetPublicId: string): Promise<Asset> => {
      setIsLoading(true);
      setError(null);

      try {
        const asset = await deleteAsset(assetPublicId);

        setAssets((currentAssets) =>
          currentAssets.map((currentAsset) =>
            currentAsset.publicId === asset.publicId
              ? asset
              : currentAsset,
          ),
        );

        return asset;
      } catch (cause: unknown) {
        const assetError = toAssetError(cause);

        setError(assetError);

        throw assetError;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Change Visibility
  // ---------------------------------------------------------------------------

  const changeVisibility = useCallback(
    async (
      assetPublicId: string,
      input: ChangeAssetVisibilityInput,
    ): Promise<Asset> => {
      setIsLoading(true);
      setError(null);

      try {
        const asset = await changeAssetVisibility(
          assetPublicId,
          input,
        );

        setAssets((currentAssets) =>
          currentAssets.map((currentAsset) =>
            currentAsset.publicId === asset.publicId
              ? asset
              : currentAsset,
          ),
        );

        return asset;
      } catch (cause: unknown) {
        const assetError = toAssetError(cause);

        setError(assetError);

        throw assetError;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Result
  // ---------------------------------------------------------------------------

  return {
    assets,
    isLoading,
    error,
    loadAssets,
    upload,
    archive,
    remove,
    changeVisibility,
    clearError,
  };
}


// =============================================================================
// Convenience Type Exports
// =============================================================================

export type {
  AssetUploadCategory,
  AssetUploadType,
  AssetVisibility,
};