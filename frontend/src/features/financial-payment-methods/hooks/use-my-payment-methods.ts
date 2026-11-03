// =============================================================================
// sisiMove — Use My Financial Payment Methods
// =============================================================================
//
// React Query hook for retrieving all FinancialPaymentMethods belonging
// to the currently authenticated member.
//
// Backend operation:
//
//     GET /financial-payment-methods/me
//
// Responsibilities:
// - retrieve the member's saved payment methods;
// - manage React Query caching;
// - expose loading, error, and data states;
// - delegate HTTP communication to getMyPaymentMethods().
//
// The hook does NOT:
// - accept an account identifier;
// - perform HTTP requests directly;
// - determine payment-method ownership;
// - implement payment-method business rules;
// - access persistence.
//
// =============================================================================

import { useQuery } from '@tanstack/react-query';

import { getMyPaymentMethods } from '../api';

import type { FinancialPaymentMethod } from '../models';

// -----------------------------------------------------------------------------
// Query Key
// -----------------------------------------------------------------------------

const FINANCIAL_PAYMENT_METHODS_QUERY_KEY =
  'financial-payment-methods';

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Retrieves all payment methods belonging to the authenticated member.
 *
 * @returns
 * React Query result containing the member's payment methods.
 */
export function useMyPaymentMethods() {
  return useQuery<FinancialPaymentMethod[]>({
    queryKey: [
      FINANCIAL_PAYMENT_METHODS_QUERY_KEY,
      'me',
    ],

    queryFn: getMyPaymentMethods,
  });
}