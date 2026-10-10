// src/domains/journey-booking/application/journey-booking.tokens.ts

// -----------------------------------------------------------------------------
// sisiMove — Journey Booking Dependency Injection Tokens
// -----------------------------------------------------------------------------
//
// Central registry of dependency-injection tokens used by the Journey Booking
// application layer.
//
// Command handlers are separated by responsibility:
//
//   - Booking creation
//   - Booking component assembly
//   - Booking lifecycle
//   - Payment lifecycle
//   - Atomic payment + booking confirmation
//
// Query handlers are separated by responsibility:
//
//   - Journey Booking queries
//   - Detail/read-model queries
//   - Discovery queries
//
// Detail queries have dedicated handlers because they are purpose-specific
// application read use cases that compose:
//
//   Journey Booking
//        ↓
//   Journey
//        ↓
//   Provider Member
//      ↙     ↘
// Traveller   Trust
//
// Individual booking detail and passenger booking collection detail remain
// separate use cases.
//
// -----------------------------------------------------------------------------

export const JOURNEY_BOOKING_TOKENS = {
  // ===========================================================================
  // Repository
  // ===========================================================================

  REPOSITORY: Symbol('JourneyBookingRepository'),

  // ===========================================================================
  // Command Handlers
  // ===========================================================================

  COMMAND_HANDLERS: {
    // -------------------------------------------------------------------------
    // Journey Booking Creation
    // -------------------------------------------------------------------------

    CREATE: Symbol('CreateJourneyBookingHandler'),

    // -------------------------------------------------------------------------
    // Booking Components
    // -------------------------------------------------------------------------

    CREATE_SNAPSHOT: Symbol('CreateJourneyBookingSnapshotHandler'),

    SET_PRICING: Symbol('SetJourneyBookingPricingHandler'),

    CREATE_PAYMENT: Symbol('CreateJourneyBookingPaymentHandler'),

    // -------------------------------------------------------------------------
    // Journey Booking Lifecycle
    // -------------------------------------------------------------------------

    CONFIRM: Symbol('ConfirmJourneyBookingHandler'),

    /**
     * Atomically authorizes payment and confirms the Journey Booking.
     *
     * This handler owns the application workflow that coordinates:
     *
     *   Payment authorization
     *        +
     *   Financial reservation
     *        +
     *   Booking confirmation
     *        +
     *   Journey capacity reservation
     *
     * All participating persistence operations execute inside one
     * PrismaUnitOfWork transaction.
     */
    CONFIRM_WITH_PAYMENT: Symbol('ConfirmJourneyBookingWithPaymentHandler'),

    CANCEL: Symbol('CancelJourneyBookingHandler'),

    COMPLETE: Symbol('CompleteJourneyBookingHandler'),

    EXPIRE: Symbol('ExpireJourneyBookingHandler'),

    // -------------------------------------------------------------------------
    // Payment Lifecycle
    // -------------------------------------------------------------------------

    AUTHORIZE_PAYMENT: Symbol('AuthorizeJourneyBookingPaymentHandler'),

    CAPTURE_PAYMENT: Symbol('CaptureJourneyBookingPaymentHandler'),

    FAIL_PAYMENT: Symbol('FailJourneyBookingPaymentHandler'),

    REFUND_PAYMENT: Symbol('RefundJourneyBookingPaymentHandler'),

    PARTIALLY_REFUND_PAYMENT: Symbol(
      'PartiallyRefundJourneyBookingPaymentHandler',
    ),
  },

  // ===========================================================================
  // Query Handlers
  // ===========================================================================

  QUERY_HANDLERS: {
    // -------------------------------------------------------------------------
    // Journey Booking
    // -------------------------------------------------------------------------

    GET: Symbol('GetJourneyBookingQueryHandler'),

    GET_BY_PUBLIC_ID: Symbol('GetJourneyBookingByPublicIdQueryHandler'),

    GET_MY: Symbol('GetMyJourneyBookingsQueryHandler'),

    // -------------------------------------------------------------------------
    // Detail
    // -------------------------------------------------------------------------
    //
    // Purpose-specific passenger-facing booking detail.
    //
    // GET_DETAIL:
    //   Returns the detailed representation of one authorized booking.
    //
    // GET_MY_DETAILS:
    //   Returns detailed representations of the authenticated passenger's
    //   booking collection.
    //
    // Both use cases compose information across bounded-context boundaries.
    //
    // -------------------------------------------------------------------------

    GET_DETAIL: Symbol('GetJourneyBookingDetailQueryHandler'),

    GET_MY_DETAILS: Symbol('GetMyJourneyBookingDetailsQueryHandler'),

    // -------------------------------------------------------------------------
    // Discovery
    // -------------------------------------------------------------------------

    FIND_BY_JOURNEY: Symbol('FindJourneyBookingsByJourneyQueryHandler'),

    FIND_BY_PASSENGER: Symbol('FindJourneyBookingsByPassengerQueryHandler'),

    FIND_BY_STATUS: Symbol('FindJourneyBookingsByStatusQueryHandler'),

    FIND_BY_JOURNEY_AND_PASSENGER: Symbol(
      'FindJourneyBookingsByJourneyAndPassengerQueryHandler',
    ),

    FIND_BY_TRANSACTION: Symbol('FindJourneyBookingByTransactionQueryHandler'),
  },
} as const;
