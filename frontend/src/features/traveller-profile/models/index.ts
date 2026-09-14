// -----------------------------------------------------------------------------
// sisiMove — Public Traveller Models
// -----------------------------------------------------------------------------
//
// Public barrel for Traveller Profile frontend models.
//
// Consumers should normally import these models through the Traveller Profile
// feature boundary:
//
//   import type {
//     PublicTraveller,
//     PublicTravellerProfile,
//   } from '@/features/traveller-profile';
//
// This keeps individual model-file paths internal to the feature.
//
// -----------------------------------------------------------------------------

export type {
  PublicTraveller,
  PublicTravellerAvatar,
} from './public-traveller';

export type {
  PublicTravellerProfile,
} from './public-traveller-profile';

