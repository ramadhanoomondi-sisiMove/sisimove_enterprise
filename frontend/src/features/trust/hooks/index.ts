// -----------------------------------------------------------------------------
// sisiMove — Trust Hooks Barrel
// -----------------------------------------------------------------------------
//
// Public exports for React hooks belonging to the Trust feature.
//
// Keeps hook consumers independent from individual hook implementation files.
// -----------------------------------------------------------------------------

export {
  useTrustProfile,
} from './use-trust-profile';

export type {
  UseTrustProfileState,
  UseTrustProfileResult,
} from './use-trust-profile';