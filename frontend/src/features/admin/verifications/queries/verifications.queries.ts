
/**
 * sisiMove — Admin Verification Queries
 *
 * Centralized TanStack Query definitions for verification records,
 * associated requests, and private verification evidence.
 *
 * Only uses endpoints confirmed in the backend controller.
 */

import { queryOptions } from "@tanstack/react-query";

import { verificationRequestsApi } from "../api/verification-requests.api";
import { verificationsApi } from "../api/verifications.api";
import { verificationsKeys } from "./verifications.keys";

export const verificationsQueries = {
  pendingCount: () =>
    queryOptions({
      queryKey: verificationsKeys.counts(),
      queryFn: () => verificationsApi.getPendingCount(),
    }),

  byPublicId: (verificationPublicId: string) =>
    queryOptions({
      queryKey: verificationsKeys.detail(verificationPublicId),
      queryFn: () => verificationsApi.getByPublicId(verificationPublicId),
      enabled: verificationPublicId.trim().length > 0,
    }),

  byIdentityPublicId: (identityPublicId: string) =>
    queryOptions({
      queryKey:
        verificationsKeys.byIdentityPublicId(identityPublicId),
      queryFn: () =>
        verificationsApi.getByIdentityPublicId(identityPublicId),
      enabled: identityPublicId.trim().length > 0,
    }),

  requestsByVerificationPublicId: (verificationPublicId: string) =>
    queryOptions({
      queryKey: verificationsKeys.requests(verificationPublicId),
      queryFn: () =>
        verificationRequestsApi.getByVerificationPublicId(
          verificationPublicId,
        ),
      enabled: verificationPublicId.trim().length > 0,
    }),

  requestByPublicId: (
    verificationPublicId: string,
    verificationRequestPublicId: string,
  ) =>
    queryOptions({
      queryKey: verificationsKeys.request(
        verificationPublicId,
        verificationRequestPublicId,
      ),
      queryFn: () =>
        verificationRequestsApi.getByPublicId(
          verificationPublicId,
          verificationRequestPublicId,
        ),
      enabled:
        verificationPublicId.trim().length > 0 &&
        verificationRequestPublicId.trim().length > 0,
    }),

  evidence: (
    verificationPublicId: string,
    verificationRequestPublicId: string,
  ) =>
    queryOptions({
      queryKey: verificationsKeys.evidence(
        verificationPublicId,
        verificationRequestPublicId,
      ),
      queryFn: () =>
        verificationRequestsApi.getEvidence(
          verificationPublicId,
          verificationRequestPublicId,
        ),
      enabled:
        verificationPublicId.trim().length > 0 &&
        verificationRequestPublicId.trim().length > 0,
      // Private evidence should not remain in the query cache.
      staleTime: 0,
      gcTime: 0,
      retry: false,
    }),
} as const;

export default verificationsQueries;
