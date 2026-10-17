
"use client";

import { useQuery } from "@tanstack/react-query";

import { verificationsApi } from "../api/verifications.api";
import type { VerificationApiResponse } from "../types/verification-api.types";

export const verificationsKeys = {
  all: ["verifications"] as const,
  reviewQueue: () => [...verificationsKeys.all, "review-queue"] as const,
};

export function useVerifications() {
  return useQuery<VerificationApiResponse[], Error>({
    queryKey: verificationsKeys.reviewQueue(),
    queryFn: () => verificationsApi.getReviewQueue(),
  });
}

export default useVerifications;
