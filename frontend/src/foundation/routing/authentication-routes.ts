// -----------------------------------------------------------------------------
// sisiMove — Authentication Routes
// -----------------------------------------------------------------------------
//
// Canonical routes used to enter the authentication flows.
//
// Registration and login are public pages, but they are kept in a dedicated
// authentication route contract because they represent authentication
// boundaries rather than marketplace resources.
//
// This file does NOT:
// - perform navigation,
// - authenticate users,
// - redirect users,
// - manage sessions,
// - enforce authorization.
//
// -----------------------------------------------------------------------------

export const AUTHENTICATION_ROUTES = {
  REGISTER: '/register',
  LOGIN: '/login',
} as const;

export type AuthenticationRoute =
  (typeof AUTHENTICATION_ROUTES)[keyof typeof AUTHENTICATION_ROUTES];

