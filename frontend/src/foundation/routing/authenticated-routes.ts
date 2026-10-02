// -----------------------------------------------------------------------------
// Path: src/foundation/routing/authenticated-routes.ts
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
// This file defines URL construction only.
//
// This file does NOT:
// - authenticate users;
// - inspect authentication state;
// - restore sessions;
// - redirect unauthenticated users;
// - enforce verification;
// - enforce permissions;
// - determine lifecycle capabilities;
// - perform navigation;
// - define Next.js middleware.
//
// Those responsibilities belong to their respective application boundaries.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT ROUTING RULE
// -----------------------------------------------------------------------------
//
// Public marketplace resources and authenticated owner-management resources
// use different URL namespaces.
//
// Public:
//
//     /journeys/[publicId]
//     /demands/[publicId]
//
// Authenticated owner management:
//
//     /my-journeys/[publicId]
//     /my-demands/[publicId]
//
// Route groups do not distinguish dynamic URL patterns. Explicit /my-*
// namespaces therefore prevent ambiguous Next.js routes.
//
// -----------------------------------------------------------------------------
//
// JOURNEY CREATION RULE
// -----------------------------------------------------------------------------
//
// Journey creation is a progressively assembled Journey draft.
//
// Entry:
//
//     /my-journeys/new
//
// The entry page creates the Journey aggregate exactly once.
//
// After creation, every subsequent creation step operates on that existing
// Journey:
//
//     /my-journeys/[journeyPublicId]/edit
//     /my-journeys/[journeyPublicId]/edit/route
//     /my-journeys/[journeyPublicId]/edit/schedule
//     /my-journeys/[journeyPublicId]/edit/vehicle
//     /my-journeys/[journeyPublicId]/edit/seats
//     /my-journeys/[journeyPublicId]/edit/pricing
//     /my-journeys/[journeyPublicId]/edit/preferences
//     /my-journeys/[journeyPublicId]/edit/photos
//     /my-journeys/[journeyPublicId]/edit/review
//
// The frontend therefore never creates a new Journey aggregate for an
// individual creation step.
//
// -----------------------------------------------------------------------------
//
// JOURNEY DEMAND CREATION RULE
// -----------------------------------------------------------------------------
//
// Journey Demand follows the same owner-management namespace:
//
//     /my-demands/new
//
// The entry page creates the JourneyDemand aggregate exactly once.
//
// Subsequent steps operate on that existing JourneyDemand:
//
//     /my-demands/[journeyDemandPublicId]/edit
//     /my-demands/[journeyDemandPublicId]/edit/route
//     /my-demands/[journeyDemandPublicId]/edit/schedule
//     /my-demands/[journeyDemandPublicId]/edit/seats
//     /my-demands/[journeyDemandPublicId]/edit/pricing
//     /my-demands/[journeyDemandPublicId]/edit/review
//
// -----------------------------------------------------------------------------
//
// PUBLIC VS AUTHENTICATED DETAIL
// -----------------------------------------------------------------------------
//
// Public Journey:
//
//     /journeys/[publicId]
//
// Authenticated owner Journey:
//
//     /my-journeys/[publicId]
//
// Public Journey Demand:
//
//     /demands/[publicId]
//
// Authenticated owner Journey Demand:
//
//     /my-demands/[publicId]
//
// The public and authenticated resources intentionally have different
// namespaces.
//
// -----------------------------------------------------------------------------
//
// JOURNEY MANAGEMENT RULE
// -----------------------------------------------------------------------------
//
// The canonical authenticated Journey management surface is:
//
//     /my-journeys/[journeyPublicId]
//
// This is the permanent owner-facing Journey detail/management surface.
//
// The progressive creation/editor workflow is:
//
//     /my-journeys/[journeyPublicId]/edit
//
// and its child steps:
//
//     /my-journeys/[journeyPublicId]/edit/route
//     /my-journeys/[journeyPublicId]/edit/schedule
//     /my-journeys/[journeyPublicId]/edit/vehicle
//     /my-journeys/[journeyPublicId]/edit/seats
//     /my-journeys/[journeyPublicId]/edit/pricing
//     /my-journeys/[journeyPublicId]/edit/preferences
//     /my-journeys/[journeyPublicId]/edit/photos
//     /my-journeys/[journeyPublicId]/edit/review
//
// There is intentionally no separate /journeys/[publicId]/edit route.
//
// -----------------------------------------------------------------------------
//
// JOURNEY OPERATIONAL SURFACES
// -----------------------------------------------------------------------------
//
// Operational Journey surfaces remain below the authenticated Journey
// namespace:
//
//     /my-journeys/[journeyPublicId]/boarding
//     /my-journeys/[journeyPublicId]/completion
//
// The Journey management surface remains:
//
//     /my-journeys/[journeyPublicId]
//
// -----------------------------------------------------------------------------
//
// ROUTE OWNERSHIP
// -----------------------------------------------------------------------------
//
// This object defines URL construction only.
//
// Authentication, authorization, verification requirements, lifecycle
// capabilities, and navigation decisions belong to the corresponding
// application boundaries.
//
// -----------------------------------------------------------------------------


export const AUTHENTICATED_ROUTES = {
  // ===========================================================================
  // Application Home
  // ===========================================================================

  /**
   * Authenticated application home / marketplace entry point.
   */
  HOME: "/home",

  // ===========================================================================
  // My Journeys
  // ===========================================================================
  //
  // Authenticated owner-management namespace.
  //
  // ===========================================================================

  /**
   * Authenticated traveller's Journey collection.
   *
   * Source:
   *
   *     useMyJourneys()
   *         ↓
   *     GET /journeys/me
   */
  MY_JOURNEYS: "/my-journeys",

  /**
   * Journey creation entry point.
   *
   * This page creates the Journey aggregate exactly once.
   */
  MY_JOURNEY_NEW: "/my-journeys/new",

  /**
   * Canonical authenticated Journey management/detail surface.
   *
   * This is the permanent owner-facing route for an existing Journey.
   */
  MY_JOURNEY: (journeyPublicId: string) =>
    `/my-journeys/${encodeURIComponent(journeyPublicId)}`,

  // ===========================================================================
  // Journey Creation / Editing Workflow
  // ===========================================================================
  //
  // These routes operate on an already-created Journey aggregate.
  //
  // The frontend does not create a new aggregate for any of these steps.
  //
  // ===========================================================================

  /**
   * Journey creation/edit workflow root.
   */
  JOURNEY_CREATE: (journeyPublicId: string) =>
    `/my-journeys/${encodeURIComponent(journeyPublicId)}/edit`,

  /**
   * Journey route creation/edit step.
   *
   * Route includes the corridor and optional waypoints.
   */
  JOURNEY_CREATE_ROUTE: (journeyPublicId: string) =>
    `/my-journeys/${encodeURIComponent(journeyPublicId)}/edit/route`,

  /**
   * Journey schedule creation/edit step.
   */
  JOURNEY_CREATE_SCHEDULE: (journeyPublicId: string) =>
    `/my-journeys/${encodeURIComponent(journeyPublicId)}/edit/schedule`,

  /**
   * Journey vehicle creation/edit step.
   */
  JOURNEY_CREATE_VEHICLE: (journeyPublicId: string) =>
    `/my-journeys/${encodeURIComponent(journeyPublicId)}/edit/vehicle`,

  /**
   * Journey capacity / seats creation/edit step.
   */
  JOURNEY_CREATE_SEATS: (journeyPublicId: string) =>
    `/my-journeys/${encodeURIComponent(journeyPublicId)}/edit/seats`,

  /**
   * Journey pricing creation/edit step.
   */
  JOURNEY_CREATE_PRICING: (journeyPublicId: string) =>
    `/my-journeys/${encodeURIComponent(journeyPublicId)}/edit/pricing`,

  /**
   * Journey preferences creation/edit step.
   */
  JOURNEY_CREATE_PREFERENCES: (journeyPublicId: string) =>
    `/my-journeys/${encodeURIComponent(journeyPublicId)}/edit/preferences`,

  /**
   * Journey asset/photo creation/edit step.
   */
  JOURNEY_CREATE_PHOTOS: (journeyPublicId: string) =>
    `/my-journeys/${encodeURIComponent(journeyPublicId)}/edit/photos`,

  /**
   * Journey final review step before publication.
   */
  JOURNEY_CREATE_REVIEW: (journeyPublicId: string) =>
    `/my-journeys/${encodeURIComponent(journeyPublicId)}/edit/review`,

  // ===========================================================================
  // Journey Operational Surfaces
  // ===========================================================================

  /**
   * Journey boarding operational surface.
   *
   * Journey management remains at MY_JOURNEY.
   */
  JOURNEY_BOARDING: (journeyPublicId: string) =>
    `/my-journeys/${encodeURIComponent(journeyPublicId)}/boarding`,

  /**
   * Journey completion operational surface.
   */
  JOURNEY_COMPLETION: (journeyPublicId: string) =>
    `/my-journeys/${encodeURIComponent(journeyPublicId)}/completion`,

  // ===========================================================================
  // My Journey Demands
  // ===========================================================================
  //
  // Authenticated owner-management namespace.
  //
  // ===========================================================================

  /**
   * Authenticated traveller's Journey Demand collection.
   */
  MY_DEMANDS: "/my-demands",

  /**
   * Journey Demand creation entry point.
   *
   * This page creates the JourneyDemand aggregate exactly once.
   */
  MY_DEMAND_NEW: "/my-demands/new",

  /**
   * Canonical authenticated Journey Demand management/detail surface.
   */
  MY_DEMAND: (journeyDemandPublicId: string) =>
    `/my-demands/${encodeURIComponent(journeyDemandPublicId)}`,

  /**
   * Journey Demand creation/edit workflow root.
   */
  MY_DEMAND_EDIT: (journeyDemandPublicId: string) =>
    `/my-demands/${encodeURIComponent(journeyDemandPublicId)}/edit`,

  // ===========================================================================
  // Journey Demand Creation / Editing Workflow
  // ===========================================================================

  /**
   * Journey Demand route creation/edit step.
   */
  JOURNEY_DEMAND_CREATE_ROUTE: (journeyDemandPublicId: string) =>
    `/my-demands/${encodeURIComponent(journeyDemandPublicId)}/edit/route`,

  /**
   * Journey Demand schedule creation/edit step.
   */
  JOURNEY_DEMAND_CREATE_SCHEDULE: (journeyDemandPublicId: string) =>
    `/my-demands/${encodeURIComponent(journeyDemandPublicId)}/edit/schedule`,

  /**
   * Journey Demand seats creation/edit step.
   */
  JOURNEY_DEMAND_CREATE_SEATS: (journeyDemandPublicId: string) =>
    `/my-demands/${encodeURIComponent(journeyDemandPublicId)}/edit/seats`,

  /**
   * Journey Demand pricing creation/edit step.
   */
  JOURNEY_DEMAND_CREATE_PRICING: (journeyDemandPublicId: string) =>
    `/my-demands/${encodeURIComponent(journeyDemandPublicId)}/edit/pricing`,

  /**
   * Journey Demand final review step.
   */
  JOURNEY_DEMAND_CREATE_REVIEW: (journeyDemandPublicId: string) =>
    `/my-demands/${encodeURIComponent(journeyDemandPublicId)}/edit/review`,

  // ===========================================================================
  // Bookings
  // ===========================================================================

  /**
   * Authenticated traveller's booking collection.
   */
  MY_BOOKINGS: "/my-bookings",

  /**
   * Authenticated booking detail.
   *
   * Booking uses its own public namespace because a booking is a separate
   * aggregate and application boundary.
   */
  BOOKING: (journeyBookingPublicId: string) =>
    `/bookings/${encodeURIComponent(journeyBookingPublicId)}`,

  // ===========================================================================
  // Assets
  // ===========================================================================

  /**
   * Authenticated member asset collection.
   */
  ASSETS: "/assets",

  // ===========================================================================
  // Messaging
  // ===========================================================================

  /**
   * Authenticated messaging inbox.
   */
  MESSAGES: "/messages",

  /**
   * Authenticated messaging conversation.
   */
  MESSAGING_CONVERSATION: (conversationPublicId: string) =>
    `/messages/${encodeURIComponent(conversationPublicId)}`,

  // ===========================================================================
  // Notifications
  // ===========================================================================

  /**
   * Authenticated notification collection.
   */
  NOTIFICATIONS: "/notifications",

  /**
   * Authenticated notification detail.
   */
  NOTIFICATION: (notificationPublicId: string) =>
    `/notifications/${encodeURIComponent(notificationPublicId)}`,

  /**
   * Authenticated notification preferences.
   */
  NOTIFICATION_SETTINGS: "/settings/notifications",

  // ===========================================================================
  // Traveller Profile
  // ===========================================================================

  /**
   * Authenticated member profile.
   */
  PROFILE: "/profile",

  /**
   * Authenticated member verification surface.
   */
  PROFILE_VERIFICATION: "/profile/verification",

  // ===========================================================================
  // Financial / Wallet
  // ===========================================================================

  /**
   * Authenticated member wallet.
   */
  WALLET: "/wallet",

  /**
   * Wallet top-up workflow.
   */
  WALLET_TOP_UP: "/wallet/top-up",

  /**
   * Wallet withdrawal workflow.
   */
  WALLET_WITHDRAW: "/wallet/withdraw",

  /**
   * Wallet transaction collection.
   */
  WALLET_TRANSACTIONS: "/wallet/transactions",

  /**
   * Wallet transaction detail.
   */
  WALLET_TRANSACTION: (transactionPublicId: string) =>
    `/wallet/transactions/${encodeURIComponent(transactionPublicId)}`,

  /**
   * Authenticated wallet payment methods.
   */
  WALLET_PAYMENT_METHODS: "/wallet/payment-methods",

  // ===========================================================================
  // Support
  // ===========================================================================

  /**
   * Authenticated member support collection.
   */
  SUPPORT: "/support",

  /**
   * Create a new support case.
   */
  SUPPORT_NEW: "/support/new",

  /**
   * Authenticated support case detail.
   */
  SUPPORT_CASE: (supportCasePublicId: string) =>
    `/support/cases/${encodeURIComponent(supportCasePublicId)}`,

  // ===========================================================================
  // Settings
  // ===========================================================================

  /**
   * Authenticated application settings.
   */
  SETTINGS: "/settings",
} as const;

// -----------------------------------------------------------------------------
// Route Type
// -----------------------------------------------------------------------------
//
// Static routes are represented directly.
//
// Dynamic route builders are functions and therefore intentionally excluded
// from AuthenticatedRoute.
//
// -----------------------------------------------------------------------------

type AuthenticatedRouteValue =
  (typeof AUTHENTICATED_ROUTES)[keyof typeof AUTHENTICATED_ROUTES];

export type AuthenticatedRoute = Extract<
  AuthenticatedRouteValue,
  string
>;