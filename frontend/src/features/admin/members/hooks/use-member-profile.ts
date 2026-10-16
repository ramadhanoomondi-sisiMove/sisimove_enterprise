
"use client";

import { useQuery } from "@tanstack/react-query";

import { memberProfileApi } from "../api/member-profile.api";
import { membersKeys } from "../queries/members.keys";

export function useMemberProfile(memberPublicId: string) {
  return useQuery({
    queryKey: membersKeys.profile(memberPublicId),
    queryFn: () => memberProfileApi.getByMemberPublicId(memberPublicId),
    enabled: memberPublicId.trim().length > 0,
  });
}

export default useMemberProfile;
