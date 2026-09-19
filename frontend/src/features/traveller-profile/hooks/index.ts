// -----------------------------------------------------------------------------
// sisiMove — Traveller Profile Hooks
// -----------------------------------------------------------------------------
//
// Public hook barrel for the Traveller Profile feature.
//
// Consumers should import hooks through this barrel rather than depending on
// individual implementation files.
//
// Hooks:
//
// - useTravellerProfile()
//     Public Traveller Profile lookup by public ID, member public ID, or
//     traveller handle.
//
// - useCurrentTravellerProfile()
//     Authenticated lookup of the Traveller Profile belonging to the current
//     authenticated Identity.
//
// The two hooks intentionally remain separate because they represent
// different backend read boundaries.
// -----------------------------------------------------------------------------

export {
  useTravellerProfile,
  type UseTravellerProfileOptions,
} from './use-traveller-profile';

export {
  useCurrentTravellerProfile,
} from './use-current-traveller-profile';

// -----------------------------------------------------------------------------
// sisiMove — Traveller Profile Hooks
// -----------------------------------------------------------------------------
//
// Public barrel for Traveller Profile React hooks.
//
// This file only re-exports hooks. It contains no React state, API calls,
// business logic, validation, or transformation.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Traveller Profile
// -----------------------------------------------------------------------------



export {
  useUpdateTravellerProfile,
  type UseUpdateTravellerProfileResult,
} from './use-update-traveller-profile';

export {
  useUpdateProfileVisibility,
  type UseUpdateProfileVisibilityResult,
} from './use-update-profile-visibility';

// -----------------------------------------------------------------------------
// Travel Preferences
// -----------------------------------------------------------------------------

export {
  useTravelPreferences,
  type UseTravelPreferencesResult,
} from './use-travel-preferences';

export {
  useUpdateTravelPreferences,
  type UseUpdateTravelPreferencesResult,
} from './use-update-travel-preferences';

// -----------------------------------------------------------------------------
// Travel Corridors
// -----------------------------------------------------------------------------

export {
  useTravelCorridors,
  type UseTravelCorridorsResult,
} from './use-travel-corridors';

export {
  useCreateTravelCorridor,
  type UseCreateTravelCorridorResult,
} from './use-create-travel-corridor';

export {
  useUpdateTravelCorridor,
  type UseUpdateTravelCorridorResult,
} from './use-update-travel-corridor';

export {
  useDeleteTravelCorridor,
  type UseDeleteTravelCorridorResult,
} from './use-delete-travel-corridor';

