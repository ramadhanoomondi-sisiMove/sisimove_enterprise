// -----------------------------------------------------------------------------
// sisiMove — Traveller Profile Feature
// -----------------------------------------------------------------------------
//
// Public feature barrel for the Traveller Profile frontend feature.
//
// Consumers should import Traveller Profile functionality through this barrel
// rather than reaching into individual implementation directories.
//
// Exposed boundaries:
//
//   API
//   ├── getCurrentTravellerProfile
//   ├── getTravellerProfileByPublicId
//   ├── getTravellerProfileByMemberPublicId
//   └── getTravellerProfileByHandle
//
//   Hooks
//   ├── useCurrentTravellerProfile
//   └── useTravellerProfile
//
//   Models
//   ├── PublicTraveller
//   ├── PublicTravellerAvatar
//   └── PublicTravellerProfile
//
// Implementation details remain behind the feature boundary.
// -----------------------------------------------------------------------------

export * from './api';

export * from './hooks';

export * from './models';

