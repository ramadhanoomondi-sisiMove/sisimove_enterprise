
/**
 * -----------------------------------------------------------------------------
 * SisiMove Admin — Financial Account Withdrawal Detail Hook
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Fetch one withdrawal by public ID.
 * - Prevent requests when the public ID is missing.
 * - Expose loading, error and refetch states.
 *
 * Architecture:
 * - API access remains in the API layer.
 * - TanStack Query manages server data and caching.
 * - Query keys are shared with useAdminWithdrawals.
 * -----------------------------------------------------------------------------
 */

import { useQuery } from '@tanstack/react-query';

import { AdminWithdrawalsApi } from '../api';

import { adminWithdrawalKeys } from './useAdminWithdrawals';

// -----------------------------------------------------------------------------
// Query Hook
// -----------------------------------------------------------------------------

export function useAdminWithdrawal(
  withdrawalPublicId: string | undefined,
) {
  const publicId = withdrawalPublicId?.trim() ?? '';

  const query = useQuery({
    queryKey: publicId
      ? adminWithdrawalKeys.detail(publicId)
      : [
          ...adminWithdrawalKeys.details(),
          'missing-public-id',
        ],

    queryFn: async () => {
      const withdrawal =
        await AdminWithdrawalsApi.getById(publicId);

      if (!withdrawal) {
        throw new Error(
          `Financial account withdrawal "${publicId}" was not found.`,
        );
      }

      return withdrawal;
    },

    enabled: publicId.length > 0,
  });

  return {
    withdrawal: query.data,

    query,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export default useAdminWithdrawal;
