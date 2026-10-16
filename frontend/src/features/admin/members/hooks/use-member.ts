"use client";

import { useQuery } from "@tanstack/react-query";

import { membersQueries } from "../queries/members.queries";

export function useMember(identityPublicId: string) {
  return useQuery(membersQueries.detail(identityPublicId));
}

export default useMember;