
"use client";

import { useQuery } from "@tanstack/react-query";

import { verificationsQueries } from "../queries/verifications.queries";

export const useVerificationPendingCount = () =>
  useQuery(verificationsQueries.pendingCount());

export default useVerificationPendingCount;
