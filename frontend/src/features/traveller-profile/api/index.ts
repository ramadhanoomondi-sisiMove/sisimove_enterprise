// -----------------------------------------------------------------------------
// sisiMove — Traveller Profile API
// -----------------------------------------------------------------------------
//
// Public exports for Traveller Profile API operations and transport contracts.
//
// Responsibilities:
// - Expose Traveller Profile API functions.
// - Expose API transport types.
//
// Non-responsibilities:
// - No feature-model exports.
// - No mapping logic.
// - No React state.
// - No Trust exports.
//
// Trust has its own API boundary under:
// features/trust/api
//
// -----------------------------------------------------------------------------

export {
  getPublicTravellerProfile,
  travellerProfileApi,
} from './traveller-profile.api';

export type {
  PublicTravellerProfileResponse,
  PublicTravellerProfileTravellerResponse,
  PublicTravellerProfileCorridorResponse,
  PublicTravellerProfileCorridorWaypointResponse,
  PublicTravellerProfilePreferencesResponse,
} from './traveller-profile.types';