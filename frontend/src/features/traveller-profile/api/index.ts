// -----------------------------------------------------------------------------
// sisiMove — Traveller Profile API
// -----------------------------------------------------------------------------
//
// Public API barrel for the Traveller Profile feature.
//
// Consumers should import Traveller Profile API operations through this barrel
// instead of depending on individual implementation files.
//
// Public operations:
//
// - retrieve the current authenticated Traveller Profile;
// - retrieve a public Traveller Profile by Traveller Profile public ID;
// - retrieve a public Traveller Profile by Member public ID;
// - retrieve a public Traveller Profile by Traveller handle.
//
// Boundary:
//
//   Public operations
//       ↓
//   Public Traveller Profile REST boundary
//
//   Authenticated current-traveller operation
//       ↓
//   Authenticated Traveller Profile REST boundary
//
// The barrel intentionally exposes only operations backed by explicit
// Traveller Profile REST read boundaries.
// -----------------------------------------------------------------------------

export {
  getCurrentTravellerProfile,
  getTravellerProfileByPublicId,
  getTravellerProfileByMemberPublicId,
  getTravellerProfileByHandle,
} from './traveller-profile.api';

// -----------------------------------------------------------------------------
// sisiMove — Traveller Profile API
// -----------------------------------------------------------------------------
//
// Public API barrel for authenticated Traveller Profile HTTP operations.
//
// This file only re-exports API adapters. It contains no business logic,
// HTTP configuration, validation, or domain behavior.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Profile
// -----------------------------------------------------------------------------

export { updateTravellerProfile } from './update-traveller-profile.api';
export { updateProfileVisibility } from './update-profile-visibility.api';

// -----------------------------------------------------------------------------
// Travel Preferences
// -----------------------------------------------------------------------------

export { getTravelPreferences } from './get-travel-preferences.api';
export { updateTravelPreferences } from './update-travel-preferences.api';

// -----------------------------------------------------------------------------
// Travel Corridors
// -----------------------------------------------------------------------------

export { getTravelCorridors } from './get-travel-corridors.api';
export { createTravelCorridor } from './create-travel-corridor.api';
export { updateTravelCorridor } from './update-travel-corridor.api';
export { deleteTravelCorridor } from './delete-travel-corridor.api';

