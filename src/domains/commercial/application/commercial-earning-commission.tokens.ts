export const COMMERCIAL_EARNING_COMMISSION_TOKENS = {
  REPOSITORY: Symbol('CommercialEarningCommissionRepository'),

  COMMAND_HANDLERS: {
    CREATE: Symbol('CreateCommercialEarningCommissionHandler'),
    ASSESS: Symbol('AssessCommercialEarningCommissionHandler'),
    CANCEL: Symbol('CancelCommercialEarningCommissionHandler'),
  } as const,

  QUERY_HANDLERS: {
    GET: Symbol('GetCommercialEarningCommissionHandler'),
    GET_BY_SETTLEMENT: Symbol(
      'GetCommercialEarningCommissionBySettlementHandler',
    ),
    GET_BY_JOURNEY: Symbol('GetCommercialEarningCommissionsByJourneyHandler'),
    GET_BY_PROVIDER: Symbol('GetCommercialEarningCommissionsByProviderHandler'),
    LIST: Symbol('ListCommercialEarningCommissionsHandler'),
  } as const,
} as const;
