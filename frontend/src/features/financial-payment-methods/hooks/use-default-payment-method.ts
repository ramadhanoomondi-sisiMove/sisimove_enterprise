// =============================================================================
// sisiMove — Use Default Financial Payment Method
// =============================================================================
//
// React Query hook for retrieving the default FinancialPaymentMethod belonging
// to a Financial Account.
//
// Backend operation:
//
//     GET /financial-payment-methods/accounts/:accountPublicId/default
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
// Backend ownership and authorization remain server-side.
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
 * Retrieves the default payment method for a financial account.
 *
 * The query remains disabled until a valid financial-account public identifier
 * is supplied.
 *
 * A financial account may have no default payment method, in which case the
 * query resolves successfully with `null`.
 *
 * @param accountPublicId
 * API-safe public identifier of the financial account.
 *
 * @returns
 * React Query result containing the default payment method or `null`.
 */
export function useDefaultPaymentMethod(
  accountPublicId: string | undefined,
) {
  return useQuery<FinancialPaymentMethod | null>({
    queryKey: [
      FINANCIAL_PAYMENT_METHODS_QUERY_KEY,
      'default',
      accountPublicId,
    ],

    /**
     * Prevents an HTTP request when no account identifier is available.
     */
    enabled:
      typeof accountPublicId === 'string' &&
      accountPublicId.trim().length > 0,

    /**
     * React Query invokes the feature API operation only after the query has
     * been enabled.
     */
    queryFn: () => {
      if (
        typeof accountPublicId !== 'string' ||
        accountPublicId.trim().length === 0
      ) {
        throw new Error('Financial account public ID is required.');
      }

      return getDefaultPaymentMethod(accountPublicId);
    },
  });
}

