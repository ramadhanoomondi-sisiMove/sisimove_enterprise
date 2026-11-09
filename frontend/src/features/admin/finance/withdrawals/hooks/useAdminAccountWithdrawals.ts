
/**
 * -----------------------------------------------------------------------------
 * SisiMove Admin — Financial Account Withdrawals Hook
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Fetch withdrawals belonging to one financial account.
 * - Optionally filter by withdrawal status using the backend endpoint.
 * - Prevent requests when the account public ID is missing.
 *
 * Architecture:
 * - API access remains in the API layer.
 * - TanStack Query manages server data and caching.
 * - Query keys are shared with the withdrawal collection.
 * -----------------------------------------------------------------------------
 */

import { useQuery } from '@tanstack/react-query';

import { AdminWithdrawalsApi } from '../api';

import type { AdminWithdrawalStatus } from '../models/admin-withdrawal.enums';

import { adminWithdrawalKeys } from './useAdminWithdrawals';

// -----------------------------------------------------------------------------
// Query Hook
// -----------------------------------------------------------------------------

export function useAdminAccountWithdrawals(
  accountPublicId: string | undefined,
  status?: AdminWithdrawalStatus,
) {
  const publicId = accountPublicId?.trim() ?? '';

  const query = useQuery({
    queryKey: publicId
      ? status
        ? adminWithdrawalKeys.accountStatus(publicId, status)
        : adminWithdrawalKeys.account(publicId)
      : [
          ...adminWithdrawalKeys.accounts(),
          'missing-account-public-id',
          status ?? 'all',
        ],

    queryFn: () =>
      status
        ? AdminWithdrawalsApi.getByAccountAndStatus(
            publicId,
            status,
          )
        : AdminWithdrawalsApi.getByAccount(publicId),

    enabled: publicId.length > 0,
  });

  return {
    withdrawals: query.data ?? [],

    query,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export default useAdminAccountWithdrawals;
