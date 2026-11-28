
/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Booking Commission Detail Hook
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Fetch one booking commission by public ID.
 * - Prevent requests when the public ID is missing.
 * - Expose commission loading, error and refetch states.
 *
 * Architecture:
 * - API access remains in the API layer.
 * - TanStack Query manages server data and caching.
 * - Query keys are shared with useAdminBookingCommissions.
 * -----------------------------------------------------------------------------
 */

import { useQuery } from '@tanstack/react-query';

import { adminCommissionsApi } from '../api';

import { adminBookingCommissionKeys } from './useAdminBookingCommissions';

// -----------------------------------------------------------------------------
// Query Hook
// -----------------------------------------------------------------------------

export function useAdminBookingCommission(
  commissionPublicId: string | undefined,
) {
  const publicId = commissionPublicId?.trim() ?? '';

  const query = useQuery({
    queryKey: publicId
      ? adminBookingCommissionKeys.detail(publicId)
      : [
          ...adminBookingCommissionKeys.details(),
          'missing-public-id',
        ],

    queryFn: async () => {
      const commission =
        await adminCommissionsApi.getBookingCommission(publicId);

      if (!commission) {
        throw new Error(
          `Booking commission "${publicId}" was not found.`,
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
