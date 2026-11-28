
/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Booking Commission Operations Hook
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Create booking commissions.
 * - Assess booking commissions.
 * - Cancel booking commissions.
 * - Invalidate booking commission queries after successful mutations.
 *
 * Architecture:
 * - API communication is delegated to adminCommissionsApi.
 * - Mutation payloads reuse the existing operation models.
 * - Query keys are reused from useAdminBookingCommissions.
 * - No commission calculations or lifecycle decisions are performed here.
 * -----------------------------------------------------------------------------
 */

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { adminCommissionsApi } from '../api';

import {
  adminBookingCommissionKeys,
} from './useAdminBookingCommissions';

import type {
  AdminCreateBookingCommissionModel,
  AdminAssessBookingCommissionModel,
  AdminCancelBookingCommissionModel,
} from '../models';

// -----------------------------------------------------------------------------
// Mutation Variables
// -----------------------------------------------------------------------------

export interface AdminAssessBookingCommissionVariables {
  readonly publicId: string;
  readonly payload: AdminAssessBookingCommissionModel;
}

export interface AdminCancelBookingCommissionVariables {
  readonly publicId: string;
  readonly payload: AdminCancelBookingCommissionModel;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useAdminBookingCommissionOperations() {
  const queryClient = useQueryClient();

  // ---------------------------------------------------------------------------
  // Cache Invalidation
  // ---------------------------------------------------------------------------

  const invalidateBookingCommissions = async (): Promise<void> => {
    await queryClient.invalidateQueries({
      queryKey: adminBookingCommissionKeys.all,
    });
  };

  // ---------------------------------------------------------------------------
  // Create Booking Commission
  // ---------------------------------------------------------------------------

  const createMutation = useMutation({
    mutationFn: (payload: AdminCreateBookingCommissionModel) =>
      adminCommissionsApi.createBookingCommission(payload),

    onSuccess: invalidateBookingCommissions,
  });

  // ---------------------------------------------------------------------------
  // Assess Booking Commission
  // ---------------------------------------------------------------------------

  const assessMutation = useMutation({
    mutationFn: ({
      publicId,
      payload,
    }: AdminAssessBookingCommissionVariables) =>
      adminCommissionsApi.assessBookingCommission(publicId, payload),

    onSuccess: invalidateBookingCommissions,
  });

  // ---------------------------------------------------------------------------
  // Cancel Booking Commission
  // ---------------------------------------------------------------------------

  const cancelMutation = useMutation({
    mutationFn: ({
      publicId,
      payload,
    }: AdminCancelBookingCommissionVariables) =>
      adminCommissionsApi.cancelBookingCommission(publicId, payload),

    onSuccess: invalidateBookingCommissions,
  });

  // ---------------------------------------------------------------------------
  // Return
  // ---------------------------------------------------------------------------

  return {
    createBookingCommission: createMutation.mutate,
    createBookingCommissionAsync: createMutation.mutateAsync,
    isCreatingBookingCommission: createMutation.isPending,
    createBookingCommissionError: createMutation.error,
    createBookingCommissionMutation: createMutation,

    assessBookingCommission: assessMutation.mutate,
    assessBookingCommissionAsync: assessMutation.mutateAsync,
    isAssessingBookingCommission: assessMutation.isPending,
    assessBookingCommissionError: assessMutation.error,
    assessBookingCommissionMutation: assessMutation,

    cancelBookingCommission: cancelMutation.mutate,
    cancelBookingCommissionAsync: cancelMutation.mutateAsync,
    isCancellingBookingCommission: cancelMutation.isPending,
    cancelBookingCommissionError: cancelMutation.error,
    cancelBookingCommissionMutation: cancelMutation,
  };
}
