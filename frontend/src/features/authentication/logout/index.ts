// -----------------------------------------------------------------------------
// sisiMove — Logout Feature Barrel
// -----------------------------------------------------------------------------
//
// Public exports for the authentication logout feature.
//
// The feature barrel allows consumers to import logout functionality from:
//
//     @/features/authentication/logout
//
// Internal folder structure remains an implementation detail.
//
// -----------------------------------------------------------------------------

export { logoutUser } from './api';

export type { LogoutResponse } from './models';

export { useLogout } from './hooks';

export type { UseLogoutResult } from './hooks';
