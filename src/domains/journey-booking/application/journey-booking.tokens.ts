// -----------------------------------------------------------------------------
// src/domains/journey-booking/application/journey-booking.tokens.ts
// -----------------------------------------------------------------------------
//
// sisiMove — Journey Booking Dependency Injection Tokens
//
// Central registry of dependency-injection tokens used by the Journey Booking
// application layer.
//
// Query handlers are separated by responsibility:
//
//   - Journey Booking queries
//   - Detail/read-model queries
//   - Discovery queries
//
// The detail query has its own handler because it is a purpose-specific
// application read use case that composes:
//
//   Journey Booking
//        ↓
//   Journey
//        ↓
//   Provider Member
//      ↙     ↘
// Traveller   Trust
//
// It must therefore remain distinct from the generic aggregate retrieval
// handlers.
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
    // Journey Booking Lifecycle
    // -------------------------------------------------------------------------

    CREATE: Symbol('CreateJourneyBookingHandler'),

    CONFIRM: Symbol('ConfirmJourneyBookingHandler'),

    CANCEL: Symbol('CancelJourneyBookingHandler'),

    COMPLETE: Symbol('CompleteJourneyBookingHandler'),

    EXPIRE: Symbol('ExpireJourneyBookingHandler'),

    // -------------------------------------------------------------------------
    // Payment
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
    // Unlike GET / GET_BY_PUBLIC_ID, this handler does not simply expose the
    // JourneyBooking aggregate. It performs application-level composition and
    // authorization for the booking detail read model.
    //
    // -------------------------------------------------------------------------

    GET_DETAIL: Symbol('GetJourneyBookingDetailQueryHandler'),

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
