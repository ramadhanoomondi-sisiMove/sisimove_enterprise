// -----------------------------------------------------------------------------
// sisiMove — Routing Barrel
// -----------------------------------------------------------------------------
//
// Central export boundary for canonical application route contracts.
//
// Route ownership is intentionally separated:
//
// PUBLIC_ROUTES
//     Public marketplace and informational routes.
//
// AUTHENTICATION_ROUTES
//     Registration and login entry routes.
//
// AUTHENTICATED_ROUTES
//     Authenticated application surfaces.
//
// This barrel only re-exports route contracts.
// It does NOT:
// - perform navigation,
// - inspect authentication state,
// - redirect users,
// - enforce authorization,
// - define middleware,
// - manage sessions.
//
// -----------------------------------------------------------------------------

export {
  AUTHENTICATED_ROUTES,
} from './authenticated-routes';

export type {
  AuthenticatedRoute,
} from './authenticated-routes';

export {
  AUTHENTICATION_ROUTES,
} from './authentication-routes';

export type {
  AuthenticationRoute,
} from './authentication-routes';

export {
  PUBLIC_ROUTES,
} from './public-routes';

export type {
  PublicRoute,
} from './public-routes';

