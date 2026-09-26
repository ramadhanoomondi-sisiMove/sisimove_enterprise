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
//
// Journey creation
//
// Journey creation is a guided workflow around an already-created
// server-side Journey aggregate in DRAFT status.
//
// The entry route creates the draft exactly once.
//
// Every subsequent creation step is identified by journeyPublicId.
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
  //
  // Authenticated Messaging conversation surface.
  //
  // The conversation identifier exposed by the UI is MessagingConversation's
  // publicId. Internal persistence IDs are never exposed.
  //
  // Conversation and message lifecycle operations remain mutations performed
  // by their respective Messaging components.
  //
  // ---------------------------------------------------------------------------

  MESSAGES: '/messages',

  MESSAGING_CONVERSATION: (
    conversationPublicId: string,
  ) =>
    `/messages/${conversationPublicId}`,

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
  // Journey Boarding
  // ---------------------------------------------------------------------------
  //
  // Authenticated operational surface for boarding a specific Journey.
  //
  // The URL intentionally uses Journey.publicId rather than the internal
  // JourneyBoarding persistence ID.
  //
  // Backend resource:
  //
  //     /journey-boardings/...
  //
  // Authenticated UI:
  //
  //     /journeys/[journeyPublicId]/boarding
  //
  // The boarding aggregate is resolved from the Journey public identifier.
  //
  // Lifecycle and participant mutations remain actions on this surface:
  //
  //     open
  //     board provider
  //     board passenger
  //     mark passenger no-show
  //     withdraw participant
  //     remove participant
  //     start journey
  //     cancel boarding
  //
  // They are not represented as artificial page routes.
  //
  // ---------------------------------------------------------------------------

  JOURNEY_BOARDING: (journeyPublicId: string) =>
    `/journeys/${journeyPublicId}/boarding`,

  // ---------------------------------------------------------------------------
  // Journey Completion
  // ---------------------------------------------------------------------------
  //
  // Authenticated operational surface for Journey Completion.
  //
  // The URL intentionally uses Journey.publicId rather than the internal
  // JourneyCompletion persistence ID.
  //
  // Backend resources:
  //
  //     /journey-completions/...
  //     /journey-settlements/...
  //
  // Authenticated UI:
  //
  //     /journeys/[journeyPublicId]/completion
  //
  // Completion is resolved in Journey context.
  //
  // The surface may display:
  //
  //     - completion lifecycle status;
  //     - confirmation progress;
  //     - completion confirmations;
  //     - completion disputes;
  //     - settlement status.
  //
  // Lifecycle mutations remain actions on this surface:
  //
  //     request completion
  //     confirm completion
  //     withdraw confirmation
  //     cancel completion
  //     report a problem
  //     withdraw dispute
  //
  // Settlement lifecycle is not exposed as page routes. Settlement is
  // observed from the completion surface while financial processing remains
  // backend/domain-owned.
  //
  // ---------------------------------------------------------------------------

  JOURNEY_COMPLETION: (journeyPublicId: string) =>
    `/journeys/${journeyPublicId}/completion`,

  // ---------------------------------------------------------------------------
  // Journey-demand management
  // ---------------------------------------------------------------------------

  JOURNEY_DEMANDS: '/journey-demands',

  JOURNEY_DEMAND_CREATE_START: '/journey-demands/create',

  JOURNEY_DEMAND_CREATE: (
    journeyDemandPublicId: string,
  ) =>
    `/journey-demands/create/${journeyDemandPublicId}`,

  JOURNEY_DEMAND_CREATE_ROUTE: (
    journeyDemandPublicId: string,
  ) =>
    `/journey-demands/create/${journeyDemandPublicId}/route`,

  JOURNEY_DEMAND_CREATE_SCHEDULE: (
    journeyDemandPublicId: string,
  ) =>
    `/journey-demands/create/${journeyDemandPublicId}/schedule`,

  JOURNEY_DEMAND_CREATE_SEATS: (
    journeyDemandPublicId: string,
  ) =>
    `/journey-demands/create/${journeyDemandPublicId}/seats`,

  JOURNEY_DEMAND_CREATE_PRICING: (
    journeyDemandPublicId: string,
  ) =>
    `/journey-demands/create/${journeyDemandPublicId}/pricing`,

  JOURNEY_DEMAND_CREATE_REVIEW: (
    journeyDemandPublicId: string,
  ) =>
    `/journey-demands/create/${journeyDemandPublicId}/review`,

  // ---------------------------------------------------------------------------
  // Journey-demand detail
  // ---------------------------------------------------------------------------

  JOURNEY_DEMAND: (
    journeyDemandPublicId: string,
  ) =>
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
  // The booking identifier exposed in the URL is always
  // JourneyBooking.publicId.
  //
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

  BOOKING: (
    journeyBookingPublicId: string,
  ) =>
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

  WALLET_TRANSACTION: (
    transactionPublicId: string,
  ) =>
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