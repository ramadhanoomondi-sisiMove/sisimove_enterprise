
"use client";

import { useQuery } from "@tanstack/react-query";

import { memberTrustApi } from "../api/member-trust.api";
import { membersKeys } from "../queries/members.keys";

export function useMemberTrust(memberPublicId: string) {
  return useQuery({
    queryKey: membersKeys.trust(memberPublicId),
    queryFn: () => memberTrustApi.getByMemberPublicId(memberPublicId),
    enabled: memberPublicId.trim().length > 0,
  });
}

export default useMemberTrust;
