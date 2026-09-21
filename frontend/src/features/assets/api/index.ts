// -----------------------------------------------------------------------------
// sisiMove — Asset API
// -----------------------------------------------------------------------------
//
// Public export surface for Asset HTTP operations.
//
// Consumers should import Asset API functions through:
//
//     import {
//       getMyAssets,
//       uploadAsset,
//       archiveAsset,
//       deleteAsset,
//       changeAssetVisibility,
//     } from "@/features/assets/api";
//
// Public Asset delivery remains separately exposed through:
//
//     getPublicAsset
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Public Asset API
// -----------------------------------------------------------------------------

export {
  getPublicAsset,
} from './public-assets.api';

// -----------------------------------------------------------------------------
// Authenticated Asset API
// -----------------------------------------------------------------------------

export {
  getMyAssets,
  uploadAsset,
  archiveAsset,
  deleteAsset,
  changeAssetVisibility,
} from './assets.api';

// -----------------------------------------------------------------------------
// Authenticated Asset API Types
// -----------------------------------------------------------------------------

export type {
  AssetUploadType,
  AssetUploadCategory,
  AssetVisibility,
  UploadAssetInput,
  ChangeAssetVisibilityInput,
} from './assets.api';