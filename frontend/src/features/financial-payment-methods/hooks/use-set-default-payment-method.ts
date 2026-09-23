// =============================================================================
// sisiMove — Use Set Default Financial Payment Method
// =============================================================================
//
// React Query mutation hook for making a FinancialPaymentMethod the default
// payment method.
//
// Backend operation:
//
//     POST /financial-payment-methods/:paymentMethodPublicId/default
//
// Responsibilities:
// - coordinate the set-default mutation;
// - expose mutation state to React components;
// - delegate HTTP communication to setDefaultPaymentMethod().
//
// This hook does NOT:
// - perform HTTP requests directly;
// - determine ownership;
// - enforce default-payment-method rules;
// - modify cached data manually;
// - access persistence.
//
// Domain rules and authorization remain server-side.
//
// =============================================================================

import { useMutation } from '@tanstack/react-query';

import {
  setDefaultPaymentMethod,
  type SetDefaultPaymentMethodRequest,
} from '../api';

import type { FinancialPaymentMethod } from '../models';

// -----------------------------------------------------------------------------
// Mutation Variables
// -----------------------------------------------------------------------------

/**
 * Variables required to set a payment method as the default.
 *
 * The payment-method public identifier belongs to the URL path and is
 * therefore kept separate from the request body.
 */
export interface SetDefaultPaymentMethodMutationVariables {
  /**
   * API-safe public identifier of the payment method.
   */
  paymentMethodPublicId: string;

  /**
   * Command transport values.
   */
  request: SetDefaultPaymentMethodRequest;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Sets a FinancialPaymentMethod as the default payment method.
 *
 * @returns
 * React Query mutation for the set-default operation.
 */
export function useSetDefaultPaymentMethod() {
  return useMutation<
    FinancialPaymentMethod,
    Error,
    SetDefaultPaymentMethodMutationVariables
  >({
    mutationKey: ['financial-payment-methods', 'set-default'],

    mutationFn: ({ paymentMethodPublicId, request }) =>
      setDefaultPaymentMethod(paymentMethodPublicId, request),
  });
}
