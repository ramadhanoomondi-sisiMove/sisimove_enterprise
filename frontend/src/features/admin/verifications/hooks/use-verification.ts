
"use client";

import { useQuery } from "@tanstack/react-query";

import { verificationsQueries } from "../queries/verifications.queries";

export const useVerification = (verificationPublicId: string) =>
  useQuery(
    verificationsQueries.byPublicId(verificationPublicId.trim()),
  );

export default useVerification;
