
/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Commission Rule Detail Hook
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Fetch one commission rule by public ID.
 * - Prevent requests when the public ID is missing.
 * - Expose rule loading, error and refetch states.
 *
 * Architecture:
 * - API access remains in the API layer.
 * - TanStack Query manages server data and caching.
 * - Query keys are shared with useAdminCommissionRules.
 * -----------------------------------------------------------------------------
 */

import { useQuery } from '@tanstack/react-query';

import { adminCommissionsApi } from '../api';

import { adminCommissionRuleKeys } from './useAdminCommissionRules';

// -----------------------------------------------------------------------------
// Query Hook
// -----------------------------------------------------------------------------

export function useAdminCommissionRule(
  rulePublicId: string | undefined,
) {
  const publicId = rulePublicId?.trim() ?? '';

  const query = useQuery({
    queryKey: publicId
      ? adminCommissionRuleKeys.detail(publicId)
      : [
          ...adminCommissionRuleKeys.details(),
          'missing-public-id',
        ],

    queryFn: async () => {
      const rule =
        await adminCommissionsApi.getCommissionRule(publicId);

      if (!rule) {
        throw new Error(
          `Commission rule "${publicId}" was not found.`,
        );
      }

      return rule;
    },

    enabled: publicId.length > 0,
  });

  return {
    rule: query.data,

    query,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
