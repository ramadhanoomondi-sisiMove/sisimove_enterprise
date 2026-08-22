export const COMMERCIAL_BOOKING_COMMISSION_TOKENS = {
  REPOSITORY: Symbol('CommercialBookingCommissionRepository'),

  COMMAND_HANDLERS: {
    CREATE: Symbol('CreateCommercialBookingCommissionHandler'),
    ASSESS: Symbol('AssessCommercialBookingCommissionHandler'),
    CANCEL: Symbol('CancelCommercialBookingCommissionHandler'),
  } as const,

  QUERY_HANDLERS: {
    GET: Symbol('GetCommercialBookingCommissionHandler'),
    GET_BY_BOOKING: Symbol('GetCommercialBookingCommissionByBookingHandler'),
    GET_BY_JOURNEY: Symbol('GetCommercialBookingCommissionsByJourneyHandler'),
    LIST: Symbol('ListCommercialBookingCommissionsHandler'),
  } as const,
} as const;
