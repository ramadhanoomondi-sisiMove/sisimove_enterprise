"use client";

import { useQuery } from "@tanstack/react-query";

import { memberAuthenticationApi } from "../api/member-authentication.api";
import { membersKeys } from "../queries/members.keys";

/**
 * sisiMove — Admin Member Authentication Hook
 *
 * Loads the authentication aggregate associated with a selected identity.
 * The API adapter and backend remain responsible for authorization. This hook
 * does not expose credential material or perform authentication mutations.
 */
export function useMemberAuthentication(identityPublicId: string) {
  const normalizedIdentityPublicId = identityPublicId.trim();

  return useQuery({
    queryKey: membersKeys.authentication(normalizedIdentityPublicId),
    queryFn: () =>
      memberAuthenticationApi.getByIdentityPublicId(
        normalizedIdentityPublicId,
      ),
    enabled: normalizedIdentityPublicId.length > 0,
  });
}

export default useMemberAuthentication;
