// -----------------------------------------------------------------------------
// sisiMove — Assets Feature Public API
// -----------------------------------------------------------------------------
//
// Feature boundary for public Asset consumption.
//
// This barrel exposes only the frontend contracts and operations that other
// features or application components are allowed to consume.
//
// The internal structure remains:
//
//     assets/
//     ├── api/
//     │   └── assets.api.ts
//     ├── models/
//     │   └── public-asset.ts
//     ├── hooks/
//     │   └── use-public-asset.ts
//     └── index.ts
//
// Consumers should import from:
//
//     @/features/assets
//
// rather than reaching into:
//
//     @/features/assets/api/...
//     @/features/assets/models/...
//     @/features/assets/hooks/...
//
// This keeps the Assets feature free to change its internal organization
// without forcing changes throughout the application.
//
// -----------------------------------------------------------------------------
//
// PUBLIC FEATURE CONTRACT
// -----------------------------------------------------------------------------
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
// The feature intentionally does not expose internal transport types such as
// `PublicAssetResponse`.
//
// -----------------------------------------------------------------------------
//
// PUBLIC ASSET BOUNDARY
// -----------------------------------------------------------------------------
//
// `PublicAsset` is the reduced representation used by public frontend
// experiences:
//
//     publicId
//     url
//     alt
//
// Internal Asset-domain metadata remains outside this feature contract.
//
// -----------------------------------------------------------------------------

export {
  getPublicAsset,
} from './api';

export type {
  PublicAsset,
} from './models';

export {
  usePublicAsset,
} from './hooks';