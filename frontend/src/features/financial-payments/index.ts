// =============================================================================
// sisiMove — Financial Payments Feature
// =============================================================================
//
// Public entry point for the Financial Payments feature.
//
// Consumers outside this feature should import payment functionality through
// this barrel rather than reaching into internal feature directories.
//
// The feature boundary exposes:
//
//     - API operations;
//     - frontend models;
//     - validation schemas;
//     - response mappers;
//     - React Query hooks.
//
// Backend payment lifecycle commands such as process, succeed, fail, cancel,
// expire, and link-transaction are intentionally not exposed as member-facing
// frontend operations. Those remain backend workflow responsibilities.
//
// =============================================================================

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export {
  createPayment,
  getPayment,
} from './api';

// -----------------------------------------------------------------------------
// Models
// -----------------------------------------------------------------------------

export type {
  FinancialPayment,
  FinancialPaymentAttempt,
  FinancialPaymentStatus,
  FinancialPaymentAttemptStatus,
  CreatePaymentRequest,
} from './models';

// -----------------------------------------------------------------------------
// Schemas
// -----------------------------------------------------------------------------

export {
  createPaymentSchema,
  type CreatePaymentFormValues,
} from './schemas';

// -----------------------------------------------------------------------------
// Mappers
// -----------------------------------------------------------------------------

export {
  mapFinancialPayment,
  type FinancialPaymentApiResponse,
  type FinancialPaymentAttemptApiResponse,
} from './mappers';

// -----------------------------------------------------------------------------
// Hooks
// -----------------------------------------------------------------------------

export {
  useCreatePayment,
  CREATE_FINANCIAL_PAYMENT_MUTATION_KEY,
  useFinancialPayment,
  FINANCIAL_PAYMENT_QUERY_KEY,
} from './hooks';