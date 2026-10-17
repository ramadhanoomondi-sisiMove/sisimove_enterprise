
"use client";

import { useQuery } from "@tanstack/react-query";

import { verificationsQueries } from "../queries/verifications.queries";

export const useVerificationRequest = (
  verificationPublicId: string,
  verificationRequestPublicId: string,
) =>
  useQuery(
    verificationsQueries.requestByPublicId(
      verificationPublicId.trim(),
      verificationRequestPublicId.trim(),
    ),
  );

export default useVerificationRequest;
