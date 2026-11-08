
// =============================================================================
// sisiMove — Use My Financial Account Balance
// =============================================================================
//
// React Query hook for retrieving a Financial Account balance.
//
// Backend boundary:
//
//     GET /financial-accounts/:accountPublicId/balance
//
// Responsibilities:
// - retrieve the Financial Account balance using its public ID;
// - expose the mapped frontend balance model through React Query;
// - provide an account-specific query key for caching and refetching;
// - wait until the account public ID is available before fetching.
//
// Non-responsibilities:
// - authentication;
// - ownership resolution;
// - API response mapping;
// - amount conversion;
// - financial calculations;
// - balance mutation;
// - lifecycle operations.
//
// The caller resolves the authenticated member's Financial Account and
// supplies its public ID.
//
// The API module owns the transport + mapping boundary. Therefore this hook
// consumes `FinancialAccountBalance` directly.
//
// Monetary convention:
// - amounts are integer minor units;
// - KES 100 represents KES 1.00;
// - no division or multiplication by 100 occurs in this hook.
//
// =============================================================================

import { useQuery } from '@tanstack/react-query';

import { getMyFinancialBalance } from '../api';

// =============================================================================
// Query Key
// =============================================================================

/**
 * Stable query key for a Financial Account balance.
 *
 * Including the account public ID ensures that balances belonging to
 * different accounts are cached independently.
 */
export const MY_FINANCIAL_BALANCE_QUERY_KEY = (
  accountPublicId: string | undefined,
) => ['financial-account', accountPublicId, 'balance'] as const;

// =============================================================================
// Query
// =============================================================================

/**
 * Retrieve a Financial Account balance.
 *
 * `getMyFinancialBalance()` is responsible for:
 * - requesting the balance using the supplied account public ID;
 * - mapping the backend response into FinancialAccountBalance.
 *
 * The query remains disabled until a valid account public ID is supplied.
 */
export function useMyFinancialBalance(
  accountPublicId: string | undefined,
) {
  return useQuery({
    queryKey: MY_FINANCIAL_BALANCE_QUERY_KEY(accountPublicId),

    queryFn: () => {
      if (!accountPublicId) {
        throw new Error(
          'A Financial Account public ID is required to retrieve its balance.',
        );
      }

      return getMyFinancialBalance(accountPublicId);
    },

    enabled: Boolean(accountPublicId),
  });
}
