import { useQuery } from "@tanstack/react-query";

import { memberSessionsApi } from "../api/member-sessions.api";
import { membersKeys } from "../queries/members.keys";

/**
 * Loads sessions associated with a selected member identity.
 *
 * The query is disabled until an identity public ID is supplied. Backend
 * permissions and identity-scoping remain the responsibility of the API.
 */
export function useMemberSessions(identityPublicId: string) {
  const normalizedIdentityPublicId = identityPublicId.trim();

  return useQuery({
    queryKey: membersKeys.sessions(normalizedIdentityPublicId),
    queryFn: () =>
      memberSessionsApi.listForIdentity(normalizedIdentityPublicId),
    enabled: normalizedIdentityPublicId.length > 0,
  });
}

export default useMemberSessions;
