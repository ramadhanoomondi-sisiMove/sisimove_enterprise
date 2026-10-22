
/**
 * -----------------------------------------------------------------------------
 * sisiMove — Assets Feature
 * Public API
 * -----------------------------------------------------------------------------
 *
 * Centralizes exports for asset models, API access, mappers, and hooks.
 * Feature consumers should prefer these exports over internal file paths.
 *
 * -----------------------------------------------------------------------------
 */

// Models and enums
export type {
  AssetModel,
  AssetCollectionModel,
  AssetFiltersModel,
} from './models';

export {
  AssetType,
  AssetCategory,
  AssetStatus,
  AssetVisibility,
  AssetStorageProvider,
  DEFAULT_ASSET_FILTERS,
  hasActiveAssetFilters,
  createDefaultAssetFilters,
  isAssetModelCandidate,
} from './models';

// API
export {
  assetsApi,
} from './api';

export type {
  ChangeAssetVisibilityRequest,
} from './api';

// Mappers
export {
  AssetMapper,
  mapAssetResponse,
  mapAssetResponses,
} from './mappers';

export type {
  AssetResponseDto,
} from './mappers';

// Hooks
export {
  useAssets,
  assetsQueryKeys,
  useAsset,
  useAssetFilters,
  useArchiveAsset,
  useDeleteAsset,
  useChangeAssetVisibility,
} from './hooks';
