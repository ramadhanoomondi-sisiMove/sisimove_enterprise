
"use client";

import { useQuery } from "@tanstack/react-query";

import { memberVerificationApi } from "../api/member-verification.api";

export function useMemberVerification(verificationPublicId: string) {
  return useQuery({
    queryKey: [
      "admin",
      "members",
      "verification",
      "by-public-id",
      verificationPublicId,
    ] as const,
    queryFn: () =>
      memberVerificationApi.getByPublicId(verificationPublicId),
    enabled: verificationPublicId.trim().length > 0,
  });
}

export function useMemberVerificationByIdentity(identityPublicId: string) {
  return useQuery({
    queryKey: [
      "admin",
      "members",
      "verification",
      "by-identity",
      identityPublicId,
    ] as const,
    queryFn: () =>
      memberVerificationApi.getByIdentityPublicId(identityPublicId),
    enabled: identityPublicId.trim().length > 0,
  });
}

export function useMemberPendingVerificationCount() {
  return useQuery({
    queryKey: [
      "admin",
      "members",
      "verification",
      "pending-count",
    ] as const,
    queryFn: () => memberVerificationApi.getPendingCount(),
  });
}

export default useMemberVerification;
