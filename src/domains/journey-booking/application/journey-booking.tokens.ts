// src/domains/journey-booking/application/journey-booking.tokens.ts

// -----------------------------------------------------------------------------
// Journey Booking — Dependency Injection Tokens
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
