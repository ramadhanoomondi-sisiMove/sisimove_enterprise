
// -----------------------------------------------------------------------------
// sisiMove — Assets
// Asset Directory Filter Models
// -----------------------------------------------------------------------------

import type {
  AssetCategory,
  AssetStatus,
  AssetStorageProvider,
  AssetType,
  AssetVisibility,
} from './asset.enums';

// =============================================================================
// Asset Filters
// =============================================================================

export interface AssetFiltersModel {
  readonly search: string;
  readonly type: AssetType | '';
  readonly category: AssetCategory | '';
  readonly status: AssetStatus | '';
  readonly visibility: AssetVisibility | '';
  readonly storageProvider: AssetStorageProvider | '';
}

// =============================================================================
// Defaults
// =============================================================================

export const DEFAULT_ASSET_FILTERS: AssetFiltersModel = {
  search: '',
  type: '',
  category: '',
  status: '',
  visibility: '',
  storageProvider: '',
};

// =============================================================================
// Filter Helpers
// =============================================================================

/**
 * Returns true when at least one filter has been applied.
 *
 * Search is included because it can be applied client-side until a
 * corresponding backend query parameter is confirmed.
 */
export function hasActiveAssetFilters(
  filters: AssetFiltersModel,
): boolean {
  return (
    filters.search.trim().length > 0 ||
    filters.type !== '' ||
    filters.category !== '' ||
    filters.status !== '' ||
    filters.visibility !== '' ||
    filters.storageProvider !== ''
  );
}

/**
 * Creates a fresh default filter object for resetting the directory.
 */
export function createDefaultAssetFilters(): AssetFiltersModel {
  return { ...DEFAULT_ASSET_FILTERS };
}
