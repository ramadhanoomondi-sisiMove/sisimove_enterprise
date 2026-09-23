// =============================================================================
// sisiMove — Financial Account Feature
// =============================================================================
//
// Public barrel for the Financial Account feature.
//
// This is the feature-level boundary for authenticated member financial
// account reads.
//
// Internal consumers should import through this barrel rather than reaching
// into individual implementation folders when the feature is consumed
// outside the financial-account feature.
//
// =============================================================================

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export {
  getMyFinancialAccount,
  getMyFinancialBalance,
} from './api';

// -----------------------------------------------------------------------------
// Models
// -----------------------------------------------------------------------------

export type {
  MyFinancialAccount,
  FinancialAccountBalance,
  FinancialAccountStatus,
  FinancialAccountType,
  FinancialAccountSummary,
} from './models';

// -----------------------------------------------------------------------------
// Mappers
// -----------------------------------------------------------------------------

export {
  mapMyFinancialAccount,
  mapFinancialAccountBalance,
  type MyFinancialAccountApiResponse,
  type FinancialAccountBalanceApiResponse,
} from './mappers';

// -----------------------------------------------------------------------------
// Hooks
// -----------------------------------------------------------------------------

export {
  useMyFinancialAccount,
  MY_FINANCIAL_ACCOUNT_QUERY_KEY,
  useMyFinancialBalance,
  MY_FINANCIAL_BALANCE_QUERY_KEY,
} from './hooks';

