
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  adminJourneyCompletionApi,
} from '../api';

import type {
  AdminJourneyCompletionOpenDisputeRequest,
  AdminJourneyCompletionReviewDisputeRequest,
  AdminJourneyCompletionResolveDisputeRequest,
  AdminJourneyCompletionRejectDisputeRequest,
  AdminJourneyCompletionWithdrawDisputeRequest,
} from '../models';

import {
  adminJourneyCompletionKeys,
} from './useAdminJourneyCompletions';

// -----------------------------------------------------------------------------
// Mutation Variables
// -----------------------------------------------------------------------------

export interface OpenJourneyCompletionDisputeVariables {
  journeyCompletionPublicId: string;
  input: AdminJourneyCompletionOpenDisputeRequest;
}

export interface ReviewJourneyCompletionDisputeVariables {
  journeyCompletionPublicId: string;
  disputePublicId: string;
  input?: AdminJourneyCompletionReviewDisputeRequest;
}

export interface ResolveJourneyCompletionDisputeVariables {
  journeyCompletionPublicId: string;
  disputePublicId: string;
  input: AdminJourneyCompletionResolveDisputeRequest;
}

export interface RejectJourneyCompletionDisputeVariables {
  journeyCompletionPublicId: string;
  disputePublicId: string;
  input: AdminJourneyCompletionRejectDisputeRequest;
}

export interface WithdrawJourneyCompletionDisputeVariables {
  journeyCompletionPublicId: string;
  disputePublicId: string;
  input?: AdminJourneyCompletionWithdrawDisputeRequest;
}

// -----------------------------------------------------------------------------
// Journey Completion Dispute Operations
// -----------------------------------------------------------------------------

export const useAdminJourneyCompletionDisputeOperations = () => {
  const queryClient = useQueryClient();

  const invalidateJourneyCompletions = async (): Promise<void> => {
    await queryClient.invalidateQueries({
      queryKey: adminJourneyCompletionKeys.all,
    });
  };

  // ---------------------------------------------------------------------------
  // Open Dispute
  // ---------------------------------------------------------------------------

  const openDispute = useMutation<
    unknown,
    Error,
    OpenJourneyCompletionDisputeVariables
  >({
    mutationFn: ({ journeyCompletionPublicId, input }) =>
      adminJourneyCompletionApi.openDispute(
        journeyCompletionPublicId,
        input,
      ),
    onSuccess: invalidateJourneyCompletions,
  });

  // ---------------------------------------------------------------------------
  // Review Dispute
  // ---------------------------------------------------------------------------

  const reviewDispute = useMutation<
    unknown,
    Error,
    ReviewJourneyCompletionDisputeVariables
  >({
    mutationFn: ({
      journeyCompletionPublicId,
      disputePublicId,
      input,
    }) =>
      adminJourneyCompletionApi.reviewDispute(
        journeyCompletionPublicId,
        disputePublicId,
        input,
      ),
    onSuccess: invalidateJourneyCompletions,
  });

  // ---------------------------------------------------------------------------
  // Resolve Dispute
  // ---------------------------------------------------------------------------

  const resolveDispute = useMutation<
    unknown,
    Error,
    ResolveJourneyCompletionDisputeVariables
  >({
    mutationFn: ({
      journeyCompletionPublicId,
      disputePublicId,
      input,
    }) =>
      adminJourneyCompletionApi.resolveDispute(
        journeyCompletionPublicId,
        disputePublicId,
        input,
      ),
    onSuccess: invalidateJourneyCompletions,
  });

  // ---------------------------------------------------------------------------
  // Reject Dispute
  // ---------------------------------------------------------------------------

  const rejectDispute = useMutation<
    unknown,
    Error,
    RejectJourneyCompletionDisputeVariables
  >({
    mutationFn: ({
      journeyCompletionPublicId,
      disputePublicId,
      input,
    }) =>
      adminJourneyCompletionApi.rejectDispute(
        journeyCompletionPublicId,
        disputePublicId,
        input,
      ),
    onSuccess: invalidateJourneyCompletions,
  });

  // ---------------------------------------------------------------------------
  // Withdraw Dispute
  // ---------------------------------------------------------------------------

  const withdrawDispute = useMutation<
    unknown,
    Error,
    WithdrawJourneyCompletionDisputeVariables
  >({
    mutationFn: ({
      journeyCompletionPublicId,
      disputePublicId,
      input,
    }) =>
      adminJourneyCompletionApi.withdrawDispute(
        journeyCompletionPublicId,
        disputePublicId,
        input,
      ),
    onSuccess: invalidateJourneyCompletions,
  });

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  return {
    openDispute,
    reviewDispute,
    resolveDispute,
    rejectDispute,
    withdrawDispute,

    isOpening: openDispute.isPending,
    isReviewing: reviewDispute.isPending,
    isResolving: resolveDispute.isPending,
    isRejecting: rejectDispute.isPending,
    isWithdrawing: withdrawDispute.isPending,

    isLoading:
      openDispute.isPending ||
      reviewDispute.isPending ||
      resolveDispute.isPending ||
      rejectDispute.isPending ||
      withdrawDispute.isPending,
  };
};

export default useAdminJourneyCompletionDisputeOperations;
