
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  adminJourneySettlementApi,
} from '../api';

import type {
  AdminJourneySettlementCreateRequest,
  AdminJourneySettlementSubmitRequest,
  AdminJourneySettlementProcessRequest,
  AdminJourneySettlementCompleteRequest,
  AdminJourneySettlementFailRequest,
  AdminJourneySettlementHoldRequest,
  AdminJourneySettlementCancelRequest,
} from '../models';

import {
  adminJourneySettlementKeys,
} from './useAdminJourneySettlements';

// -----------------------------------------------------------------------------
// Mutation Variables
// -----------------------------------------------------------------------------

export interface CreateJourneySettlementVariables {
  input: AdminJourneySettlementCreateRequest;
}

export interface SubmitJourneySettlementVariables {
  journeySettlementPublicId: string;
  input?: AdminJourneySettlementSubmitRequest;
}

export interface ProcessJourneySettlementVariables {
  journeySettlementPublicId: string;
  input?: AdminJourneySettlementProcessRequest;
}

export interface CompleteJourneySettlementVariables {
  journeySettlementPublicId: string;
  input: AdminJourneySettlementCompleteRequest;
}

export interface FailJourneySettlementVariables {
  journeySettlementPublicId: string;
  input: AdminJourneySettlementFailRequest;
}

export interface HoldJourneySettlementVariables {
  journeySettlementPublicId: string;
  input?: AdminJourneySettlementHoldRequest;
}

export interface CancelJourneySettlementVariables {
  journeySettlementPublicId: string;
  input?: AdminJourneySettlementCancelRequest;
}

// -----------------------------------------------------------------------------
// Journey Settlement Operations
// -----------------------------------------------------------------------------

export const useAdminJourneySettlementOperations = () => {
  const queryClient = useQueryClient();

  const invalidateJourneySettlements = async (): Promise<void> => {
    await queryClient.invalidateQueries({
      queryKey: adminJourneySettlementKeys.all,
    });
  };

  // ---------------------------------------------------------------------------
  // Create Settlement
  // ---------------------------------------------------------------------------

  const createSettlement = useMutation<
    unknown,
    Error,
    CreateJourneySettlementVariables
  >({
    mutationFn: ({ input }) =>
      adminJourneySettlementApi.create(input),
    onSuccess: invalidateJourneySettlements,
  });

  // ---------------------------------------------------------------------------
  // Submit Settlement
  // ---------------------------------------------------------------------------

  const submitSettlement = useMutation<
    unknown,
    Error,
    SubmitJourneySettlementVariables
  >({
    mutationFn: ({ journeySettlementPublicId, input }) =>
      adminJourneySettlementApi.submit(
        journeySettlementPublicId,
        input,
      ),
    onSuccess: invalidateJourneySettlements,
  });

  // ---------------------------------------------------------------------------
  // Process Settlement
  // ---------------------------------------------------------------------------

  const processSettlement = useMutation<
    unknown,
    Error,
    ProcessJourneySettlementVariables
  >({
    mutationFn: ({ journeySettlementPublicId, input }) =>
      adminJourneySettlementApi.process(
        journeySettlementPublicId,
        input,
      ),
    onSuccess: invalidateJourneySettlements,
  });

  // ---------------------------------------------------------------------------
  // Complete Settlement
  // ---------------------------------------------------------------------------

  const completeSettlement = useMutation<
    unknown,
    Error,
    CompleteJourneySettlementVariables
  >({
    mutationFn: ({ journeySettlementPublicId, input }) =>
      adminJourneySettlementApi.complete(
        journeySettlementPublicId,
        input,
      ),
    onSuccess: invalidateJourneySettlements,
  });

  // ---------------------------------------------------------------------------
  // Fail Settlement
  // ---------------------------------------------------------------------------

  const failSettlement = useMutation<
    unknown,
    Error,
    FailJourneySettlementVariables
  >({
    mutationFn: ({ journeySettlementPublicId, input }) =>
      adminJourneySettlementApi.fail(
        journeySettlementPublicId,
        input,
      ),
    onSuccess: invalidateJourneySettlements,
  });

  // ---------------------------------------------------------------------------
  // Hold Settlement
  // ---------------------------------------------------------------------------

  const holdSettlement = useMutation<
    unknown,
    Error,
    HoldJourneySettlementVariables
  >({
    mutationFn: ({ journeySettlementPublicId, input }) =>
      adminJourneySettlementApi.hold(
        journeySettlementPublicId,
        input,
      ),
    onSuccess: invalidateJourneySettlements,
  });

  // ---------------------------------------------------------------------------
  // Cancel Settlement
  // ---------------------------------------------------------------------------

  const cancelSettlement = useMutation<
    unknown,
    Error,
    CancelJourneySettlementVariables
  >({
    mutationFn: ({ journeySettlementPublicId, input }) =>
      adminJourneySettlementApi.cancel(
        journeySettlementPublicId,
        input,
      ),
    onSuccess: invalidateJourneySettlements,
  });

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  return {
    createSettlement,
    submitSettlement,
    processSettlement,
    completeSettlement,
    failSettlement,
    holdSettlement,
    cancelSettlement,

    isCreating: createSettlement.isPending,
    isSubmitting: submitSettlement.isPending,
    isProcessing: processSettlement.isPending,
    isCompleting: completeSettlement.isPending,
    isFailing: failSettlement.isPending,
    isHolding: holdSettlement.isPending,
    isCancelling: cancelSettlement.isPending,

    isLoading:
      createSettlement.isPending ||
      submitSettlement.isPending ||
      processSettlement.isPending ||
      completeSettlement.isPending ||
      failSettlement.isPending ||
      holdSettlement.isPending ||
      cancelSettlement.isPending,
  };
};

export default useAdminJourneySettlementOperations;
