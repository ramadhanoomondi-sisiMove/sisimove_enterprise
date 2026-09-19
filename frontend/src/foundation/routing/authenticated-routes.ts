// -----------------------------------------------------------------------------
// sisiMove — Authenticated Routes
// -----------------------------------------------------------------------------
//
// Canonical routes for authenticated application surfaces.
//
// These routes are intentionally separate from:
//
//     PUBLIC_ROUTES
//         Public marketplace and informational pages.
//
//     AUTHENTICATION_ROUTES
//         Registration and login entry points.
//
// The authenticated route group is responsible only for identifying the
// canonical URL of an authenticated application surface.
//
// This file does NOT:
// - authenticate users,
// - inspect authentication state,
// - restore sessions,
// - redirect unauthenticated users,
// - enforce verification,
// - enforce marketplace capabilities,
// - perform navigation,
// - define Next.js middleware.
//
// Those responsibilities belong to their respective application boundaries.
//
// Current authenticated application:
//
//     /home
//         Authenticated marketplace home.
//
//     /my-journeys
//         Traveller's journey-management surface.
//
//     /my-demands
//         Traveller's journey-demand management surface.
//
// Next.js route-group relationship:
//
//     app/(authenticated)/home/page.tsx
//         → /home
//
//     app/(authenticated)/my-journeys/page.tsx
//         → /my-journeys
//
//     app/(authenticated)/my-demands/page.tsx
//         → /my-demands
//
// The "(authenticated)" directory is a Next.js route group and therefore
// does not appear in the URL.
//
// -----------------------------------------------------------------------------

export const AUTHENTICATED_ROUTES = {
  HOME: '/home',
  MY_JOURNEYS: '/my-journeys',
  MY_DEMANDS: '/my-demands',
} as const;

export type AuthenticatedRoute =
  (typeof AUTHENTICATED_ROUTES)[keyof typeof AUTHENTICATED_ROUTES];