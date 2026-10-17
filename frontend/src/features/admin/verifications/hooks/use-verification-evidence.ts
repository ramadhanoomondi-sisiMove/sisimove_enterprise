
"use client";

import { useQuery } from "@tanstack/react-query";

import { verificationsQueries } from "../queries/verifications.queries";

export const useVerificationEvidence = (
  verificationPublicId: string | undefined,
  verificationRequestPublicId: string | undefined,
) => {
  const verificationId = verificationPublicId?.trim() ?? "";
  const requestId = verificationRequestPublicId?.trim() ?? "";

  return useQuery(
    verificationsQueries.evidence(verificationId, requestId),
  );
};

export default useVerificationEvidence;
