//src/features/financial-withdrawal/index.ts
 //=============================================================================
// sisiMove — Financial Withdrawals Feature
// =============================================================================
//
// Public entry point for the financial-withdrawals feature.
//
// The feature barrel exposes only the contracts required by consumers:
// - API operations;
// - domain-facing frontend models;
// - validation schemas;
// - response mappers;
// - React Query hooks.
//
// Internal implementation details remain inside their respective folders.
//
// =============================================================================

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export {
  createWithdrawal,
  getWithdrawal,
  getMyWithdrawals,
  getMyWithdrawalsByStatus,
} from './api';

// -----------------------------------------------------------------------------
// Models
// -----------------------------------------------------------------------------

export type {
  FinancialWithdrawal,
  FinancialWithdrawalStatus,
  FinancialWithdrawalView,
  WithdrawalDestinationType,
  CreateWithdrawalRequest,
} from './models';

// -----------------------------------------------------------------------------
// Schemas
// -----------------------------------------------------------------------------

export {
  createWithdrawalSchema,
} from './schemas';

export type {
  CreateWithdrawalSchemaInput,
} from './schemas';

// -----------------------------------------------------------------------------
// Mappers
// -----------------------------------------------------------------------------

export {
  mapFinancialWithdrawal,
} from './mappers';

export type {
  FinancialWithdrawalApiResponse,
} from './mappers';

// -----------------------------------------------------------------------------
// Hooks
// -----------------------------------------------------------------------------

export {
  useCreateWithdrawal,
  useFinancialWithdrawal,
  financialWithdrawalQueryKeys,
  useMyWithdrawals,
  useMyWithdrawalsByStatus,
} from './hooks';

export type {
  CreateWithdrawalMutationVariables,
} from './hooks';

