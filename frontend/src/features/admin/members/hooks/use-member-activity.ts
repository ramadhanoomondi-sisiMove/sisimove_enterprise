
"use client";

import { useQuery } from "@tanstack/react-query";

import { memberActivityApi } from "../api/member-activity.api";
import { membersKeys } from "../queries/members.keys";

/**
 * sisiMove — Admin Member Activity Hook
 *
 * Loads trust-domain activity events for a selected member.
 * This is not a complete administrative audit trail.
 */
export function useMemberActivity(memberPublicId: string) {
  const normalizedMemberPublicId = memberPublicId.trim();

  return useQuery({
    queryKey: membersKeys.activity(normalizedMemberPublicId),
    queryFn: () =>
      memberActivityApi.getTrustEventsByMemberPublicId(
        normalizedMemberPublicId,
      ),
    enabled: normalizedMemberPublicId.length > 0,
  });
}

export default useMemberActivity;
