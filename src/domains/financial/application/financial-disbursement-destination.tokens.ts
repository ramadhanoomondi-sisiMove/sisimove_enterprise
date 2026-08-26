// -----------------------------------------------------------------------------
// Financial Disbursement Destination — Application Tokens
// -----------------------------------------------------------------------------
//
// Central dependency-injection tokens for the Financial Disbursement
// Destination application layer.
//
// Covers:
// - repository
// - command handlers
// - query handlers
//
// The token surface mirrors the Financial Disbursement Destination
// application contract.
//
// Commands:
// - create
//
// Queries:
// - get one destination
//
// -----------------------------------------------------------------------------
// Financial Disbursement Destination
// -----------------------------------------------------------------------------

export const FINANCIAL_DISBURSEMENT_DESTINATION_TOKENS = {
  // ===========================================================================
  // Repository
  // ===========================================================================

  REPOSITORY: Symbol('FinancialDisbursementDestinationRepository'),

  // ===========================================================================
  // Command Handlers
  // ===========================================================================

  COMMAND_HANDLERS: {
    CREATE: Symbol('CreateFinancialDisbursementDestinationHandler'),
  } as const,

  // ===========================================================================
  // Query Handlers
  // ===========================================================================

  QUERY_HANDLERS: {
    GET: Symbol('GetFinancialDisbursementDestinationHandler'),
  } as const,
} as const;
