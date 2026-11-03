// =============================================================================
// sisiMove — Use Default Financial Payment Method
// =============================================================================
//
// React Query hook for retrieving the default FinancialPaymentMethod belonging
// to the currently authenticated member.
//
// Backend operation:
//
//     GET /financial-payment-methods/me
//
// Responsibilities:
// - coordinate the default-payment-method read operation;
// - manage React Query caching and request lifecycle;
// - expose the API result to React components.
//
// This hook does NOT:
// - perform HTTP requests directly;
// - determine which payment method is default;
// - modify payment-method state;
// - access persistence;
// - implement ownership or authorization rules.
//
// HTTP communication belongs to:
//
//     api/get-default-payment-method.api.ts
//
// The backend resolves the authenticated member's Financial Account.
//
// =============================================================================

import { useQuery } from '@tanstack/react-query';

import { getDefaultPaymentMethod } from '../api';

import type { FinancialPaymentMethod } from '../models';

// -----------------------------------------------------------------------------
// Query Key
// -----------------------------------------------------------------------------

const FINANCIAL_PAYMENT_METHODS_QUERY_KEY = 'financial-payment-methods';

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Retrieves the default payment method belonging to the authenticated member.
 *
 * A member may have no default payment method, in which case the query
 * resolves successfully with null.
 *
 * @returns
 * React Query result containing the default payment method or null.
 */
export function useDefaultPaymentMethod() {
  return useQuery<FinancialPaymentMethod | null>({
    queryKey: [
      FINANCIAL_PAYMENT_METHODS_QUERY_KEY,
      'me',
      'default',
    ],

    queryFn: getDefaultPaymentMethod,
  });
}