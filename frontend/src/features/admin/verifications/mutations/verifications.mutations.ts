
/**
 * sisiMove — Admin Verification Mutations
 *
 * TanStack Query mutations for verification records and requests.
 * Uses the existing API adapters and centralized verification query keys.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { verificationRequestsApi } from "../api/verification-requests.api";
import { verificationsApi } from "../api/verifications.api";
import { verificationsKeys } from "../queries/verifications.keys";

export const useVerificationMutations = () => {
  const queryClient = useQueryClient();

  const invalidateVerification = async (
    verificationPublicId: string,
  ): Promise<void> => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: verificationsKeys.detail(verificationPublicId),
      }),
      queryClient.invalidateQueries({
        queryKey: verificationsKeys.counts(),
      }),
      queryClient.invalidateQueries({
        queryKey: verificationsKeys.byIdentity(),
      }),
      queryClient.invalidateQueries({
        queryKey: verificationsKeys.requests(verificationPublicId),
      }),
    ]);
  };

  const grantMember = useMutation({
    mutationFn: ({
      verificationPublicId,
      verificationRequestPublicId,
    }: {
      verificationPublicId: string;
      verificationRequestPublicId: string;
    }) =>
      verificationsApi.grantMember(
        verificationPublicId,
        verificationRequestPublicId,
      ),
    onSuccess: async (_, variables) => {
      await invalidateVerification(variables.verificationPublicId);
    },
  });

  const grantDriver = useMutation({
    mutationFn: ({
      verificationPublicId,
      verificationRequestPublicId,
    }: {
      verificationPublicId: string;
      verificationRequestPublicId: string;
    }) =>
      verificationsApi.grantDriver(
        verificationPublicId,
        verificationRequestPublicId,
      ),
    onSuccess: async (_, variables) => {
      await invalidateVerification(variables.verificationPublicId);
    },
  });

  const rejectVerification = useMutation({
    mutationFn: ({
      verificationPublicId,
      requestPublicId,
      reason,
    }: {
      verificationPublicId: string;
      requestPublicId: string;
      reason: string;
    }) =>
      verificationsApi.reject(
        verificationPublicId,
        requestPublicId,
        reason,
      ),
    onSuccess: async (_, variables) => {
      await invalidateVerification(variables.verificationPublicId);
    },
  });

  const reopen = useMutation({
    mutationFn: (verificationPublicId: string) =>
      verificationsApi.reopen(verificationPublicId),
    onSuccess: async (_, verificationPublicId) => {
      await invalidateVerification(verificationPublicId);
    },
  });

  const revoke = useMutation({
    mutationFn: ({
      verificationPublicId,
      reason,
    }: {
      verificationPublicId: string;
      reason: string;
    }) => verificationsApi.revoke(verificationPublicId, reason),
    onSuccess: async (_, variables) => {
      await invalidateVerification(variables.verificationPublicId);
    },
  });

  const approveRequest = useMutation({
    mutationFn: ({
      verificationPublicId,
      verificationRequestPublicId,
    }: {
      verificationPublicId: string;
      verificationRequestPublicId: string;
    }) =>
      verificationRequestsApi.approve(
        verificationPublicId,
        verificationRequestPublicId,
      ),
    onSuccess: async (_, variables) => {
      await invalidateVerification(variables.verificationPublicId);
    },
  });

  const rejectRequest = useMutation({
    mutationFn: ({
      verificationPublicId,
      verificationRequestPublicId,
      reason,
    }: {
      verificationPublicId: string;
      verificationRequestPublicId: string;
      reason: string;
    }) =>
      verificationRequestsApi.reject(
        verificationPublicId,
        verificationRequestPublicId,
        reason,
      ),
    onSuccess: async (_, variables) => {
      await invalidateVerification(variables.verificationPublicId);
    },
  });

  const cancelRequest = useMutation({
    mutationFn: ({
      verificationPublicId,
      verificationRequestPublicId,
    }: {
      verificationPublicId: string;
      verificationRequestPublicId: string;
    }) =>
      verificationRequestsApi.cancel(
        verificationPublicId,
        verificationRequestPublicId,
      ),
    onSuccess: async (_, variables) => {
      await invalidateVerification(variables.verificationPublicId);
    },
  });

  return {
    grantMember,
    grantDriver,
    rejectVerification,
    reopen,
    revoke,
    approveRequest,
    rejectRequest,
    cancelRequest,
  };
};

export default useVerificationMutations;
