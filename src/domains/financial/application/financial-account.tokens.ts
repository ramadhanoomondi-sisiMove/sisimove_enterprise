// -----------------------------------------------------------------------------
// Financial Account Application Tokens
// -----------------------------------------------------------------------------
//
// Central dependency-injection tokens for the Financial Account application
// layer.
//
// Covers:
// - repository
// - command handlers
// - query handlers
//
// -----------------------------------------------------------------------------

export const FINANCIAL_ACCOUNT_TOKENS = {
  // ===========================================================================
  // Repository
  // ===========================================================================

  REPOSITORY: Symbol('FinancialAccountRepository'),

  // ===========================================================================
  // Command Handlers
  // ===========================================================================

  COMMAND_HANDLERS: {
    CREATE: Symbol('CreateFinancialAccountHandler'),

    ACTIVATE: Symbol('ActivateFinancialAccountHandler'),

    SUSPEND: Symbol('SuspendFinancialAccountHandler'),

    CLOSE: Symbol('CloseFinancialAccountHandler'),
  } as const,

  // ===========================================================================
  // Query Handlers
  // ===========================================================================

  QUERY_HANDLERS: {
    GET: Symbol('GetFinancialAccountHandler'),

    GET_BALANCE: Symbol('GetFinancialAccountBalanceHandler'),
  } as const,
} as const;
