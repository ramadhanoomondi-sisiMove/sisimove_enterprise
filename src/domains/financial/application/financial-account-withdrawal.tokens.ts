// -----------------------------------------------------------------------------
// Financial Account Withdrawal Application Tokens
// -----------------------------------------------------------------------------
//
// Central dependency-injection tokens for the Financial Account Withdrawal
// application layer.
//
// Covers:
// - repository
// - command handlers
// - query handlers
//
// The token surface mirrors the Financial Account Withdrawal application
// contract:
//
// Commands:
// - request
// - process
// - complete
// - fail
// - cancel
//
// Queries:
// - get one withdrawal
// - get account withdrawals
// - get account withdrawals by status
//
// -----------------------------------------------------------------------------

export const FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS = {
  // ===========================================================================
  // Repository
  // ===========================================================================

  REPOSITORY: Symbol('FinancialAccountWithdrawalRepository'),

  // ===========================================================================
  // Command Handlers
  // ===========================================================================

  COMMAND_HANDLERS: {
    REQUEST: Symbol('RequestFinancialAccountWithdrawalHandler'),

    PROCESS: Symbol('ProcessFinancialAccountWithdrawalHandler'),

    COMPLETE: Symbol('CompleteFinancialAccountWithdrawalHandler'),

    FAIL: Symbol('FailFinancialAccountWithdrawalHandler'),

    CANCEL: Symbol('CancelFinancialAccountWithdrawalHandler'),
  } as const,

  // ===========================================================================
  // Query Handlers
  // ===========================================================================

  QUERY_HANDLERS: {
    GET: Symbol('GetFinancialAccountWithdrawalHandler'),

    GET_ALL: Symbol('GetFinancialAccountWithdrawalsHandler'),

    GET_BY_STATUS: Symbol('GetFinancialAccountWithdrawalsByStatusHandler'),
  } as const,
} as const;
