
/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Earning Commission Detail Hook
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Fetch one earning commission by public ID.
 * - Prevent requests when the public ID is missing.
 * - Expose commission loading, error and refetch states.
 *
 * Architecture:
 * - API access remains in the API layer.
 * - TanStack Query manages server data and caching.
 * - Query keys are shared with useAdminEarningCommissions.
 * -----------------------------------------------------------------------------
 */

import { useQuery } from '@tanstack/react-query';

import { adminCommissionsApi } from '../api';

import { adminEarningCommissionKeys } from './useAdminEarningCommissions';

// -----------------------------------------------------------------------------
// Query Hook
// -----------------------------------------------------------------------------

export function useAdminEarningCommission(
  commissionPublicId: string | undefined,
) {
  const publicId = commissionPublicId?.trim() ?? '';

  const query = useQuery({
    queryKey: publicId
      ? adminEarningCommissionKeys.detail(publicId)
      : [
          ...adminEarningCommissionKeys.details(),
          'missing-public-id',
        ],

    queryFn: async () => {
      const commission =
        await adminCommissionsApi.getEarningCommission(publicId);

      if (!commission) {
        throw new Error(
          `Earning commission "${publicId}" was not found.`,
        );
      }

      return commission;
    },

    enabled: publicId.length > 0,
  });

  return {
    commission: query.data,

    query,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
