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
// -----------------------------------------------------------------------------
// Authenticated application
// -----------------------------------------------------------------------------
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
//     /journeys/create
//         Journey creation entry point. Creates the draft exactly once and
//         redirects to the first journey-creation step.
//
//     /journeys/create/[journeyPublicId]
//         Journey creation aggregate-specific root.
//
//     /journeys/create/[journeyPublicId]/route
//         Journey creation — route step.
//
//     /journeys/create/[journeyPublicId]/schedule
//         Journey creation — schedule step.
//
//     /journeys/create/[journeyPublicId]/vehicle
//         Journey creation — vehicle step.
//
//     /journeys/create/[journeyPublicId]/seats
//         Journey creation — capacity/seats step.
//
//     /journeys/create/[journeyPublicId]/pricing
//         Journey creation — pricing step.
//
//     /journeys/create/[journeyPublicId]/preferences
//         Journey creation — traveller preferences step.
//
//     /journeys/create/[journeyPublicId]/photos
//         Journey creation — journey photos/assets step.
//
//     /journeys/create/[journeyPublicId]/review
//         Journey creation — final review and publication step.
//
//     /assets
//         Traveller's generic Asset-management surface.
//
//     /profile
//         Authenticated Traveller Profile surface.
//
//     /profile/verification
//         Identity / profile verification surface.
//
//     /wallet
//         Traveller's financial-account and wallet overview.
//
//     /wallet/top-up
//         Wallet top-up flow.
//
//     /wallet/withdraw
//         Wallet withdrawal flow.
//
//     /wallet/transactions
//         Wallet transaction activity surface.
//
//     /wallet/transactions/[transactionPublicId]
//         Individual financial transaction detail.
//
//     /wallet/payment-methods
//         Wallet payment-method management surface.
//
//     /support
//         Authenticated support surface.
//
//     /settings
//         Authenticated application settings surface.
//
// -----------------------------------------------------------------------------
// Next.js route-file mapping
// -----------------------------------------------------------------------------
//
// The "(authenticated)" directory is a Next.js route group and therefore
// does not appear in the public URL.
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
//     app/(authenticated)/journeys/create/page.tsx
//         → /journeys/create
//
//     app/(authenticated)/journeys/create/[journeyPublicId]/page.tsx
//         → /journeys/create/[journeyPublicId]
//
//     app/(authenticated)/journeys/create/[journeyPublicId]/route/page.tsx
//         → /journeys/create/[journeyPublicId]/route
//
//     app/(authenticated)/journeys/create/[journeyPublicId]/schedule/page.tsx
//         → /journeys/create/[journeyPublicId]/schedule
//
//     app/(authenticated)/journeys/create/[journeyPublicId]/vehicle/page.tsx
//         → /journeys/create/[journeyPublicId]/vehicle
//
//     app/(authenticated)/journeys/create/[journeyPublicId]/seats/page.tsx
//         → /journeys/create/[journeyPublicId]/seats
//
//     app/(authenticated)/journeys/create/[journeyPublicId]/pricing/page.tsx
//         → /journeys/create/[journeyPublicId]/pricing
//
//     app/(authenticated)/journeys/create/[journeyPublicId]/preferences/page.tsx
//         → /journeys/create/[journeyPublicId]/preferences
//
//     app/(authenticated)/journeys/create/[journeyPublicId]/photos/page.tsx
//         → /journeys/create/[journeyPublicId]/photos
//
//     app/(authenticated)/journeys/create/[journeyPublicId]/review/page.tsx
//         → /journeys/create/[journeyPublicId]/review
//
//     app/(authenticated)/assets/page.tsx
//         → /assets
//
//     app/(authenticated)/profile/page.tsx
//         → /profile
//
//     app/(authenticated)/profile/verification/page.tsx
//         → /profile/verification
//
//     app/(authenticated)/wallet/page.tsx
//         → /wallet
//
//     app/(authenticated)/wallet/top-up/page.tsx
//         → /wallet/top-up
//
//     app/(authenticated)/wallet/withdraw/page.tsx
//         → /wallet/withdraw
//
//     app/(authenticated)/wallet/transactions/page.tsx
//         → /wallet/transactions
//
//     app/(authenticated)/wallet/transactions/[transactionPublicId]/page.tsx
//         → /wallet/transactions/[transactionPublicId]
//
//     app/(authenticated)/wallet/payment-methods/page.tsx
//         → /wallet/payment-methods
//
//     app/(authenticated)/support/page.tsx
//         → /support
//
//     app/(authenticated)/settings/page.tsx
//         → /settings
//
// -----------------------------------------------------------------------------

export const AUTHENTICATED_ROUTES = {
  // ---------------------------------------------------------------------------
  // Marketplace
  // ---------------------------------------------------------------------------

  HOME: '/home',

  // ---------------------------------------------------------------------------
  // Traveller activity
  // ---------------------------------------------------------------------------

  MY_JOURNEYS: '/my-journeys',

  MY_DEMANDS: '/my-demands',

  ASSETS: '/assets',

  // ---------------------------------------------------------------------------
  // Journey creation
  // ---------------------------------------------------------------------------
  //
  // Journey creation is a guided workflow around an already-created
  // server-side Journey aggregate in DRAFT status.
  //
  // The entry route creates the draft exactly once.
  //
  // Every subsequent creation step is identified by journeyPublicId.
  //
  // ---------------------------------------------------------------------------

  JOURNEY_CREATE_START: '/journeys/create',

  JOURNEY_CREATE: (journeyPublicId: string) =>
    `/journeys/create/${journeyPublicId}`,

  JOURNEY_CREATE_ROUTE: (journeyPublicId: string) =>
    `/journeys/create/${journeyPublicId}/route`,

  JOURNEY_CREATE_SCHEDULE: (journeyPublicId: string) =>
    `/journeys/create/${journeyPublicId}/schedule`,

  JOURNEY_CREATE_VEHICLE: (journeyPublicId: string) =>
    `/journeys/create/${journeyPublicId}/vehicle`,

  JOURNEY_CREATE_SEATS: (journeyPublicId: string) =>
    `/journeys/create/${journeyPublicId}/seats`,

  JOURNEY_CREATE_PRICING: (journeyPublicId: string) =>
    `/journeys/create/${journeyPublicId}/pricing`,

  JOURNEY_CREATE_PREFERENCES: (journeyPublicId: string) =>
    `/journeys/create/${journeyPublicId}/preferences`,

  JOURNEY_CREATE_PHOTOS: (journeyPublicId: string) =>
    `/journeys/create/${journeyPublicId}/photos`,

  JOURNEY_CREATE_REVIEW: (journeyPublicId: string) =>
    `/journeys/create/${journeyPublicId}/review`,

  // ---------------------------------------------------------------------------
  // Traveller profile
  // ---------------------------------------------------------------------------

  PROFILE: '/profile',

  PROFILE_VERIFICATION: '/profile/verification',

  // ---------------------------------------------------------------------------
  // Financial / wallet
  // ---------------------------------------------------------------------------

  WALLET: '/wallet',

  WALLET_TOP_UP: '/wallet/top-up',

  WALLET_WITHDRAW: '/wallet/withdraw',

  WALLET_TRANSACTIONS: '/wallet/transactions',

  WALLET_TRANSACTION: (transactionPublicId: string) =>
    `/wallet/transactions/${transactionPublicId}`,

  WALLET_PAYMENT_METHODS: '/wallet/payment-methods',

  // ---------------------------------------------------------------------------
  // Application support
  // ---------------------------------------------------------------------------

  SUPPORT: '/support',

  // ---------------------------------------------------------------------------
  // Application settings
  // ---------------------------------------------------------------------------

  SETTINGS: '/settings',
} as const;

// -----------------------------------------------------------------------------
// Route type
// -----------------------------------------------------------------------------
//
// Static routes are represented directly.
//
// Dynamic route builders are excluded because they require arguments and
// therefore are functions rather than concrete route strings.
//
// -----------------------------------------------------------------------------

type AuthenticatedRouteValue =
  (typeof AUTHENTICATED_ROUTES)[keyof typeof AUTHENTICATED_ROUTES];

export type AuthenticatedRoute = Extract<
  AuthenticatedRouteValue,
  string
>;


