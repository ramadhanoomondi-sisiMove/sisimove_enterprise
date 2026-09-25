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
// -----------------------------------------------------------------------------

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
//     /my-bookings
//         Traveller's Journey Booking management surface.
//
//     /bookings/[journeyBookingPublicId]
//         Authenticated Journey Booking detail surface.
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
//     /support
//         Authenticated support surface.
//
//     /settings
//         Authenticated application settings surface.
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

  MY_BOOKINGS: '/my-bookings',

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
  // Journey detail
  // ---------------------------------------------------------------------------

  JOURNEY: (journeyPublicId: string) =>
    `/journeys/${journeyPublicId}`,

  // ---------------------------------------------------------------------------
  // Journey-demand management
  // ---------------------------------------------------------------------------

  JOURNEY_DEMANDS: '/journey-demands',

  JOURNEY_DEMAND_CREATE_START: '/journey-demands/create',

  JOURNEY_DEMAND_CREATE: (journeyDemandPublicId: string) =>
    `/journey-demands/create/${journeyDemandPublicId}`,

  JOURNEY_DEMAND_CREATE_ROUTE: (journeyDemandPublicId: string) =>
    `/journey-demands/create/${journeyDemandPublicId}/route`,

  JOURNEY_DEMAND_CREATE_SCHEDULE: (journeyDemandPublicId: string) =>
    `/journey-demands/create/${journeyDemandPublicId}/schedule`,

  JOURNEY_DEMAND_CREATE_SEATS: (journeyDemandPublicId: string) =>
    `/journey-demands/create/${journeyDemandPublicId}/seats`,

  JOURNEY_DEMAND_CREATE_PRICING: (journeyDemandPublicId: string) =>
    `/journey-demands/create/${journeyDemandPublicId}/pricing`,

  JOURNEY_DEMAND_CREATE_REVIEW: (journeyDemandPublicId: string) =>
    `/journey-demands/create/${journeyDemandPublicId}/review`,

  // ---------------------------------------------------------------------------
  // Journey-demand detail
  // ---------------------------------------------------------------------------

  JOURNEY_DEMAND: (journeyDemandPublicId: string) =>
    `/journey-demands/${journeyDemandPublicId}`,

  // ---------------------------------------------------------------------------
  // Journey Booking
  // ---------------------------------------------------------------------------
  //
  // IMPORTANT:
  //
  // These are UI routes, not backend API routes.
  //
  // Backend:
  //
  //     /journey-bookings/...
  //
  // Authenticated application:
  //
  //     /my-bookings
  //     /bookings/[journeyBookingPublicId]
  //
  // The separation is intentional. The UI uses traveller-facing terminology
  // while the HTTP API retains its bounded-context resource name.
  //
  // The booking identifier exposed in the URL is always JourneyBooking.publicId.
  // Internal persistence IDs must never be exposed.
  //
  // Lifecycle operations remain mutations on the booking detail surface:
  //
  //     confirm
  //     cancel
  //     complete
  //     expire
  //
  // They are not represented as artificial page routes.
  //
  // ---------------------------------------------------------------------------

  BOOKING: (journeyBookingPublicId: string) =>
    `/bookings/${journeyBookingPublicId}`,

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