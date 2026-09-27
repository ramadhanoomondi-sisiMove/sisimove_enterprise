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
//         Authenticated support case collection.
//
//     /support/new
//         Authenticated Support case creation surface.
//
//     /support/cases/[supportCasePublicId]
//         Authenticated Support case detail and conversation surface.
//
//     /settings
//         Authenticated application settings surface.
//
//     /notifications
//         Authenticated notification collection.
//
//     /notifications/[notificationPublicId]
//         Authenticated notification detail surface.
//
//     /settings/notifications
//         Authenticated notification preference settings.
//
// -----------------------------------------------------------------------------
// Messaging
// -----------------------------------------------------------------------------
//
//     /messages
//         Authenticated Messaging conversation list.
//
//     /messages/[conversationPublicId]
//         Authenticated Messaging conversation detail surface.
//
// Messaging is intentionally a separate authenticated application surface.
//
// The conversation public identifier is exposed in the URL because the
// conversation is itself a navigable Messaging resource.
//
// Internal persistence identifiers must never be exposed.
//
// Message and conversation lifecycle operations remain mutations performed by
// their respective action components. They are not represented as artificial
// page routes.
//
// -----------------------------------------------------------------------------
// Journey Boarding
// -----------------------------------------------------------------------------
//
//     /journeys/[journeyPublicId]/boarding
//         Authenticated Journey Boarding operational surface.
//
// Journey Boarding is intentionally nested under the Journey detail route.
//
// The boarding identifier is not exposed in the URL because the operational
// boarding surface is entered in the context of a specific Journey.
//
// The backend resolves the Journey Boarding aggregate from the journey's
// public identifier.
//
// This route is distinct from Journey Booking:
//
//     /journeys/[journeyPublicId]/boarding
//         Operational boarding of a Journey.
//
//     /bookings/[journeyBookingPublicId]
//         Individual traveller booking lifecycle.
//
// -----------------------------------------------------------------------------
// Journey Completion
// -----------------------------------------------------------------------------
//
//     /journeys/[journeyPublicId]/completion
//         Authenticated Journey Completion operational surface.
//
// Journey Completion is intentionally nested under the Journey detail route.
//
// The URL uses Journey.publicId rather than JourneyCompletion.publicId.
//
// The completion aggregate is associated with a Journey and is therefore
// presented in Journey context.
//
// The surface may present:
//
//     - completion status;
//     - confirmation progress;
//     - passenger/provider confirmations;
//     - completion disputes;
//     - settlement status.
//
// Completion and settlement lifecycle operations remain domain mutations
// performed by their respective action components. They are not represented
// as artificial page routes.
//
// Settlement is observational on the completion surface. Financial settlement
// lifecycle remains owned by the backend/domain workflow.
//
// -----------------------------------------------------------------------------
// Journey creation
// -----------------------------------------------------------------------------
//
// Journey creation is a guided workflow around an already-created
// server-side Journey aggregate in DRAFT status.
//
// The entry route creates the draft exactly once.
//
// Every subsequent creation step is identified by journeyPublicId.
//
// -----------------------------------------------------------------------------
// Journey-demand creation
// -----------------------------------------------------------------------------
//
// Journey-demand creation is a guided workflow around an already-created
// server-side JourneyDemand aggregate.
//
// The entry route creates the demand exactly once.
//
// Every subsequent creation step is identified by journeyDemandPublicId.
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
  // Messaging
  // ---------------------------------------------------------------------------

  MESSAGES: '/messages',

  MESSAGING_CONVERSATION: (
    conversationPublicId: string,
  ) =>
    `/messages/${encodeURIComponent(conversationPublicId)}`,

  // ---------------------------------------------------------------------------
  // Notifications
  // ---------------------------------------------------------------------------

  NOTIFICATIONS: '/notifications',

  NOTIFICATION: (
    notificationPublicId: string,
  ) =>
    `/notifications/${encodeURIComponent(notificationPublicId)}`,

  // ---------------------------------------------------------------------------
  // Notification preferences
  // ---------------------------------------------------------------------------

  NOTIFICATION_SETTINGS: '/settings/notifications',

  // ---------------------------------------------------------------------------
  // Journey creation
  // ---------------------------------------------------------------------------

  JOURNEY_CREATE_START: '/journeys/create',

  JOURNEY_CREATE: (
    journeyPublicId: string,
  ) =>
    `/journeys/create/${encodeURIComponent(journeyPublicId)}`,

  JOURNEY_CREATE_ROUTE: (
    journeyPublicId: string,
  ) =>
    `/journeys/create/${encodeURIComponent(journeyPublicId)}/route`,

  JOURNEY_CREATE_SCHEDULE: (
    journeyPublicId: string,
  ) =>
    `/journeys/create/${encodeURIComponent(journeyPublicId)}/schedule`,

  JOURNEY_CREATE_VEHICLE: (
    journeyPublicId: string,
  ) =>
    `/journeys/create/${encodeURIComponent(journeyPublicId)}/vehicle`,

  JOURNEY_CREATE_SEATS: (
    journeyPublicId: string,
  ) =>
    `/journeys/create/${encodeURIComponent(journeyPublicId)}/seats`,

  JOURNEY_CREATE_PRICING: (
    journeyPublicId: string,
  ) =>
    `/journeys/create/${encodeURIComponent(journeyPublicId)}/pricing`,

  JOURNEY_CREATE_PREFERENCES: (
    journeyPublicId: string,
  ) =>
    `/journeys/create/${encodeURIComponent(journeyPublicId)}/preferences`,

  JOURNEY_CREATE_PHOTOS: (
    journeyPublicId: string,
  ) =>
    `/journeys/create/${encodeURIComponent(journeyPublicId)}/photos`,

  JOURNEY_CREATE_REVIEW: (
    journeyPublicId: string,
  ) =>
    `/journeys/create/${encodeURIComponent(journeyPublicId)}/review`,

  // ---------------------------------------------------------------------------
  // Journey detail
  // ---------------------------------------------------------------------------

  JOURNEY: (
    journeyPublicId: string,
  ) =>
    `/journeys/${encodeURIComponent(journeyPublicId)}`,

  // ---------------------------------------------------------------------------
  // Journey Boarding
  // ---------------------------------------------------------------------------

  JOURNEY_BOARDING: (
    journeyPublicId: string,
  ) =>
    `/journeys/${encodeURIComponent(journeyPublicId)}/boarding`,

  // ---------------------------------------------------------------------------
  // Journey Completion
  // ---------------------------------------------------------------------------

  JOURNEY_COMPLETION: (
    journeyPublicId: string,
  ) =>
    `/journeys/${encodeURIComponent(journeyPublicId)}/completion`,

  // ---------------------------------------------------------------------------
  // Journey-demand management
  // ---------------------------------------------------------------------------

  JOURNEY_DEMANDS: '/journey-demands',

  JOURNEY_DEMAND_CREATE_START: '/journey-demands/create',

  JOURNEY_DEMAND_CREATE: (
    journeyDemandPublicId: string,
  ) =>
    `/journey-demands/create/${encodeURIComponent(journeyDemandPublicId)}`,

  JOURNEY_DEMAND_CREATE_ROUTE: (
    journeyDemandPublicId: string,
  ) =>
    `/journey-demands/create/${encodeURIComponent(journeyDemandPublicId)}/route`,

  JOURNEY_DEMAND_CREATE_SCHEDULE: (
    journeyDemandPublicId: string,
  ) =>
    `/journey-demands/create/${encodeURIComponent(journeyDemandPublicId)}/schedule`,

  JOURNEY_DEMAND_CREATE_SEATS: (
    journeyDemandPublicId: string,
  ) =>
    `/journey-demands/create/${encodeURIComponent(journeyDemandPublicId)}/seats`,

  JOURNEY_DEMAND_CREATE_PRICING: (
    journeyDemandPublicId: string,
  ) =>
    `/journey-demands/create/${encodeURIComponent(journeyDemandPublicId)}/pricing`,

  JOURNEY_DEMAND_CREATE_REVIEW: (
    journeyDemandPublicId: string,
  ) =>
    `/journey-demands/create/${encodeURIComponent(journeyDemandPublicId)}/review`,

  // ---------------------------------------------------------------------------
  // Journey-demand detail
  // ---------------------------------------------------------------------------

  JOURNEY_DEMAND: (
    journeyDemandPublicId: string,
  ) =>
    `/journey-demands/${encodeURIComponent(journeyDemandPublicId)}`,

  // ---------------------------------------------------------------------------
  // Journey Booking
  // ---------------------------------------------------------------------------

  BOOKING: (
    journeyBookingPublicId: string,
  ) =>
    `/bookings/${encodeURIComponent(journeyBookingPublicId)}`,

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

  WALLET_TRANSACTION: (
    transactionPublicId: string,
  ) =>
    `/wallet/transactions/${encodeURIComponent(transactionPublicId)}`,

  WALLET_PAYMENT_METHODS: '/wallet/payment-methods',

  // ---------------------------------------------------------------------------
  // Application support
  // ---------------------------------------------------------------------------
  //
  // Support is a member-facing authenticated application surface.
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
  // The only Support identifier exposed by the URL is SupportCase.publicId.
  //
  // Internal persistence IDs, case IDs, participant IDs, message IDs, note
  // IDs, and other internal identifiers must never be exposed as route
  // identifiers.
  //
  // Support mutations remain actions performed from the appropriate surface.
  // They are not represented as artificial page routes.
  //
  // ---------------------------------------------------------------------------

  SUPPORT: '/support',

  SUPPORT_NEW: '/support/new',

  SUPPORT_CASE: (
    supportCasePublicId: string,
  ) =>
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

