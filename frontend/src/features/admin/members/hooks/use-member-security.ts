"use client";

import { useQuery } from "@tanstack/react-query";

import { memberSecurityApi } from "../api/member-security.api";
import { membersKeys } from "../queries/members.keys";

/**
 * sisiMove — Admin Member Security Hook
 *
 * Loads identity lifecycle information for the selected member's security
 * overview. Authentication, sessions, devices, and recovery records remain
 * separate queries and are not inferred by this hook.
 *
 * The query is enabled only when a non-empty identity public ID is provided.
 */
export function useMemberSecurity(identityPublicId: string) {
  const normalizedIdentityPublicId = identityPublicId.trim();

  return useQuery({
    queryKey: membersKeys.security(normalizedIdentityPublicId),
    queryFn: () =>
      memberSecurityApi.getByIdentityPublicId(normalizedIdentityPublicId),
    enabled: normalizedIdentityPublicId.length > 0,
  });
}

export default useMemberSecurity;
