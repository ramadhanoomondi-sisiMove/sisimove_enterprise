// -----------------------------------------------------------------------------
// Financial Account Hold Application Tokens
// -----------------------------------------------------------------------------
//
// Central dependency-injection tokens for the Financial Account Hold
// application layer.
//
// Covers:
// - repository
// - command handlers
// - query handlers
//
// -----------------------------------------------------------------------------

export const FINANCIAL_ACCOUNT_HOLD_TOKENS = {
  // ===========================================================================
  // Repository
  // ===========================================================================

  REPOSITORY: Symbol('FinancialAccountHoldRepository'),

  // ===========================================================================
  // Command Handlers
  // ===========================================================================

  COMMAND_HANDLERS: {
    CREATE: Symbol('CreateFinancialAccountHoldHandler'),

    CAPTURE: Symbol('CaptureFinancialAccountHoldHandler'),

    RELEASE: Symbol('ReleaseFinancialAccountHoldHandler'),

    CANCEL: Symbol('CancelFinancialAccountHoldHandler'),
  } as const,

  // ===========================================================================
  // Query Handlers
  // ===========================================================================

  QUERY_HANDLERS: {
    GET: Symbol('GetFinancialAccountHoldsHandler'),
  } as const,
} as const;
