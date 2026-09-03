// -----------------------------------------------------------------------------
// Financial Disbursement Application Tokens
// -----------------------------------------------------------------------------
//
// Central dependency-injection tokens for the Financial Disbursement
// application layer.
//
// Covers:
// - repository
// - command handlers
// - query handlers
//
// -----------------------------------------------------------------------------

export const FINANCIAL_DISBURSEMENT_TOKENS = {
  // ===========================================================================
  // Repository
  // ===========================================================================

  REPOSITORY: Symbol('FinancialDisbursementRepository'),

  // ===========================================================================
  // Command Handlers
  // ===========================================================================

  COMMAND_HANDLERS: {
    CREATE: Symbol('CreateFinancialDisbursementHandler'),

    PROCESS: Symbol('ProcessFinancialDisbursementHandler'),

    COMPLETE: Symbol('CompleteFinancialDisbursementHandler'),

    FAIL: Symbol('FailFinancialDisbursementHandler'),

    CANCEL: Symbol('CancelFinancialDisbursementHandler'),
  } as const,

  // ===========================================================================
  // Query Handlers
  // ===========================================================================

  QUERY_HANDLERS: {
    GET: Symbol('GetFinancialDisbursementHandler'),

    GET_ATTEMPTS: Symbol('GetFinancialDisbursementAttemptsHandler'),
  } as const,
} as const;
