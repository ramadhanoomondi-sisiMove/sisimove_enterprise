
// -----------------------------------------------------------------------------
// sisiMove — Assets
// Models Barrel Export
// -----------------------------------------------------------------------------
//
// Centralizes exports for Asset models, enums, and filter helpers.
//
// Consumers can import from:
//   @/features/assets/models
// -----------------------------------------------------------------------------

// =============================================================================
// Asset Models
// =============================================================================

export type {
  AssetModel,
  AssetCollectionModel,
} from './asset.model';

export { isAssetModelCandidate } from './asset.model';

// =============================================================================
// Asset Enums
// =============================================================================

export {
  AssetType,
  AssetCategory,
  AssetStatus,
  AssetVisibility,
  AssetStorageProvider,
} from './asset.enums';

// =============================================================================
// Asset Filters
// =============================================================================

export type { AssetFiltersModel } from './asset-filters.model';

export {
  DEFAULT_ASSET_FILTERS,
  hasActiveAssetFilters,
  createDefaultAssetFilters,
} from './asset-filters.model';
