"use client";

import { useQuery } from "@tanstack/react-query";

import { memberRecoveryApi } from "../api/member-recovery.api";

/**
 * sisiMove — Admin Member Recovery Hook
 *
 * Loads recovery records returned by the existing recovery endpoint.
 * The current GET /recoveries contract is not identity-scoped, so this hook
 * must not be treated as returning records for a selected member.
 */
export function useMemberRecovery() {
  return useQuery({
    queryKey: ["admin", "members", "recovery"],
    queryFn: () => memberRecoveryApi.list(),
  });
}

export default useMemberRecovery;
