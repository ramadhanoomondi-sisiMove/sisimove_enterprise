
'use client';

import { useCallback, useMemo, useState } from 'react';

import {
  createDefaultAssetFilters,
  hasActiveAssetFilters,
} from '../models/asset-filters.model';
import type { AssetFiltersModel, AssetModel } from '../models';

/**
 * sisiMove — Asset Filters Hook
 *
 * Responsibilities:
 * - Maintain asset directory filter state.
 * - Filter assets by search text and metadata.
 * - Expose filter updates and reset functionality.
 * - Keep filtering client-side because GET /assets
 *   does not currently expose pagination or search parameters.
 *
 * This hook does not fetch data or perform asset mutations.
 */
export function useAssetFilters(assets: readonly AssetModel[]) {
  const [filters, setFilters] = useState<AssetFiltersModel>(
    createDefaultAssetFilters,
  );

  const updateFilter = useCallback(
    <K extends keyof AssetFiltersModel>(
      key: K,
      value: AssetFiltersModel[K],
    ): void => {
      setFilters((current) => ({
        ...current,
        [key]: value,
      }));
    },
    [],
  );

  const setSearch = useCallback((search: string): void => {
    setFilters((current) => ({
      ...current,
      search,
    }));
  }, []);

  const resetFilters = useCallback((): void => {
    setFilters(createDefaultAssetFilters());
  }, []);

  const hasFilters = useMemo(
    () => hasActiveAssetFilters(filters),
    [filters],
  );

  const filteredAssets = useMemo(() => {
    const normalizedSearch = filters.search.trim().toLowerCase();

    return assets.filter((asset) => {
      if (
        normalizedSearch &&
        ![
          asset.publicId,
          asset.ownerIdentityPublicId ?? '',
          asset.originalFilename ?? '',
          asset.mimeType,
          asset.bucket,
          asset.objectKey,
          asset.type,
          asset.category,
          asset.status,
          asset.visibility,
          asset.storageProvider,
        ].some((value) => value.toLowerCase().includes(normalizedSearch))
      ) {
        return false;
      }

      if (filters.type && asset.type !== filters.type) {
        return false;
      }

      if (filters.category && asset.category !== filters.category) {
        return false;
      }

      if (filters.status && asset.status !== filters.status) {
        return false;
      }

      if (filters.visibility && asset.visibility !== filters.visibility) {
        return false;
      }

      if (
        filters.storageProvider &&
        asset.storageProvider !== filters.storageProvider
      ) {
        return false;
      }

      return true;
    });
  }, [assets, filters]);

  return {
    filters,
    filteredAssets,
    totalAssets: assets.length,
    filteredCount: filteredAssets.length,
    hasFilters,
    updateFilter,
    setSearch,
    resetFilters,
  };
}

export default useAssetFilters;
