
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  adminJourneyCompletionApi,
} from '../api';

import type {
  AdminJourneyCompletionCreateRequest,
  AdminJourneyCompletionRequest,
  AdminJourneyCompletionConfirmRequest,
  AdminJourneyCompletionWithdrawConfirmationRequest,
  AdminJourneyCompletionCancelRequest,
} from '../models';

import {
  adminJourneyCompletionKeys,
} from './useAdminJourneyCompletions';

// -----------------------------------------------------------------------------
// Mutation Variables
// -----------------------------------------------------------------------------

export interface CreateJourneyCompletionVariables {
  input: AdminJourneyCompletionCreateRequest;
}

export interface RequestJourneyCompletionVariables {
  journeyCompletionPublicId: string;
  input?: AdminJourneyCompletionRequest;
}

export interface ConfirmJourneyCompletionVariables {
  journeyCompletionPublicId: string;
  input?: AdminJourneyCompletionConfirmRequest;
}

export interface WithdrawJourneyCompletionConfirmationVariables {
  journeyCompletionPublicId: string;
  confirmationPublicId: string;
  input?: AdminJourneyCompletionWithdrawConfirmationRequest;
}

export interface CancelJourneyCompletionVariables {
  journeyCompletionPublicId: string;
  input?: AdminJourneyCompletionCancelRequest;
}

// -----------------------------------------------------------------------------
// Journey Completion Operations
// -----------------------------------------------------------------------------

export const useAdminJourneyCompletionOperations = () => {
  const queryClient = useQueryClient();

  const invalidateJourneyCompletions = async (): Promise<void> => {
    await queryClient.invalidateQueries({
      queryKey: adminJourneyCompletionKeys.all,
    });
  };

  // ---------------------------------------------------------------------------
  // Create Completion
  // ---------------------------------------------------------------------------

  const createCompletion = useMutation<
    unknown,
    Error,
    CreateJourneyCompletionVariables
  >({
    mutationFn: ({ input }) =>
      adminJourneyCompletionApi.create(input),
    onSuccess: invalidateJourneyCompletions,
  });

  // ---------------------------------------------------------------------------
  // Request Completion
  // ---------------------------------------------------------------------------

  const requestCompletion = useMutation<
    unknown,
    Error,
    RequestJourneyCompletionVariables
  >({
    mutationFn: ({ journeyCompletionPublicId, input }) =>
      adminJourneyCompletionApi.requestCompletion(
        journeyCompletionPublicId,
        input,
      ),
    onSuccess: invalidateJourneyCompletions,
  });

  // ---------------------------------------------------------------------------
  // Confirm Completion
  // ---------------------------------------------------------------------------

  const confirmCompletion = useMutation<
    unknown,
    Error,
    ConfirmJourneyCompletionVariables
  >({
    mutationFn: ({ journeyCompletionPublicId, input }) =>
      adminJourneyCompletionApi.confirm(
        journeyCompletionPublicId,
        input,
      ),
    onSuccess: invalidateJourneyCompletions,
  });

  // ---------------------------------------------------------------------------
  // Withdraw Confirmation
  // ---------------------------------------------------------------------------

  const withdrawConfirmation = useMutation<
    unknown,
    Error,
    WithdrawJourneyCompletionConfirmationVariables
  >({
    mutationFn: ({
      journeyCompletionPublicId,
      confirmationPublicId,
      input,
    }) =>
      adminJourneyCompletionApi.withdrawConfirmation(
        journeyCompletionPublicId,
        confirmationPublicId,
        input,
      ),
    onSuccess: invalidateJourneyCompletions,
  });

  // ---------------------------------------------------------------------------
  // Cancel Completion
  // ---------------------------------------------------------------------------

  const cancelCompletion = useMutation<
    unknown,
    Error,
    CancelJourneyCompletionVariables
  >({
    mutationFn: ({ journeyCompletionPublicId, input }) =>
      adminJourneyCompletionApi.cancel(
        journeyCompletionPublicId,
        input,
      ),
    onSuccess: invalidateJourneyCompletions,
  });

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  return {
    createCompletion,
    requestCompletion,
    confirmCompletion,
    withdrawConfirmation,
    cancelCompletion,

    isCreating: createCompletion.isPending,
    isRequesting: requestCompletion.isPending,
    isConfirming: confirmCompletion.isPending,
    isWithdrawingConfirmation: withdrawConfirmation.isPending,
    isCancelling: cancelCompletion.isPending,

    isLoading:
      createCompletion.isPending ||
      requestCompletion.isPending ||
      confirmCompletion.isPending ||
      withdrawConfirmation.isPending ||
      cancelCompletion.isPending,
  };
};

export default useAdminJourneyCompletionOperations;
