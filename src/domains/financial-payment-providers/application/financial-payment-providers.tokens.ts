// -----------------------------------------------------------------------------
// Financial Payment Provider Application Tokens
// -----------------------------------------------------------------------------
//
// Central dependency-injection tokens for the Financial Payment Provider
// application layer.
//
// Covers:
// - repository
// - command handlers
// - query handlers
//
// -----------------------------------------------------------------------------

export const FINANCIAL_PAYMENT_PROVIDER_TOKENS = {
  // ===========================================================================
  // Repository
  // ===========================================================================

  REPOSITORY: Symbol('FinancialPaymentProviderRepository'),

  // ===========================================================================
  // Command Handlers
  // ===========================================================================

  COMMAND_HANDLERS: {
    CREATE: Symbol('CreateFinancialPaymentProviderHandler'),

    UPDATE: Symbol('UpdateFinancialPaymentProviderHandler'),

    ENABLE: Symbol('EnableFinancialPaymentProviderHandler'),

    DISABLE: Symbol('DisableFinancialPaymentProviderHandler'),

    CHANGE_STATUS: Symbol('ChangeFinancialPaymentProviderStatusHandler'),

    ENABLE_CAPABILITY: Symbol(
      'EnableFinancialPaymentProviderCapabilityHandler',
    ),

    DISABLE_CAPABILITY: Symbol(
      'DisableFinancialPaymentProviderCapabilityHandler',
    ),
  } as const,

  // ===========================================================================
  // Query Handlers
  // ===========================================================================

  QUERY_HANDLERS: {
    GET: Symbol('GetFinancialPaymentProviderHandler'),

    GET_ALL: Symbol('GetFinancialPaymentProvidersHandler'),

    GET_BY_CODE: Symbol('GetFinancialPaymentProviderByCodeHandler'),
  } as const,
} as const;
