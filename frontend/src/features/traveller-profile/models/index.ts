// -----------------------------------------------------------------------------
// sisiMove — Traveller Profile Models
// -----------------------------------------------------------------------------
//
// Public barrel for Traveller Profile frontend models.
//
// Consumers should normally import models through the Traveller Profile
// feature boundary:
//
//     import type {
//       PublicTraveller,
//       PublicTravellerAvatar,
//       PublicTravellerProfile,
//       TravellerProfile,
//       TravellerProfilePreferences,
//       TravellerProfileCorridor,
//     } from '@/features/traveller-profile';
//
// Individual model-file paths remain internal to the feature.
//
// Architecture:
//
// - PublicTraveller* models represent the public traveller read surface.
// - TravellerProfile represents the authenticated Traveller Profile read model.
// - TravellerProfilePreferences represents profile travel/display preferences.
// - TravellerProfileCorridor represents a saved frequent-travel corridor.
//
// These are frontend application contracts.
//
// They are NOT:
// - Prisma models.
// - Backend domain entities.
// - Aggregate types.
// - API DTOs.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Public traveller models
// -----------------------------------------------------------------------------

export type {
  PublicTraveller,
  PublicTravellerAvatar,
} from './public-traveller';

export type {
  PublicTravellerProfile,
} from './public-traveller-profile';

// -----------------------------------------------------------------------------
// Authenticated Traveller Profile models
// -----------------------------------------------------------------------------

export type {
  TravellerProfile,
} from './traveller-profile';

export type {
  TravellerProfilePreferences,
} from './traveller-profile-preferences';

export type {
  TravellerProfileCorridor,
} from './traveller-profile-corridor';
