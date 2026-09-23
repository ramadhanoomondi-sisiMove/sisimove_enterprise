// =============================================================================
// sisiMove — Financial Payment Methods Feature Barrel
// =============================================================================
//
// Public exports for the Financial Payment Methods frontend feature.
//
// Feature boundary:
//
//     financial-payment-methods
//     ├── api
//     ├── models
//     ├── schemas
//     ├── mappers
//     └── hooks
//
// Consumers should import from this feature barrel rather than reaching into
// individual implementation files.
//
// Example:
//
//     import {
//       FinancialPaymentMethod,
//       usePaymentMethod,
//     } from '@/features/financial/financial-payment-methods';
//
// Backend DTOs, Prisma models, domain aggregates, repositories, and command
// handlers are intentionally not exposed here.
//
// =============================================================================

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export {
  getPaymentMethod,
  getDefaultPaymentMethod,
  createPaymentMethod,
  setDefaultPaymentMethod,
  deactivatePaymentMethod,
  type SetDefaultPaymentMethodRequest,
  type DeactivatePaymentMethodRequest,
} from './api';

// -----------------------------------------------------------------------------
// Models
// -----------------------------------------------------------------------------

export {
  type FinancialPaymentMethod,
  type PaymentMethodType,
} from './models';

// -----------------------------------------------------------------------------
// Schemas
// -----------------------------------------------------------------------------

export {
  createPaymentMethodSchema,
  type CreatePaymentMethodFormValues,
} from './schemas';

// -----------------------------------------------------------------------------
// Mappers
// -----------------------------------------------------------------------------

export {
  mapFinancialPaymentMethod,
  type FinancialPaymentMethodApiResponse,
} from './mappers';

// -----------------------------------------------------------------------------
// Hooks
// -----------------------------------------------------------------------------

export {
  usePaymentMethod,
  useDefaultPaymentMethod,
  useCreatePaymentMethod,
  useSetDefaultPaymentMethod,
  useDeactivatePaymentMethod,
  type CreatePaymentMethodMutationVariables,
  type SetDefaultPaymentMethodMutationVariables,
  type DeactivatePaymentMethodMutationVariables,
} from './hooks';

