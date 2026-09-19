// -----------------------------------------------------------------------------
// sisiMove — Authentication Session Barrel
// -----------------------------------------------------------------------------
//
// Public exports for the authentication session feature.
//
// The session feature owns:
// - AuthSession — client representation of a successful authenticated session.
// - authSessionStorage — persistence boundary for AuthSession.
//
// Consumers should import session concerns from this barrel rather than
// reaching into the models/ or storage/ implementation directories.
//
// -----------------------------------------------------------------------------

export type {
  AuthSession,
} from './models';

export {
  authSessionStorage,
} from './storage';

export type {
  AuthSessionStorage,
} from './storage';
