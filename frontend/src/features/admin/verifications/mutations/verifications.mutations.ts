
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
import { membersKeys } from "@/features/admin/members/queries/members.keys";

interface VerificationMutationVariables {
  verificationPublicId: string;
  identityPublicId?: string;
}

interface VerificationRequestMutationVariables
  extends VerificationMutationVariables {
  verificationRequestPublicId: string;
}

interface RejectVerificationVariables
  extends VerificationMutationVariables {
  requestPublicId: string;
  reason: string;
}

interface RevokeVerificationVariables
  extends VerificationMutationVariables {
  reason: string;
}

export const useVerificationMutations = () => {
  const queryClient = useQueryClient();

  const invalidateVerification = async (
    verificationPublicId: string,
    identityPublicId?: string,
  ): Promise<void> => {
    const invalidations = [
      // Refresh the specific verification and its requests.
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

      // Refresh verification-related lists, including the review queue.
      queryClient.invalidateQueries({
        queryKey: verificationsKeys.all,
      }),
    ];

    // Refresh the verification displayed on the member detail page,
    // when the member's identity ID is supplied.
    if (identityPublicId?.trim()) {
      invalidations.push(
        queryClient.invalidateQueries({
          queryKey: membersKeys.verification(identityPublicId),
        }),
      );
    }

    await Promise.all(invalidations);
  };

  const grantMember = useMutation({
    mutationFn: ({
      verificationPublicId,
      verificationRequestPublicId,
    }: VerificationRequestMutationVariables) =>
      verificationsApi.grantMember(
        verificationPublicId,
        verificationRequestPublicId,
      ),

    onSuccess: async (_, variables) => {
      await invalidateVerification(
        variables.verificationPublicId,
        variables.identityPublicId,
      );
    },
  });

  const grantDriver = useMutation({
    mutationFn: ({
      verificationPublicId,
      verificationRequestPublicId,
    }: VerificationRequestMutationVariables) =>
      verificationsApi.grantDriver(
        verificationPublicId,
        verificationRequestPublicId,
      ),

    onSuccess: async (_, variables) => {
      await invalidateVerification(
        variables.verificationPublicId,
        variables.identityPublicId,
      );
    },
  });

  const rejectVerification = useMutation({
    mutationFn: ({
      verificationPublicId,
      requestPublicId,
      reason,
    }: RejectVerificationVariables) =>
      verificationsApi.reject(
        verificationPublicId,
        requestPublicId,
        reason,
      ),

    onSuccess: async (_, variables) => {
      await invalidateVerification(
        variables.verificationPublicId,
        variables.identityPublicId,
      );
    },
  });

  const reopen = useMutation({
    mutationFn: ({
      verificationPublicId,
    }: VerificationMutationVariables) =>
      verificationsApi.reopen(verificationPublicId),

    onSuccess: async (_, variables) => {
      await invalidateVerification(
        variables.verificationPublicId,
        variables.identityPublicId,
      );
    },
  });

  const expire = useMutation({
    mutationFn: ({
      verificationPublicId,
    }: VerificationMutationVariables) =>
      verificationsApi.expire(verificationPublicId),

    onSuccess: async (_, variables) => {
      await invalidateVerification(
        variables.verificationPublicId,
        variables.identityPublicId,
      );
    },
  });

  const revoke = useMutation({
    mutationFn: ({
      verificationPublicId,
      reason,
    }: RevokeVerificationVariables) =>
      verificationsApi.revoke(verificationPublicId, reason),

    onSuccess: async (_, variables) => {
      await invalidateVerification(
        variables.verificationPublicId,
        variables.identityPublicId,
      );
    },
  });

  const approveRequest = useMutation({
    mutationFn: ({
      verificationPublicId,
      verificationRequestPublicId,
    }: VerificationRequestMutationVariables) =>
      verificationRequestsApi.approve(
        verificationPublicId,
        verificationRequestPublicId,
      ),

    onSuccess: async (_, variables) => {
      await invalidateVerification(
        variables.verificationPublicId,
        variables.identityPublicId,
      );
    },
  });

  const rejectRequest = useMutation({
    mutationFn: ({
      verificationPublicId,
      verificationRequestPublicId,
      reason,
    }: VerificationRequestMutationVariables & { reason: string }) =>
      verificationRequestsApi.reject(
        verificationPublicId,
        verificationRequestPublicId,
        reason,
      ),

    onSuccess: async (_, variables) => {
      await invalidateVerification(
        variables.verificationPublicId,
        variables.identityPublicId,
      );
    },
  });

  const cancelRequest = useMutation({
    mutationFn: ({
      verificationPublicId,
      verificationRequestPublicId,
    }: VerificationRequestMutationVariables) =>
      verificationRequestsApi.cancel(
        verificationPublicId,
        verificationRequestPublicId,
      ),

    onSuccess: async (_, variables) => {
      await invalidateVerification(
        variables.verificationPublicId,
        variables.identityPublicId,
      );
    },
  });

  return {
    grantMember,
    grantDriver,
    rejectVerification,
    reopen,
    expire,
    revoke,
    approveRequest,
    rejectRequest,
    cancelRequest,
  };
};

export default useVerificationMutations;
