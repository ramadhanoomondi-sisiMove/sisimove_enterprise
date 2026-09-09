// -----------------------------------------------------------------------------
// sisiMove — Traveller Profile Hooks
// -----------------------------------------------------------------------------
//
// Public exports for Traveller Profile React hooks.
//
// Responsibilities:
// - Expose Traveller Profile hook implementations.
// - Expose hook state and result contracts.
//
// Non-responsibilities:
// - No API transport exports.
// - No feature-model exports.
// - No mapper exports.
// - No Trust exports.
//
// Trust has its own hook boundary under:
// features/trust/hooks
//
// -----------------------------------------------------------------------------

export {
  useTravellerProfile,
} from './use-traveller-profile';

export type {
  UseTravellerProfileState,
  UseTravellerProfileResult,
} from './use-traveller-profile';