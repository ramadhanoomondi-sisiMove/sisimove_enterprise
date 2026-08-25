// -----------------------------------------------------------------------------
// Financial Settlement Application Tokens
// -----------------------------------------------------------------------------
//
// Central dependency-injection tokens for the Financial Settlement
// application layer.
//
// Covers:
// - repository
// - command handlers
// - query handlers
//
// Financial Settlement lifecycle:
//
// CREATE
//   ↓
// PROCESS
//   ↓
// ALLOCATE
//   ↓
// COMPLETE
//
// Alternative terminal paths:
//
// PROCESS → FAIL
// PENDING/PROCESSING → CANCEL
//
// Queries:
//
// - Get Settlement
// - Get Settlement Items
//
// -----------------------------------------------------------------------------

export const FINANCIAL_SETTLEMENT_TOKENS = {
  // ===========================================================================
  // Repository
  // ===========================================================================

  REPOSITORY: Symbol('FinancialSettlementRepository'),

  // ===========================================================================
  // Command Handlers
  // ===========================================================================

  COMMAND_HANDLERS: {
    CREATE: Symbol('CreateFinancialSettlementHandler'),

    PROCESS: Symbol('ProcessFinancialSettlementHandler'),

    ALLOCATE_ITEM: Symbol('AllocateFinancialSettlementItemHandler'),

    COMPLETE: Symbol('CompleteFinancialSettlementHandler'),

    FAIL: Symbol('FailFinancialSettlementHandler'),

    CANCEL: Symbol('CancelFinancialSettlementHandler'),
  } as const,

  // ===========================================================================
  // Query Handlers
  // ===========================================================================

  QUERY_HANDLERS: {
    GET: Symbol('GetFinancialSettlementHandler'),

    GET_ITEMS: Symbol('GetFinancialSettlementItemsHandler'),
  } as const,
} as const;
