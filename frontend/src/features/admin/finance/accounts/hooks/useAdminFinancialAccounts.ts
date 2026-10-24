
// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Accounts Collection Hook
// -----------------------------------------------------------------------------
// Fetches the financial accounts directory through GET /financial-accounts
// and supports fetching explicitly supplied accounts by public ID.
//
// Uses shared query keys and the existing API adapter.
// Does not access session storage, attach tokens, or use internal database IDs.
// -----------------------------------------------------------------------------

import { useQueries, useQuery } from '@tanstack/react-query';

import { adminFinancialAccountsApi } from '../api';

// -----------------------------------------------------------------------------
// Query Keys
// -----------------------------------------------------------------------------

export const adminFinancialAccountKeys = {
  all: ['admin', 'financial-accounts'] as const,

  lists: () => [...adminFinancialAccountKeys.all, 'list'] as const,

  list: () => [...adminFinancialAccountKeys.lists(), 'all'] as const,

  current: () => [...adminFinancialAccountKeys.all, 'current'] as const,

  details: () => [...adminFinancialAccountKeys.all, 'detail'] as const,

  detail: (publicId: string) =>
    [...adminFinancialAccountKeys.details(), publicId.trim()] as const,

  balances: () => [...adminFinancialAccountKeys.all, 'balance'] as const,

  balance: (publicId: string) =>
    [...adminFinancialAccountKeys.balances(), publicId.trim()] as const,
};

// -----------------------------------------------------------------------------
// Full Collection
// -----------------------------------------------------------------------------

/**
 * Fetch all financial accounts for the admin directory.
 *
 * Backend endpoint:
 * GET /financial-accounts
 *
 * The authenticated caller must have financial-account:read permission.
 */
export function useAdminFinancialAccountsList() {
  const query = useQuery({
    queryKey: adminFinancialAccountKeys.list(),
    queryFn: () => adminFinancialAccountsApi.getAll(),
  });

  return {
    accounts: query.data ?? [],
    query,
    isLoading: query.isPending,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

// -----------------------------------------------------------------------------
// Known Accounts
// -----------------------------------------------------------------------------

/**
 * Fetch a known set of accounts in parallel by public ID.
 * Pass [] when no account IDs are available; no requests will be made.
 */
export function useAdminFinancialAccounts(
  accountPublicIds: readonly string[] = [],
) {
  const normalizedIds = [
    ...new Set(
      accountPublicIds
        .map((id) => id.trim())
        .filter((id) => id.length > 0),
    ),
  ];

  const queries = useQueries({
    queries: normalizedIds.map((publicId) => ({
      queryKey: adminFinancialAccountKeys.detail(publicId),
      queryFn: () =>
        adminFinancialAccountsApi.getByPublicId(publicId),
      enabled: publicId.length > 0,
    })),
  });

  return {
    accounts: queries
      .map((query) => query.data)
      .filter((account) => account !== null && account !== undefined),

    queries,

    isLoading: queries.some((query) => query.isPending),

    isFetching: queries.some((query) => query.isFetching),

    isError: queries.some((query) => query.isError),

    errors: queries
      .map((query) => query.error)
      .filter(Boolean),

    refetchAll: () =>
      Promise.all(
        queries.map((query) => query.refetch()),
      ),
  };
}
