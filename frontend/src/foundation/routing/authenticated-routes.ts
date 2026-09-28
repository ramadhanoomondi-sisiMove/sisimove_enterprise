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
// This file identifies canonical authenticated application URLs only.
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
//
// IMPORTANT ROUTING RULE
// -----------------------------------------------------------------------------
//
// Public resources and authenticated owner-management resources must not create
// ambiguous Next.js dynamic routes.
//
// For example:
//
//     /demands/[publicId]
//         Public Journey Demand detail.
//
//     /my-demands/[publicId]
//         Authenticated owner's Journey Demand detail.
//
// Likewise:
//
//     /journeys/[publicId]
//         Public Journey detail.
//
//     /my-journeys/[publicId]
//         Authenticated owner's Journey management.
//
// Route groups do not distinguish dynamic URL patterns. Explicit /my-*
// namespaces are therefore used for authenticated owner-management surfaces.
//
// -----------------------------------------------------------------------------

export const AUTHENTICATED_ROUTES = {
  // ---------------------------------------------------------------------------
  // Marketplace
  // ---------------------------------------------------------------------------

  /**
   * Authenticated marketplace home.
   *
   * The authenticated home remains the central journey/demand marketplace
   * surface after login.
   */
  HOME: '/home',

  // ---------------------------------------------------------------------------
  // Traveller activity
  // ---------------------------------------------------------------------------

  /**
   * Authenticated traveller's Journey collection/management surface.
   */
  MY_JOURNEYS: '/my-journeys',

  /**
   * Authenticated traveller's Journey detail/management surface.
   */
  MY_JOURNEY: (journeyPublicId: string) =>
    `/my-journeys/${encodeURIComponent(journeyPublicId)}`,

  /**
   * Authenticated Journey editing surface.
   */
  MY_JOURNEY_EDIT: (journeyPublicId: string) =>
    `/my-journeys/${encodeURIComponent(journeyPublicId)}/edit`,

  /**
   * Authenticated traveller's Journey Demand collection/management surface.
   */
  MY_DEMANDS: '/my-demands',

  /**
   * Authenticated Journey Demand creation entry point.
   *
   * This route creates the server-side JourneyDemand aggregate exactly once.
   * Subsequent creation/editing steps are identified by journeyDemandPublicId.
   */
  MY_DEMAND_CREATE_START: '/my-demands/new',

  /**
   * Authenticated Journey Demand owner detail surface.
   */
  MY_DEMAND: (journeyDemandPublicId: string) =>
    `/my-demands/${encodeURIComponent(journeyDemandPublicId)}`,

  /**
   * Authenticated Journey Demand editing surface.
   */
  MY_DEMAND_EDIT: (journeyDemandPublicId: string) =>
    `/my-demands/${encodeURIComponent(journeyDemandPublicId)}/edit`,

  // ---------------------------------------------------------------------------
  // Journey Demand creation
  // ---------------------------------------------------------------------------
  //
  // Journey Demand creation is a guided workflow around an already-created
  // server-side JourneyDemand aggregate.
  //
  // The entry route creates the demand exactly once.
  //
  // Every subsequent creation step is identified by journeyDemandPublicId.
  //
  // These routes intentionally live under /my-demands because they are
  // authenticated owner-management surfaces.
  //
  // ---------------------------------------------------------------------------

  JOURNEY_DEMAND_CREATE: (journeyDemandPublicId: string) =>
    `/my-demands/${encodeURIComponent(journeyDemandPublicId)}/edit`,

  JOURNEY_DEMAND_CREATE_ROUTE: (journeyDemandPublicId: string) =>
    `/my-demands/${encodeURIComponent(journeyDemandPublicId)}/edit/route`,

  JOURNEY_DEMAND_CREATE_SCHEDULE: (journeyDemandPublicId: string) =>
    `/my-demands/${encodeURIComponent(journeyDemandPublicId)}/edit/schedule`,

  JOURNEY_DEMAND_CREATE_SEATS: (journeyDemandPublicId: string) =>
    `/my-demands/${encodeURIComponent(journeyDemandPublicId)}/edit/seats`,

  JOURNEY_DEMAND_CREATE_PRICING: (journeyDemandPublicId: string) =>
    `/my-demands/${encodeURIComponent(journeyDemandPublicId)}/edit/pricing`,

  JOURNEY_DEMAND_CREATE_REVIEW: (journeyDemandPublicId: string) =>
    `/my-demands/${encodeURIComponent(journeyDemandPublicId)}/edit/review`,

  // ---------------------------------------------------------------------------
  // Authenticated Journey Demand compatibility aliases
  // ---------------------------------------------------------------------------
  //
  // These names describe the domain resource rather than the page namespace.
  //
  // They resolve to the canonical /my-demands URLs above.
  //
  // ---------------------------------------------------------------------------

  JOURNEY_DEMAND: (journeyDemandPublicId: string) =>
    `/my-demands/${encodeURIComponent(journeyDemandPublicId)}`,

  JOURNEY_DEMAND_EDIT: (journeyDemandPublicId: string) =>
    `/my-demands/${encodeURIComponent(journeyDemandPublicId)}/edit`,

  /**
   * Generic authenticated Journey Demand collection namespace.
   *
   * The canonical owner-facing collection page is /my-demands.
   */
  JOURNEY_DEMANDS: '/my-demands',

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
    `/journeys/create/${encodeURIComponent(journeyPublicId)}`,

  JOURNEY_CREATE_ROUTE: (journeyPublicId: string) =>
    `/journeys/create/${encodeURIComponent(journeyPublicId)}/route`,

  JOURNEY_CREATE_SCHEDULE: (journeyPublicId: string) =>
    `/journeys/create/${encodeURIComponent(journeyPublicId)}/schedule`,

  JOURNEY_CREATE_VEHICLE: (journeyPublicId: string) =>
    `/journeys/create/${encodeURIComponent(journeyPublicId)}/vehicle`,

  JOURNEY_CREATE_SEATS: (journeyPublicId: string) =>
    `/journeys/create/${encodeURIComponent(journeyPublicId)}/seats`,

  JOURNEY_CREATE_PRICING: (journeyPublicId: string) =>
    `/journeys/create/${encodeURIComponent(journeyPublicId)}/pricing`,

  JOURNEY_CREATE_PREFERENCES: (journeyPublicId: string) =>
    `/journeys/create/${encodeURIComponent(journeyPublicId)}/preferences`,

  JOURNEY_CREATE_PHOTOS: (journeyPublicId: string) =>
    `/journeys/create/${encodeURIComponent(journeyPublicId)}/photos`,

  JOURNEY_CREATE_REVIEW: (journeyPublicId: string) =>
    `/journeys/create/${encodeURIComponent(journeyPublicId)}/review`,

  // ---------------------------------------------------------------------------
  // Journey detail
  // ---------------------------------------------------------------------------
  //
  // Authenticated Journey detail is namespaced under /my-journeys to avoid
  // colliding with the public /journeys/[publicId] route.
  //
  // ---------------------------------------------------------------------------

  JOURNEY: (journeyPublicId: string) =>
    `/my-journeys/${encodeURIComponent(journeyPublicId)}`,

  JOURNEY_EDIT: (journeyPublicId: string) =>
    `/my-journeys/${encodeURIComponent(journeyPublicId)}/edit`,

  // ---------------------------------------------------------------------------
  // Journey Boarding
  // ---------------------------------------------------------------------------

  JOURNEY_BOARDING: (journeyPublicId: string) =>
    `/my-journeys/${encodeURIComponent(journeyPublicId)}/boarding`,

  // ---------------------------------------------------------------------------
  // Journey Completion
  // ---------------------------------------------------------------------------
  //
  // Completion is presented in Journey context.
  //
  // Journey.publicId is used instead of JourneyCompletion.publicId because the
  // completion workflow belongs to the Journey operational surface.
  //
  // Settlement remains observational on this surface; financial lifecycle
  // operations remain owned by their backend/domain workflow.
  //
  // ---------------------------------------------------------------------------

  JOURNEY_COMPLETION: (journeyPublicId: string) =>
    `/my-journeys/${encodeURIComponent(journeyPublicId)}/completion`,

  // ---------------------------------------------------------------------------
  // Journey Booking
  // ---------------------------------------------------------------------------

  MY_BOOKINGS: '/my-bookings',

  BOOKING: (journeyBookingPublicId: string) =>
    `/bookings/${encodeURIComponent(journeyBookingPublicId)}`,

  // ---------------------------------------------------------------------------
  // Generic assets
  // ---------------------------------------------------------------------------

  ASSETS: '/assets',

  // ---------------------------------------------------------------------------
  // Messaging
  // ---------------------------------------------------------------------------

  MESSAGES: '/messages',

  MESSAGING_CONVERSATION: (conversationPublicId: string) =>
    `/messages/${encodeURIComponent(conversationPublicId)}`,

  // ---------------------------------------------------------------------------
  // Notifications
  // ---------------------------------------------------------------------------

  NOTIFICATIONS: '/notifications',

  NOTIFICATION: (notificationPublicId: string) =>
    `/notifications/${encodeURIComponent(notificationPublicId)}`,

  // ---------------------------------------------------------------------------
  // Notification preferences
  // ---------------------------------------------------------------------------

  NOTIFICATION_SETTINGS: '/settings/notifications',

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
    `/wallet/transactions/${encodeURIComponent(transactionPublicId)}`,

  WALLET_PAYMENT_METHODS: '/wallet/payment-methods',

  // ---------------------------------------------------------------------------
  // Application support
  // ---------------------------------------------------------------------------
  //
  // /support
  //     Support case collection.
  //
  // /support/new
  //     New Support case workflow.
  //
  // /support/cases/[supportCasePublicId]
  //     Existing Support case detail and conversation.
  //
  // Only SupportCase.publicId is exposed as a route identifier.
  //
  // ---------------------------------------------------------------------------

  SUPPORT: '/support',

  SUPPORT_NEW: '/support/new',

  SUPPORT_CASE: (supportCasePublicId: string) =>
    `/support/cases/${encodeURIComponent(supportCasePublicId)}`,

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
// Dynamic route builders are functions and therefore are intentionally excluded
// from AuthenticatedRoute.
//
// Example:
//
//     const route: AuthenticatedRoute = AUTHENTICATED_ROUTES.HOME;
//
// Dynamic builders remain callable:
//
//     AUTHENTICATED_ROUTES.MY_DEMAND(publicId);
//
// -----------------------------------------------------------------------------

type AuthenticatedRouteValue =
  (typeof AUTHENTICATED_ROUTES)[keyof typeof AUTHENTICATED_ROUTES];

export type AuthenticatedRoute = Extract<
  AuthenticatedRouteValue,
  string
>;

