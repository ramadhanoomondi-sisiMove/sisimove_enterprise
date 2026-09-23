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
    /**
     * Retrieves a Financial Account by its public identity.
     */
    GET: Symbol('GetFinancialAccountHandler'),

    /**
     * Retrieves the Financial Account belonging to the
     * currently authenticated owner.
     */
    GET_ME: Symbol('GetMyFinancialAccountHandler'),

    /**
     * Retrieves the balance belonging to a Financial Account.
     */
    GET_BALANCE: Symbol('GetFinancialAccountBalanceHandler'),
  } as const,
} as const;
