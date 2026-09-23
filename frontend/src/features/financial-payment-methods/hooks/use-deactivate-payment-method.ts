// =============================================================================
// sisiMove — Use Deactivate Financial Payment Method
// =============================================================================
//
// React Query mutation hook for deactivating a FinancialPaymentMethod.
//
// Backend operation:
//
//     POST /financial-payment-methods/:paymentMethodPublicId/deactivate
//
// Responsibilities:
// - coordinate the deactivate mutation;
// - expose mutation state to React components;
// - delegate HTTP communication to deactivatePaymentMethod().
//
// This hook does NOT:
// - perform HTTP requests directly;
// - delete payment-method records;
// - determine ownership;
// - enforce domain lifecycle rules;
// - access persistence.
//
// Deactivation is a backend domain operation. The frontend only requests the
// operation and consumes the resulting payment-method representation.
//
// =============================================================================

import { useMutation } from '@tanstack/react-query';

import {
  deactivatePaymentMethod,
  type DeactivatePaymentMethodRequest,
} from '../api';

import type { FinancialPaymentMethod } from '../models';

// -----------------------------------------------------------------------------
// Mutation Variables
// -----------------------------------------------------------------------------

/**
 * Variables required to deactivate a payment method.
 *
 * The payment-method public identifier belongs to the URL path and is
 * therefore kept separate from the request body.
 */
export interface DeactivatePaymentMethodMutationVariables {
  /**
   * API-safe public identifier of the payment method.
   */
  paymentMethodPublicId: string;

  /**
   * Command transport values.
   */
  request: DeactivatePaymentMethodRequest;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Deactivates a FinancialPaymentMethod.
 *
 * @returns
 * React Query mutation for the deactivate operation.
 */
export function useDeactivatePaymentMethod() {
  return useMutation<
    FinancialPaymentMethod,
    Error,
    DeactivatePaymentMethodMutationVariables
  >({
    mutationKey: ['financial-payment-methods', 'deactivate'],

    mutationFn: ({ paymentMethodPublicId, request }) =>
      deactivatePaymentMethod(paymentMethodPublicId, request),
  });
}

