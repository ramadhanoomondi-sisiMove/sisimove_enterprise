// -----------------------------------------------------------------------------
// sisiMove — Trust Feature
// -----------------------------------------------------------------------------
//
// Public barrel for the frontend Trust feature.
//
// The Trust feature is composed of:
//
//   api/
//     HTTP adapters for the backend public Trust read boundary.
//
//   models/
//     Frontend-safe public Trust models.
//
//   hooks/
//     TanStack Query hooks used by marketplace/UI components.
//
// Consumers should import from the feature root:
//
//   import {
//     getTravellerTrust,
//     useTravellerTrust,
//     PublicTravellerTrust,
//   } from '@/features/trust';
//
// This keeps consumers independent of the internal feature directory layout.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export {
  getTravellerTrust,
  getPublicTrustProfile,
} from './api';


// -----------------------------------------------------------------------------
// Models
// -----------------------------------------------------------------------------

export type {
  PublicTravellerTrust,
  PublicTrustBadge,
  PublicTrustBadgeAsset,
} from './models';


// -----------------------------------------------------------------------------
// Hooks
// -----------------------------------------------------------------------------

export {
  useTravellerTrust,
  travellerTrustQueryKeys,
} from './hooks';