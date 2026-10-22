/**
 * sisiMove — Trust Profiles Hook
 *
 * Looks up a Trust profile using its associated member public ID.
 * A collection query should be added when its backend endpoint is confirmed.
 */

import { useTrustProfileByMember } from '../queries';

export function useTrustProfiles(memberPublicId: string) {
  const profilesQuery = useTrustProfileByMember(memberPublicId);

  return {
    profile: profilesQuery.data ?? null,
    isLoading: profilesQuery.isLoading,
    isError: profilesQuery.isError,
    error: profilesQuery.error,
    refetch: profilesQuery.refetch,
  };
}
