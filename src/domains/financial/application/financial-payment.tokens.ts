// -----------------------------------------------------------------------------
// Financial Payment Application Tokens
// -----------------------------------------------------------------------------
//
// Central dependency-injection tokens for the Financial Payment application
// layer.
//
// Covers:
// - repository
// - command handlers
// - query handlers
//
// -----------------------------------------------------------------------------

export const FINANCIAL_PAYMENT_TOKENS = {
  // ===========================================================================
  // Repository
  // ===========================================================================

  REPOSITORY: Symbol('FinancialPaymentRepository'),

  // ===========================================================================
  // Command Handlers
  // ===========================================================================

  COMMAND_HANDLERS: {
    CREATE: Symbol('CreateFinancialPaymentHandler'),

    PROCESS: Symbol('ProcessFinancialPaymentHandler'),

    SUCCEED: Symbol('SucceedFinancialPaymentHandler'),

    FAIL: Symbol('FailFinancialPaymentHandler'),

    CANCEL: Symbol('CancelFinancialPaymentHandler'),

    EXPIRE: Symbol('ExpireFinancialPaymentHandler'),

    LINK_TRANSACTION: Symbol('LinkFinancialPaymentTransactionHandler'),
  } as const,

  // ===========================================================================
  // Query Handlers
  // ===========================================================================

  QUERY_HANDLERS: {
    GET: Symbol('GetFinancialPaymentHandler'),

    GET_ACCOUNT_PAYMENTS: Symbol('GetFinancialAccountPaymentsHandler'),

    GET_BY_REFERENCE: Symbol('GetFinancialPaymentByReferenceHandler'),

    GET_BY_TRANSACTION: Symbol('GetFinancialPaymentByTransactionHandler'),
  } as const,
} as const;
