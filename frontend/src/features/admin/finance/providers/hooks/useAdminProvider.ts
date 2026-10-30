
/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Financial Payment Provider Detail Hook
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Fetch one financial payment provider by public ID.
 * - Prevent requests when the public ID is missing.
 * - Expose provider loading, error and refetch states.
 *
 * Architecture:
 * - API access remains in the API layer.
 * - TanStack Query manages server data and caching.
 * - Query keys are shared with useAdminProviders.
 * -----------------------------------------------------------------------------
 */

import { useQuery } from '@tanstack/react-query';

import { adminProvidersApi } from '../api';

import { adminProviderKeys } from './useAdminProviders';

// -----------------------------------------------------------------------------
// Query Hook
// -----------------------------------------------------------------------------

export function useAdminProvider(
  providerPublicId: string | undefined,
) {
  const publicId = providerPublicId?.trim() ?? '';

  const query = useQuery({
    queryKey: publicId
      ? adminProviderKeys.detail(publicId)
      : [
          ...adminProviderKeys.details(),
          'missing-public-id',
        ],

    queryFn: async () => {
      const provider =
        await adminProvidersApi.getByPublicId(publicId);

      if (!provider) {
        throw new Error(
          `Financial payment provider "${publicId}" was not found.`,
        );
      }

      return provider;
    },

    enabled: publicId.length > 0,
  });

  return {
    provider: query.data,

    query,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
