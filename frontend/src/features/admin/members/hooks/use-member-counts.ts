
"use client";

import { useQuery } from "@tanstack/react-query";

import { membersQueries } from "../queries/members.queries";

export function useMemberCounts() {
  return useQuery(membersQueries.count());
}

export default useMemberCounts;
