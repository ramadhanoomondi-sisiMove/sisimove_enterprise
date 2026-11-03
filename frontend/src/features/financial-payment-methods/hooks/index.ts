// =============================================================================
// sisiMove — Financial Payment Methods Hooks Barrel
// =============================================================================
//
// Public React hook exports for the financial-payment-methods feature.
//
// Current member-facing payment method:
// - M-PESA (MOBILE_MONEY)
//
// Hooks delegate application behavior to the feature API layer and expose
// React Query state to presentation components.
//
// =============================================================================

// -----------------------------------------------------------------------------
// Payment Method Queries
// -----------------------------------------------------------------------------

export { usePaymentMethod } from './use-payment-method';

export { useDefaultPaymentMethod } from './use-default-payment-method';

// -----------------------------------------------------------------------------
// Payment Method Mutations
// -----------------------------------------------------------------------------

export {
  useCreatePaymentMethod,
  type CreatePaymentMethodMutationVariables,
} from './use-create-payment-method';

export {
  useSetDefaultPaymentMethod,
  type SetDefaultPaymentMethodMutationVariables,
} from './use-set-default-payment-method';

export {
  useDeactivatePaymentMethod,
  type DeactivatePaymentMethodMutationVariables,
} from './use-deactivate-payment-method';

// -----------------------------------------------------------------------------
// Payment Provider Queries
// -----------------------------------------------------------------------------

export { useAvailablePaymentProviders } from './use-available-payment-providers';

export { useMyPaymentMethods } from './use-my-payment-methods';