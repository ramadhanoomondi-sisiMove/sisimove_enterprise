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
// - authenticate users;
// - inspect authentication state;
// - restore sessions;
// - redirect unauthenticated users;
// - enforce verification;
// - enforce marketplace capabilities;
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
// After creation, every subsequent step is identified by journeyPublicId:
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
// The frontend therefore never creates a Journey aggregate for each step.
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
// Subsequent steps operate on the existing journeyDemandPublicId:
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
// This separation is intentional and required by Next.js dynamic route
// matching.
//
// -----------------------------------------------------------------------------

export const AUTHENTICATED_ROUTES = {
  // ===========================================================================
  // Marketplace
  // ===========================================================================

  /**
   * Authenticated marketplace home.
   *
   * The marketplace remains the central application surface after login.
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
   */
  MY_JOURNEYS: "/my-journeys",

  /**
   * Journey creation entry point.
   *
   * This page creates the Journey draft exactly once.
   */
  MY_JOURNEY_NEW: "/my-journeys/new",

  /**
   * Authenticated Journey owner-management surface.
   */
  MY_JOURNEY: (journeyPublicId: string) =>
    `/my-journeys/${encodeURIComponent(journeyPublicId)}`,

  /**
   * Authenticated Journey editing surface.
   */
  MY_JOURNEY_EDIT: (journeyPublicId: string) =>
    `/my-journeys/${encodeURIComponent(journeyPublicId)}/edit`,

  // ===========================================================================
  // Journey creation workflow
  // ===========================================================================
  //
  // The Journey aggregate is created by:
  //
  //     POST /journeys
  //
  // through the /my-journeys/new entry surface.
  //
  // Once created, the existing Journey aggregate is progressively assembled
  // through its actual application commands.
  //
  // ===========================================================================

  JOURNEY_CREATE: (journeyPublicId: string) =>
    `/my-journeys/${encodeURIComponent(journeyPublicId)}/edit`,

  JOURNEY_CREATE_ROUTE: (journeyPublicId: string) =>
    `/my-journeys/${encodeURIComponent(journeyPublicId)}/edit/route`,

  JOURNEY_CREATE_SCHEDULE: (journeyPublicId: string) =>
    `/my-journeys/${encodeURIComponent(journeyPublicId)}/edit/schedule`,

  JOURNEY_CREATE_VEHICLE: (journeyPublicId: string) =>
    `/my-journeys/${encodeURIComponent(journeyPublicId)}/edit/vehicle`,

  JOURNEY_CREATE_SEATS: (journeyPublicId: string) =>
    `/my-journeys/${encodeURIComponent(journeyPublicId)}/edit/seats`,

  JOURNEY_CREATE_PRICING: (journeyPublicId: string) =>
    `/my-journeys/${encodeURIComponent(journeyPublicId)}/edit/pricing`,

  JOURNEY_CREATE_PREFERENCES: (journeyPublicId: string) =>
    `/my-journeys/${encodeURIComponent(journeyPublicId)}/edit/preferences`,

  JOURNEY_CREATE_PHOTOS: (journeyPublicId: string) =>
    `/my-journeys/${encodeURIComponent(journeyPublicId)}/edit/photos`,

  JOURNEY_CREATE_REVIEW: (journeyPublicId: string) =>
    `/my-journeys/${encodeURIComponent(journeyPublicId)}/edit/review`,

  // ===========================================================================
  // Journey operational surfaces
  // ===========================================================================

  /**
   * Authenticated Journey management/detail surface.
   */
  JOURNEY: (journeyPublicId: string) =>
    `/my-journeys/${encodeURIComponent(journeyPublicId)}`,

  /**
   * Authenticated Journey editor.
   */
  JOURNEY_EDIT: (journeyPublicId: string) =>
    `/my-journeys/${encodeURIComponent(journeyPublicId)}/edit`,

  /**
   * Journey boarding operational surface.
   */
  JOURNEY_BOARDING: (journeyPublicId: string) =>
    `/my-journeys/${encodeURIComponent(journeyPublicId)}/boarding`,

  /**
   * Journey completion operational surface.
   *
   * Journey.publicId identifies the operational Journey context.
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
   * Authenticated Journey Demand owner-management surface.
   */
  MY_DEMAND: (journeyDemandPublicId: string) =>
    `/my-demands/${encodeURIComponent(journeyDemandPublicId)}`,

  /**
   * Authenticated Journey Demand editing surface.
   */
  MY_DEMAND_EDIT: (journeyDemandPublicId: string) =>
    `/my-demands/${encodeURIComponent(journeyDemandPublicId)}/edit`,

  // ===========================================================================
  // Journey Demand creation workflow
  // ===========================================================================
  //
  // The JourneyDemand aggregate is created by the /my-demands/new entry
  // surface exactly once.
  //
  // Subsequent steps operate on that existing aggregate.
  //
  // ===========================================================================

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

  // ===========================================================================
  // Bookings
  // ===========================================================================

  /**
   * Authenticated traveller's booking collection.
   */
  MY_BOOKINGS: "/my-bookings",

  /**
   * Authenticated booking detail.
   */
  BOOKING: (journeyBookingPublicId: string) =>
    `/bookings/${encodeURIComponent(journeyBookingPublicId)}`,

  // ===========================================================================
  // Assets
  // ===========================================================================

  ASSETS: "/assets",

  // ===========================================================================
  // Messaging
  // ===========================================================================

  MESSAGES: "/messages",

  MESSAGING_CONVERSATION: (conversationPublicId: string) =>
    `/messages/${encodeURIComponent(conversationPublicId)}`,

  // ===========================================================================
  // Notifications
  // ===========================================================================

  NOTIFICATIONS: "/notifications",

  NOTIFICATION: (notificationPublicId: string) =>
    `/notifications/${encodeURIComponent(notificationPublicId)}`,

  NOTIFICATION_SETTINGS: "/settings/notifications",

  // ===========================================================================
  // Traveller Profile
  // ===========================================================================

  PROFILE: "/profile",

  PROFILE_VERIFICATION: "/profile/verification",

  // ===========================================================================
  // Financial / Wallet
  // ===========================================================================

  WALLET: "/wallet",

  WALLET_TOP_UP: "/wallet/top-up",

  WALLET_WITHDRAW: "/wallet/withdraw",

  WALLET_TRANSACTIONS: "/wallet/transactions",

  WALLET_TRANSACTION: (transactionPublicId: string) =>
    `/wallet/transactions/${encodeURIComponent(transactionPublicId)}`,

  WALLET_PAYMENT_METHODS: "/wallet/payment-methods",

  // ===========================================================================
  // Support
  // ===========================================================================

  SUPPORT: "/support",

  SUPPORT_NEW: "/support/new",

  SUPPORT_CASE: (supportCasePublicId: string) =>
    `/support/cases/${encodeURIComponent(supportCasePublicId)}`,

  // ===========================================================================
  // Settings
  // ===========================================================================

  SETTINGS: "/settings",
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
// -----------------------------------------------------------------------------

type AuthenticatedRouteValue =
  (typeof AUTHENTICATED_ROUTES)[keyof typeof AUTHENTICATED_ROUTES];

export type AuthenticatedRoute = Extract<
  AuthenticatedRouteValue,
  string
>;

