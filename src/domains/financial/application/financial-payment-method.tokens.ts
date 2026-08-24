// -----------------------------------------------------------------------------
// Financial Payment Method Application Tokens
// -----------------------------------------------------------------------------
//
// Central dependency-injection tokens for the Financial Payment Method
// application layer.
//
// Covers:
// - repository
// - command handlers
// - query handlers
//
// -----------------------------------------------------------------------------

export const FINANCIAL_PAYMENT_METHOD_TOKENS = {
  // ===========================================================================
  // Repository
  // ===========================================================================

  REPOSITORY: Symbol('FinancialPaymentMethodRepository'),

  // ===========================================================================
  // Command Handlers
  // ===========================================================================

  COMMAND_HANDLERS: {
    ADD: Symbol('AddFinancialPaymentMethodHandler'),

    SET_DEFAULT: Symbol('SetDefaultFinancialPaymentMethodHandler'),

    DEACTIVATE: Symbol('DeactivateFinancialPaymentMethodHandler'),
  } as const,

  // ===========================================================================
  // Query Handlers
  // ===========================================================================

  QUERY_HANDLERS: {
    GET: Symbol('GetFinancialPaymentMethodHandler'),

    GET_DEFAULT: Symbol('GetDefaultFinancialPaymentMethodHandler'),
  } as const,
} as const;
