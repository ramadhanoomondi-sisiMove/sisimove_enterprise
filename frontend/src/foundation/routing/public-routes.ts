// -----------------------------------------------------------------------------
// sisiMove — Public Routes
// -----------------------------------------------------------------------------
//
// Canonical route definitions for publicly accessible SisiMove pages.
//
// This file is a route contract only.
// It does NOT:
// - perform navigation,
// - inspect authentication state,
// - redirect users,
// - define Next.js middleware,
// - contain route guards.
//
// Authentication-aware behavior belongs to the application/router boundary.
//
// -----------------------------------------------------------------------------

export const PUBLIC_ROUTES = {
  HOME: '/',
  JOURNEYS: '/journeys',
  DEMANDS: '/demands',
  HOW_IT_WORKS: '/how-it-works',

  journey: (publicId: string) =>
    `/journeys/${encodeURIComponent(publicId)}`,

  demand: (publicId: string) =>
    `/demands/${encodeURIComponent(publicId)}`,

  traveller: (handle: string) =>
    `/travellers/${encodeURIComponent(handle)}`,
} as const;

export type PublicRoute =
  | typeof PUBLIC_ROUTES.HOME
  | typeof PUBLIC_ROUTES.JOURNEYS
  | typeof PUBLIC_ROUTES.DEMANDS
  | typeof PUBLIC_ROUTES.HOW_IT_WORKS;

