
/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Earning Commission Operations Hook
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Create earning commissions.
 * - Assess earning commissions.
 * - Cancel earning commissions.
 * - Invalidate earning commission queries after successful mutations.
 *
 * Architecture:
 * - API communication is delegated to adminCommissionsApi.
 * - Mutation payloads reuse the existing operation models.
 * - Query keys are reused from useAdminEarningCommissions.
 * - netAmount is passed through unchanged; it is never recalculated here.
 * -----------------------------------------------------------------------------
 */

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { adminCommissionsApi } from '../api';

import {
  adminEarningCommissionKeys,
} from './useAdminEarningCommissions';

import type {
  AdminCreateEarningCommissionModel,
  AdminAssessEarningCommissionModel,
  AdminCancelEarningCommissionModel,
} from '../models';

// -----------------------------------------------------------------------------
// Mutation Variables
// -----------------------------------------------------------------------------

export interface AdminAssessEarningCommissionVariables {
  readonly publicId: string;
  readonly payload: AdminAssessEarningCommissionModel;
}

export interface AdminCancelEarningCommissionVariables {
  readonly publicId: string;
  readonly payload: AdminCancelEarningCommissionModel;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useAdminEarningCommissionOperations() {
  const queryClient = useQueryClient();

  // ---------------------------------------------------------------------------
  // Cache Invalidation
  // ---------------------------------------------------------------------------

  const invalidateEarningCommissions = async (): Promise<void> => {
    await queryClient.invalidateQueries({
      queryKey: adminEarningCommissionKeys.all,
    });
  };

  // ---------------------------------------------------------------------------
  // Create Earning Commission
  // ---------------------------------------------------------------------------

  const createMutation = useMutation({
    mutationFn: (payload: AdminCreateEarningCommissionModel) =>
      adminCommissionsApi.createEarningCommission(payload),

    onSuccess: invalidateEarningCommissions,
  });

  // ---------------------------------------------------------------------------
  // Assess Earning Commission
  // ---------------------------------------------------------------------------

  const assessMutation = useMutation({
    mutationFn: ({
      publicId,
      payload,
    }: AdminAssessEarningCommissionVariables) =>
      adminCommissionsApi.assessEarningCommission(publicId, payload),

    onSuccess: invalidateEarningCommissions,
  });

  // ---------------------------------------------------------------------------
  // Cancel Earning Commission
  // ---------------------------------------------------------------------------

  const cancelMutation = useMutation({
    mutationFn: ({
      publicId,
      payload,
    }: AdminCancelEarningCommissionVariables) =>
      adminCommissionsApi.cancelEarningCommission(publicId, payload),

    onSuccess: invalidateEarningCommissions,
  });

  // ---------------------------------------------------------------------------
  // Return
  // ---------------------------------------------------------------------------

  return {
    createEarningCommission: createMutation.mutate,
    createEarningCommissionAsync: createMutation.mutateAsync,
    isCreatingEarningCommission: createMutation.isPending,
    createEarningCommissionError: createMutation.error,
    createEarningCommissionMutation: createMutation,

    assessEarningCommission: assessMutation.mutate,
    assessEarningCommissionAsync: assessMutation.mutateAsync,
    isAssessingEarningCommission: assessMutation.isPending,
    assessEarningCommissionError: assessMutation.error,
    assessEarningCommissionMutation: assessMutation,

    cancelEarningCommission: cancelMutation.mutate,
    cancelEarningCommissionAsync: cancelMutation.mutateAsync,
    isCancellingEarningCommission: cancelMutation.isPending,
    cancelEarningCommissionError: cancelMutation.error,
    cancelEarningCommissionMutation: cancelMutation,
  };
}
