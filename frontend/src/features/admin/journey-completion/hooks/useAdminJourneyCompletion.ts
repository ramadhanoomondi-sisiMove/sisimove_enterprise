
/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Journey Completion Detail Hook
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Fetch one journey completion by public ID.
 * - Prevent requests when the public ID is missing.
 * - Expose loading, error and refetch states.
 *
 * Architecture:
 * - API access remains in the API layer.
 * - TanStack Query manages server data and caching.
 * - Query keys are shared with useAdminJourneyCompletions.
 * -----------------------------------------------------------------------------
 */

import { useQuery } from '@tanstack/react-query';

import { adminJourneyCompletionApi } from '../api';

import { adminJourneyCompletionKeys } from './useAdminJourneyCompletions';

// -----------------------------------------------------------------------------
// Query Hook
// -----------------------------------------------------------------------------

export function useAdminJourneyCompletion(
  completionPublicId: string | undefined,
) {
  const publicId = completionPublicId?.trim() ?? '';

  const query = useQuery({
    queryKey: publicId
      ? adminJourneyCompletionKeys.detail(publicId)
      : [
          ...adminJourneyCompletionKeys.details(),
          'missing-public-id',
        ],

    queryFn: async () => {
      const completion =
        await adminJourneyCompletionApi.get(publicId);

      if (!completion) {
        throw new Error(
          `Journey completion "${publicId}" was not found.`,
        );
      }

      return completion;
    },

    enabled: publicId.length > 0,
  });

  return {
    completion: query.data,

    query,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
