// -----------------------------------------------------------------------------
// sisiMove — Assets Feature Public API
// -----------------------------------------------------------------------------
//
// Public feature boundary for Asset consumption.
//
// Consumers should import Asset functionality from:
//
//     @/features/assets
//
// rather than reaching into:
//
//     @/features/assets/api/...
//     @/features/assets/models/...
//     @/features/assets/hooks/...
//
// This keeps the internal Assets feature structure private and allows the
// implementation to evolve without forcing changes throughout the application.
//
// -----------------------------------------------------------------------------
//
// INTERNAL FEATURE STRUCTURE
// -----------------------------------------------------------------------------
//
//     assets/
//     ├── api/
//     │   ├── assets.api.ts
//     │   └── public-assets.api.ts
//     │
//     ├── models/
//     │   ├── asset.ts
//     │   └── public-asset.ts
//     │
//     ├── hooks/
//     │   ├── use-asset.ts
//     │   └── use-public-asset.ts
//     │
//     └── index.ts
//
// -----------------------------------------------------------------------------
//
// PUBLIC FEATURE CONTRACT
// -----------------------------------------------------------------------------
//
// AUTHENTICATED ASSET MANAGEMENT
//
// API
//     getMyAssets()
//     uploadAsset()
//     archiveAsset()
//     deleteAsset()
//     changeAssetVisibility()
//
// Models
//     Asset
//
// Hooks
//     useAsset()
//
// -----------------------------------------------------------------------------
//
// PUBLIC ASSET DELIVERY
//
// API
//     getPublicAsset()
//
// Models
//     PublicAsset
//
// Hooks
//     usePublicAsset()
//
// -----------------------------------------------------------------------------
//
// SECURITY BOUNDARIES
// -----------------------------------------------------------------------------
//
// Authenticated Asset operations use:
//
//     authenticatedApiClient
//
// and operate against the current authenticated Identity.
//
// The frontend does not provide ownership information for owner-scoped
// operations.
//
// Public Asset delivery uses:
//
//     apiClient
//
// and exposes only the reduced PublicAsset representation.
//
// -----------------------------------------------------------------------------
//
// MODEL BOUNDARIES
// -----------------------------------------------------------------------------
//
// Asset
//
//     Authenticated Asset-management representation.
//
// PublicAsset
//
//     Safe public rendering representation.
//
// These models intentionally remain separate.
//
// `PublicAsset` does not expose internal Asset-management metadata such as:
//
//     ownerPublicId
//     status
//     visibility
//     storageProvider
//     bucket
//     objectKey
//
// -----------------------------------------------------------------------------
//
// INTERNAL TYPES
// -----------------------------------------------------------------------------
//
// The feature intentionally does not expose internal transport, persistence,
// or implementation-specific types unless they are explicitly part of the
// frontend feature contract.
//
// -----------------------------------------------------------------------------


// =============================================================================
// Authenticated Asset API
// =============================================================================

export {
  getMyAssets,
  uploadAsset,
  archiveAsset,
  deleteAsset,
  changeAssetVisibility,
} from './api';

export type {
  AssetUploadType,
  AssetUploadCategory,
  AssetVisibility,
  UploadAssetInput,
  ChangeAssetVisibilityInput,
} from './api';


// =============================================================================
// Public Asset API
// =============================================================================

export {
  getPublicAsset,
} from './api';


// =============================================================================
// Asset Models
// =============================================================================

export type {
  Asset,
  PublicAsset,
} from './models';


// =============================================================================
// Asset Hooks
// =============================================================================

export {
  useAsset,
  usePublicAsset,
} from './hooks';

export type {
  UseAssetState,
  UseAssetActions,
  UseAssetResult,
} from './hooks';