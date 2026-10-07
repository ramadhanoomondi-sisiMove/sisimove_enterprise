// -----------------------------------------------------------------------------
// Path: src/foundation/routing/authenticated-routes.ts
// -----------------------------------------------------------------------------
// sisiMove — Authenticated Routes
// -----------------------------------------------------------------------------
//
// Canonical routes for authenticated application surfaces.
//
// This file defines URL construction only.
//
// It does NOT:
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

export const AUTHENTICATED_ROUTES = {
  // ===========================================================================
  // Application Home
  // ===========================================================================

  /**
   * Authenticated application home / Journey marketplace entry point.
   */
  HOME: "/home",

  // ===========================================================================
  // My Journeys
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
   */
  MY_JOURNEY: (journeyPublicId: string) =>
    `/my-journeys/${encodeURIComponent(journeyPublicId)}`,

  // ===========================================================================
  // Journey Creation / Editing Workflow
  // ===========================================================================

  /**
   * Journey creation/edit workflow root.
   */
  JOURNEY_CREATE: (journeyPublicId: string) =>
    `/my-journeys/${encodeURIComponent(journeyPublicId)}/edit`,

  /**
   * Journey route creation/edit step.
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
   */
  JOURNEY_BOARDING: (journeyPublicId: string) =>
    `/my-journeys/${encodeURIComponent(journeyPublicId)}/boarding`,

  /**
   * Journey completion operational surface.
   */
  JOURNEY_COMPLETION: (journeyPublicId: string) =>
    `/my-journeys/${encodeURIComponent(journeyPublicId)}/completion`,

  // ===========================================================================
  // Bookings
  // ===========================================================================

  /**
   * Authenticated traveller's booking collection.
   */
  MY_BOOKINGS: "/my-bookings",

  /**
   * Booking creation/review entry point.
   *
   * This does NOT represent an existing Booking aggregate.
   */
  BOOKING_NEW: (journeyPublicId: string) =>
    `/bookings/new?journeyPublicId=${encodeURIComponent(journeyPublicId)}`,

  /**
   * Authenticated booking detail.
   */
  BOOKING: (bookingPublicId: string) =>
    `/bookings/${encodeURIComponent(bookingPublicId)}`,

  // ===========================================================================
  // Verification
  // ===========================================================================

  /**
   * Dedicated authenticated verification onboarding flow.
   */
  VERIFICATION: "/verification",

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
   * Authenticated member verification management surface.
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

type AuthenticatedRouteValue =
  (typeof AUTHENTICATED_ROUTES)[keyof typeof AUTHENTICATED_ROUTES];

export type AuthenticatedRoute = Extract<
  AuthenticatedRouteValue,
  string
>;