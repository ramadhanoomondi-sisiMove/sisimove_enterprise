// -----------------------------------------------------------------------------
// sisiMove — Asset Hook Exports
// -----------------------------------------------------------------------------
//
// Public export surface for Asset hooks.
//
// Consumers should import Asset hooks through:
//
//     import {
//       useAsset,
//       usePublicAsset,
//     } from '@/features/assets/hooks';
//
// The hooks represent two distinct boundaries:
//
//     useAsset()
//         ↓
//     Authenticated Asset management
//
//     usePublicAsset()
//         ↓
//     Public Asset delivery
//
// -----------------------------------------------------------------------------

// =============================================================================
// Authenticated Asset
// =============================================================================
//
// Manages Assets belonging to the currently authenticated Identity.
//
// Includes:
//
//     - loadAssets()
//     - upload()
//     - archive()
//     - remove()
//     - changeVisibility()
//     - clearError()
//
// -----------------------------------------------------------------------------

export {
  useAsset,
} from './use-asset';

export type {
  UseAssetState,
  UseAssetActions,
  UseAssetResult,
  AssetUploadCategory,
  AssetUploadType,
  AssetVisibility,
} from './use-asset';


// =============================================================================
// Public Asset
// =============================================================================
//
// Provides access to the public Asset delivery boundary.
//
// Public Asset delivery is intentionally separate from authenticated Asset
// management.
//
// -----------------------------------------------------------------------------

export {
  usePublicAsset,
} from './use-public-asset';