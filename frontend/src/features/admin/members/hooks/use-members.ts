"use client";

import { useQuery } from "@tanstack/react-query";

import { membersQueries } from "../queries/members.queries";
import type { MemberDirectoryQueryDto } from "../types/member-api.types";

export function useMembers(query: MemberDirectoryQueryDto = {}) {
  return useQuery(membersQueries.directory(query));
}

export default useMembers;