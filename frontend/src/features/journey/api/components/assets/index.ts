// -----------------------------------------------------------------------------
// sisiMove — Journey Assets API Barrel
// -----------------------------------------------------------------------------
//
// Public barrel export for Journey asset API adapters.
//
// Asset capabilities exposed by the frozen Journey controller:
//
//   GET    /journeys/:journeyPublicId/assets
//   GET    /journeys/:journeyPublicId/assets/:assetPublicId
//   POST   /journeys/:journeyPublicId/assets
//   DELETE /journeys/:journeyPublicId/assets/:assetPublicId
//
// IMPORTANT:
//
// The Journey controller does NOT create Asset domain resources.
//
// The POST operation only attaches an existing Asset using:
//
//   {
//     assetPublicId: string
//   }
//
// Asset creation and management remain owned by the Assets domain.
//
// The Journey API represents only the Journey-side attachment.
//
// All adapters use the authenticated API client because these are protected
// Journey management operations.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Get all Journey assets
// -----------------------------------------------------------------------------

export {
  getJourneyAssets,
} from './get-journey-assets.api';

// -----------------------------------------------------------------------------
// Get a single Journey asset
// -----------------------------------------------------------------------------

export {
  getJourneyAsset,
} from './get-journey-asset.api';

// -----------------------------------------------------------------------------
// Attach an existing Asset
// -----------------------------------------------------------------------------

export {
  attachJourneyAsset,
  type AttachJourneyAssetRequest,
} from './attach-journey-asset.api';

// -----------------------------------------------------------------------------
// Remove a Journey asset attachment
// -----------------------------------------------------------------------------

export {
  removeJourneyAsset,
} from './remove-journey-asset.api';