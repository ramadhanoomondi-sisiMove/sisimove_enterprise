
"use client";

import { useQuery } from "@tanstack/react-query";

import { verificationsQueries } from "../queries/verifications.queries";

export const useVerificationRequests = (
  verificationPublicId: string,
) =>
  useQuery(
    verificationsQueries.requestsByVerificationPublicId(
      verificationPublicId.trim(),
    ),
  );

export default useVerificationRequests;
