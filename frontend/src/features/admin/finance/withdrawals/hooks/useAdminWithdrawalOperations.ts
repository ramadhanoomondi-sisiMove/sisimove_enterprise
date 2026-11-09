
/**
 * -----------------------------------------------------------------------------
 * SisiMove Admin — Financial Account Withdrawal Operations Hook
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Request a new withdrawal.
 * - Process a pending withdrawal.
 * - Complete a processing withdrawal.
 * - Mark a withdrawal as failed.
 * - Cancel a withdrawal.
 *
 * Architecture:
 * - API access remains in the API layer.
 * - TanStack Query manages mutations and cache invalidation.
 * - Backend remains responsible for lifecycle validation.
 * -----------------------------------------------------------------------------
 */

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { AdminWithdrawalsApi } from '../api';

import type { AdminWithdrawal } from '../models/admin-withdrawal.model';

import type {
  AdminWithdrawalRequest,
  AdminWithdrawalProcessRequest,
  AdminWithdrawalCompleteRequest,
  AdminWithdrawalFailRequest,
  AdminWithdrawalCancelRequest,
} from '../models/admin-withdrawal-operations.model';

import { adminWithdrawalKeys } from './useAdminWithdrawals';

// -----------------------------------------------------------------------------
// Mutation Hook
// -----------------------------------------------------------------------------

export function useAdminWithdrawalOperations() {
  const queryClient = useQueryClient();

  const invalidateWithdrawals = () => {
    void queryClient.invalidateQueries({
      queryKey: adminWithdrawalKeys.all,
    });
  };

  // ---------------------------------------------------------------------------
  // Request Withdrawal
  // ---------------------------------------------------------------------------

  const requestMutation = useMutation<
    AdminWithdrawal,
    Error,
    AdminWithdrawalRequest
  >({
    mutationFn: (payload) =>
      AdminWithdrawalsApi.request(payload),

    onSuccess: invalidateWithdrawals,
  });

  // ---------------------------------------------------------------------------
  // Process Withdrawal
  // ---------------------------------------------------------------------------

  const processMutation = useMutation<
    AdminWithdrawal,
    Error,
    {
      withdrawalPublicId: string;
      payload: AdminWithdrawalProcessRequest;
    }
  >({
    mutationFn: ({ withdrawalPublicId, payload }) =>
      AdminWithdrawalsApi.process(withdrawalPublicId, payload),

    onSuccess: invalidateWithdrawals,
  });

  // ---------------------------------------------------------------------------
  // Complete Withdrawal
  // ---------------------------------------------------------------------------

  const completeMutation = useMutation<
    AdminWithdrawal,
    Error,
    {
      withdrawalPublicId: string;
      payload: AdminWithdrawalCompleteRequest;
    }
  >({
    mutationFn: ({ withdrawalPublicId, payload }) =>
      AdminWithdrawalsApi.complete(withdrawalPublicId, payload),

    onSuccess: invalidateWithdrawals,
  });

  // ---------------------------------------------------------------------------
  // Fail Withdrawal
  // ---------------------------------------------------------------------------

  const failMutation = useMutation<
    AdminWithdrawal,
    Error,
    {
      withdrawalPublicId: string;
      payload: AdminWithdrawalFailRequest;
    }
  >({
    mutationFn: ({ withdrawalPublicId, payload }) =>
      AdminWithdrawalsApi.fail(withdrawalPublicId, payload),

    onSuccess: invalidateWithdrawals,
  });

  // ---------------------------------------------------------------------------
  // Cancel Withdrawal
  // ---------------------------------------------------------------------------

  const cancelMutation = useMutation<
    AdminWithdrawal,
    Error,
    {
      withdrawalPublicId: string;
      payload: AdminWithdrawalCancelRequest;
    }
  >({
    mutationFn: ({ withdrawalPublicId, payload }) =>
      AdminWithdrawalsApi.cancel(withdrawalPublicId, payload),

    onSuccess: invalidateWithdrawals,
  });

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  const isSubmitting =
    requestMutation.isPending ||
    processMutation.isPending ||
    completeMutation.isPending ||
    failMutation.isPending ||
    cancelMutation.isPending;

  const error =
    requestMutation.error ??
    processMutation.error ??
    completeMutation.error ??
    failMutation.error ??
    cancelMutation.error;

  return {
    // Mutation instances
    requestMutation,
    processMutation,
    completeMutation,
    failMutation,
    cancelMutation,

    // Async operation methods
    requestWithdrawal: requestMutation.mutateAsync,

    processWithdrawal: (
      withdrawalPublicId: string,
      payload: AdminWithdrawalProcessRequest,
    ) =>
      processMutation.mutateAsync({
        withdrawalPublicId,
        payload,
      }),

    completeWithdrawal: (
      withdrawalPublicId: string,
      payload: AdminWithdrawalCompleteRequest,
    ) =>
      completeMutation.mutateAsync({
        withdrawalPublicId,
        payload,
      }),

    failWithdrawal: (
      withdrawalPublicId: string,
      payload: AdminWithdrawalFailRequest,
    ) =>
      failMutation.mutateAsync({
        withdrawalPublicId,
        payload,
      }),

    cancelWithdrawal: (
      withdrawalPublicId: string,
      payload: AdminWithdrawalCancelRequest,
    ) =>
      cancelMutation.mutateAsync({
        withdrawalPublicId,
        payload,
      }),

    // Shared state
    isSubmitting,
    error,
  };
}

export default useAdminWithdrawalOperations;
