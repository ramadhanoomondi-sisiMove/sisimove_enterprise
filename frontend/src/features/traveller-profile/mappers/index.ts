// -----------------------------------------------------------------------------
// sisiMove — Traveller Profile Mappers
// -----------------------------------------------------------------------------
//
// Public exports for traveller-profile mappers.
//
// Transport → feature transformation belongs exclusively in this layer.
// UI components and API consumers should import the mapper from this barrel
// rather than reaching into individual mapper implementation files.
//
// -----------------------------------------------------------------------------

export {
  travellerProfileMapper,
} from './traveller-profile.mapper';

export type {
  TravellerProfileMapper,
} from './traveller-profile.mapper';