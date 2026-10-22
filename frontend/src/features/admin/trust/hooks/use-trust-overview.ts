/**
 * sisiMove — Trust Overview Hook
 *
 * Exposes supported Trust data for overview UI.
 * Aggregate profile metrics require a confirmed overview endpoint.
 */

import { useActiveTrustBadges } from '../queries';

export function useTrustOverview() {
  const badgesQuery = useActiveTrustBadges();

  return {
    activeBadges: badgesQuery.data ?? [],
    activeBadgesCount: badgesQuery.data?.length ?? 0,
    isLoading: badgesQuery.isLoading,
    isError: badgesQuery.isError,
    error: badgesQuery.error,
    refetch: badgesQuery.refetch,
  };
}
