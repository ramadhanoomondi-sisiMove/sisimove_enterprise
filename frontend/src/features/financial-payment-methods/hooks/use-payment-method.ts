// =============================================================================
// sisiMove — Use Financial Payment Method
// =============================================================================
//
// React Query hook for retrieving a FinancialPaymentMethod by its public
// identifier.
//
// Backend operation:
//
//     GET /financial-payment-methods/:paymentMethodPublicId
//
// Backend authorization:
//
//     JwtAuthGuard
//     PermissionsGuard
//     admin:read
//
// This is an administrative lookup.
//
// Member-facing payment-method retrieval uses:
//
//     GET /financial-payment-methods/me
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
// Backend authorization remains server-side.
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
 * Administrative permission is required by the backend.
 *
 * The query remains disabled until a non-empty public identifier is supplied.
 *
 * @param paymentMethodPublicId
 * API-safe public identifier of the payment method.
 *
 * @returns
 * React Query result containing the payment method or null.
 */
export function usePaymentMethod(
  paymentMethodPublicId: string | undefined,
) {
  return useQuery<FinancialPaymentMethod | null>({
    queryKey: [
      FINANCIAL_PAYMENT_METHODS_QUERY_KEY,
      'admin',
      paymentMethodPublicId,
    ],

    enabled:
      typeof paymentMethodPublicId === 'string' &&
      paymentMethodPublicId.trim().length > 0,

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