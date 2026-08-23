// -----------------------------------------------------------------------------
// Financial Transaction Application Tokens
// -----------------------------------------------------------------------------
//
// Central dependency-injection tokens for the Financial Transaction
// application layer.
//
// Covers:
// - repository
// - command handlers
// - query handlers
//
// -----------------------------------------------------------------------------

export const FINANCIAL_TRANSACTION_TOKENS = {
  REPOSITORY: Symbol('FinancialTransactionRepository'),

  COMMAND_HANDLERS: {
    CREATE: Symbol('CreateFinancialTransactionHandler'),
    COMPLETE: Symbol('CompleteFinancialTransactionHandler'),
    FAIL: Symbol('FailFinancialTransactionHandler'),
    REVERSE: Symbol('ReverseFinancialTransactionHandler'),
    CANCEL: Symbol('CancelFinancialTransactionHandler'),
  } as const,

  QUERY_HANDLERS: {
    GET: Symbol('GetFinancialTransactionHandler'),
    GET_ACCOUNT_TRANSACTIONS: Symbol('GetFinancialAccountTransactionsHandler'),
  } as const,
} as const;
