// =============================================================================
// sisiMove — Use Financial Payment Method
// =============================================================================
//
// React Query hook for retrieving a FinancialPaymentMethod by its public
// identifier.
//
// Responsibilities:
// - coordinate the payment-method read operation;
// - manage query caching and request lifecycle;
// - expose the API result to React components.
//
// This hook does NOT:
// - perform HTTP requests directly;
// - implement payment-method business rules;
// - determine ownership;
// - modify payment-method state;
// - access persistence.
//
// HTTP communication belongs to:
//
//     api/get-payment-method.api.ts
//
// Backend authorization and ownership remain server-side.
//
// =============================================================================

import { useQuery } from '@tanstack/react-query';

import { getPaymentMethod } from '../api';

import type { FinancialPaymentMethod } from '../models';

// -----------------------------------------------------------------------------
// Query Key
// -----------------------------------------------------------------------------

const FINANCIAL_PAYMENT_METHODS_QUERY_KEY = 'financial-payment-methods';

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Retrieves a FinancialPaymentMethod by its public identifier.
 *
 * The query remains disabled until a non-empty public identifier is supplied.
 *
 * @param paymentMethodPublicId
 * API-safe public identifier of the payment method.
 *
 * @returns
 * React Query result containing the payment method or `null`.
 */
export function usePaymentMethod(
  paymentMethodPublicId: string | undefined,
) {
  return useQuery<FinancialPaymentMethod | null>({
    queryKey: [
      FINANCIAL_PAYMENT_METHODS_QUERY_KEY,
      paymentMethodPublicId,
    ],

    /**
     * Prevents an HTTP request when no payment-method identifier is available.
     */
    enabled:
      typeof paymentMethodPublicId === 'string' &&
      paymentMethodPublicId.trim().length > 0,

    /**
     * React Query invokes the feature API operation only after the query has
     * been enabled.
     */
    queryFn: () => {
      if (
        typeof paymentMethodPublicId !== 'string' ||
        paymentMethodPublicId.trim().length === 0
      ) {
        throw new Error('Payment method public ID is required.');
      }

      return getPaymentMethod(paymentMethodPublicId);
    },
  });
}
