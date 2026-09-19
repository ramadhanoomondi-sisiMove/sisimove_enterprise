// -----------------------------------------------------------------------------
// sisiMove — Traveller Profile Schemas
// -----------------------------------------------------------------------------
//
// Public barrel for Traveller Profile validation schemas.
//
// Consumers should normally import schemas through the Traveller Profile
// feature boundary:
//
//     import {
//       updateTravellerProfileSchema,
//       updateProfileVisibilitySchema,
//       updateTravelPreferencesSchema,
//       createTravelCorridorSchema,
//       updateTravelCorridorSchema,
//     } from '@/features/traveller-profile';
//
// Individual schema-file paths remain internal to the feature.
//
// Architecture:
// - Schemas define frontend mutation/write boundaries.
// - Schemas validate user-editable input only.
// - Read models are not reused as mutation schemas.
// - Backend authorization, normalization, business rules, and persistence
//   remain authoritative.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Traveller Profile
// -----------------------------------------------------------------------------

export {
  updateTravellerProfileSchema,
} from './update-traveller-profile.schema';

export type {
  UpdateTravellerProfileInput,
} from './update-traveller-profile.schema';

// -----------------------------------------------------------------------------
// Profile Visibility
// -----------------------------------------------------------------------------

export {
  updateProfileVisibilitySchema,
} from './update-profile-visibility.schema';

export type {
  UpdateProfileVisibilityInput,
} from './update-profile-visibility.schema';

// -----------------------------------------------------------------------------
// Travel Preferences
// -----------------------------------------------------------------------------

export {
  updateTravelPreferencesSchema,
} from './update-travel-preferences.schema';

export type {
  UpdateTravelPreferencesInput,
} from './update-travel-preferences.schema';

// -----------------------------------------------------------------------------
// Travel Corridors
// -----------------------------------------------------------------------------

export {
  createTravelCorridorSchema,
} from './create-travel-corridor.schema';

export type {
  CreateTravelCorridorInput,
} from './create-travel-corridor.schema';

export {
  updateTravelCorridorSchema,
} from './update-travel-corridor.schema';

export type {
  UpdateTravelCorridorInput,
} from './update-travel-corridor.schema';