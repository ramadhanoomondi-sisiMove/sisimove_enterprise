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
// - retrieve a public Traveller Profile by Traveller Profile public ID;
// - retrieve a public Traveller Profile by Member public ID;
// - retrieve a public Traveller Profile by Traveller handle.
//
// The barrel intentionally exports only operations backed by the dedicated
// public Traveller Profile REST boundary.
// -----------------------------------------------------------------------------

export {
  getTravellerProfileByPublicId,
  getTravellerProfileByMemberPublicId,
  getTravellerProfileByHandle,
} from './traveller-profile.api';
