// =============================================================================
// sisiMove — Use My Financial Account
// =============================================================================
//
// React Query hook for the Financial Account belonging to the currently
// authenticated Identity.
//
// Backend boundary:
//
//     GET /financial-accounts/me
//
// Responsibilities:
// - retrieve the authenticated member's Financial Account;
// - expose the mapped frontend model through React Query.
//
// Non-responsibilities:
// - authentication;
// - ownership resolution;
// - API response mapping;
// - financial calculations;
// - balance mutation;
// - lifecycle operations.
//
// The API module owns the transport + mapping boundary. Therefore this hook
// consumes `MyFinancialAccount` directly and must not cast it back to the
// backend API response shape.
//
// =============================================================================

import { useQuery } from '@tanstack/react-query';

import { getMyFinancialAccount } from '../api';

// =============================================================================
// Query Key
// =============================================================================

/**
 * Stable query key for the authenticated member's Financial Account.
 *
 * "me" is intentional because ownership is resolved by the backend from the
 * authenticated access token.
 */
export const MY_FINANCIAL_ACCOUNT_QUERY_KEY = [
  'financial-account',
  'me',
] as const;

// =============================================================================
// Query
// =============================================================================

/**
 * Retrieve the authenticated member's Financial Account.
 *
 * `getMyFinancialAccount()` is already responsible for mapping the backend
 * FinancialAccountResponse into the frontend MyFinancialAccount model.
 *
 * The hook therefore exposes that model directly.
 */
export function useMyFinancialAccount() {
  return useQuery({
    queryKey: MY_FINANCIAL_ACCOUNT_QUERY_KEY,

    queryFn: () => getMyFinancialAccount(),
  });
}