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
// Public marketplace resources and authenticated application resources use
// different URL namespaces.
//
// Public Journey:
//
//     /journeys/[publicId]
//
// Authenticated owner-management:
//
//     /my-journeys/[publicId]
//
// Authenticated booking:
//
//     /bookings/new?journeyPublicId=[journeyPublicId]
//     /bookings/[bookingPublicId]
//
// Route groups do not distinguish dynamic URL patterns. Explicit /my-*
// and /bookings namespaces therefore keep the application boundaries clear.
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
// The public Journey detail is shareable and may be viewed without
// authentication.
//
// Authentication is required when the visitor proceeds into an authenticated
// capability such as booking.
//
// The authenticated owner-management Journey remains:
//
//     /my-journeys/[publicId]
//
// The public Journey route is therefore NOT an owner-management route.
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
// There is intentionally no separate:
//
//     /journeys/[publicId]/edit
//
// route.
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
// BOOKING ROUTING
// -----------------------------------------------------------------------------
//
// Booking is a separate aggregate and application boundary from Journey.
//
// The booking flow therefore belongs to the /bookings namespace rather than
// becoming a child route of /journeys/[publicId].
//
// The flow is:
//
//     /journeys/[journeyPublicId]
//             │
//             │ Book Journey
//             ▼
//     /bookings/new?journeyPublicId=[journeyPublicId]
//             │
//             │ review / confirm booking
//             ▼
//     booking creation
//             │
//             ▼
//     /bookings/[bookingPublicId]
//
// The Journey public detail answers:
//
//     "What Journey is available?"
//
// The booking creation/review surface answers:
//
//     "What am I about to book?"
//
// The persisted booking detail answers:
//
//     "What booking did I create?"
//
// The authenticated booking collection is:
//
//     /my-bookings
//
// Individual persisted booking detail remains:
//
//     /bookings/[bookingPublicId]
//
// IMPORTANT:
//
//     BOOKING_NEW
//
// does NOT identify a persisted Booking aggregate yet.
//
// It identifies the booking creation/review workflow using the Journey public
// ID as its input.
//
// After successful booking creation, the application navigates to:
//
//     BOOKING(bookingPublicId)
//
// The booking's own public ID then becomes the canonical identifier.
//
// -----------------------------------------------------------------------------
//
// VERIFICATION ROUTING
// -----------------------------------------------------------------------------
//
// Verification intentionally has TWO authenticated surfaces.
//
// Dedicated verification onboarding:
//
//     /verification
//
// This is the "Get Verified" entry point for authenticated members who have
// not yet reached a verification level.
//
// Verification management:
//
//     /profile/verification
//
// This is the member-profile verification management surface. It is NOT the
// onboarding route and should not be used as the primary "Get Verified"
// navigation destination.
//
// Navigation presentation:
//
//     NONE
//         → Get Verified
//
//     MEMBER
//         → My Bookings
//
//     DRIVER
//         → My Journeys
//         → My Bookings
//
// These navigation decisions are presentation concerns only.
//
// This route definition does not enforce verification. Verification
// authorization remains the responsibility of the corresponding application
// boundary and backend authorization layer.
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
   * Authenticated application home / Journey marketplace entry point.
   *
   * The authenticated home is supply-first and Journey-focused.
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
  // Bookings
  // ===========================================================================
  //
  // Booking is a separate aggregate and application boundary from Journey.
  //
  // ===========================================================================
  
  /**
   * Authenticated traveller's booking collection.
   *
   * This is the member-facing collection of persisted bookings.
   */
  MY_BOOKINGS: "/my-bookings",

  /**
   * Booking creation/review entry point.
   *
   * This route does NOT represent an existing Booking aggregate.
   *
   * It receives the Journey public ID that the traveller intends to book:
   *
   *     /bookings/new?journeyPublicId=[journeyPublicId]
   *
   * The booking workflow resolves the Journey through its public ID,
   * presents the booking review surface, and creates the Booking only when
   * the traveller confirms.
   *
   * After successful creation, navigation proceeds to BOOKING().
   */
  BOOKING_NEW: (journeyPublicId: string) =>
    `/bookings/new?journeyPublicId=${encodeURIComponent(journeyPublicId)}`,

  /**
   * Authenticated booking detail.
   *
   * This route represents an existing persisted Booking aggregate.
   *
   * Booking uses its own public namespace because a Booking is a separate
   * aggregate and application boundary from Journey.
   */
  BOOKING: (bookingPublicId: string) =>
    `/bookings/${encodeURIComponent(bookingPublicId)}`,

  // ===========================================================================
  // Verification
  // ===========================================================================
  //
  // Verification has intentionally separate onboarding and management
  // surfaces.
  //
  //     /verification
  //         Dedicated "Get Verified" onboarding flow.
  //
  //     /profile/verification
  //         Verification management from the member profile.
  //
  // The authenticated navigation uses VERIFICATION when the current
  // VerificationLevel is NONE.
  //
  // ===========================================================================

  /**
   * Dedicated authenticated verification onboarding flow.
   *
   * This is the destination for:
   *
   *     VerificationLevel.NONE
   *         ↓
   *     Get Verified
   *
   * This is intentionally separate from PROFILE_VERIFICATION.
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
   *
   * This route belongs to Profile and is intended for managing the member's
   * existing verification state.
   *
   * It is intentionally NOT the "Get Verified" onboarding destination.
   *
   * The dedicated onboarding route is:
   *
   *     AUTHENTICATED_ROUTES.VERIFICATION
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
