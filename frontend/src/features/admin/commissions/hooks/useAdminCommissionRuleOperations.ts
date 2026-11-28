
/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Commission Rule Operations Hook
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Create commission rules.
 * - Update commission rules.
 * - Activate commission rules.
 * - Deactivate commission rules.
 * - Invalidate commission rule queries after successful mutations.
 *
 * Architecture:
 * - API communication is delegated to adminCommissionsApi.
 * - Mutation payloads reuse the existing operation models.
 * - Query keys are reused from useAdminCommissionRules.
 * - Rule lifecycle transitions remain controlled by the backend.
 * -----------------------------------------------------------------------------
 */

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { adminCommissionsApi } from '../api';

import {
  adminCommissionRuleKeys,
} from './useAdminCommissionRules';

import type {
  AdminCreateCommissionRuleModel,
  AdminUpdateCommissionRuleModel,
  AdminActivateCommissionRuleModel,
  AdminDeactivateCommissionRuleModel,
} from '../models';

// -----------------------------------------------------------------------------
// Mutation Variables
// -----------------------------------------------------------------------------

export interface AdminUpdateCommissionRuleVariables {
  readonly publicId: string;
  readonly payload: AdminUpdateCommissionRuleModel;
}

export interface AdminActivateCommissionRuleVariables {
  readonly publicId: string;
  readonly payload: AdminActivateCommissionRuleModel;
}

export interface AdminDeactivateCommissionRuleVariables {
  readonly publicId: string;
  readonly payload: AdminDeactivateCommissionRuleModel;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useAdminCommissionRuleOperations() {
  const queryClient = useQueryClient();

  // ---------------------------------------------------------------------------
  // Cache Invalidation
  // ---------------------------------------------------------------------------

  const invalidateCommissionRules = async (): Promise<void> => {
    await queryClient.invalidateQueries({
      queryKey: adminCommissionRuleKeys.all,
    });
  };

  // ---------------------------------------------------------------------------
  // Create Commission Rule
  // ---------------------------------------------------------------------------

  const createMutation = useMutation({
    mutationFn: (payload: AdminCreateCommissionRuleModel) =>
      adminCommissionsApi.createCommissionRule(payload),

    onSuccess: invalidateCommissionRules,
  });

  // ---------------------------------------------------------------------------
  // Update Commission Rule
  // ---------------------------------------------------------------------------

  const updateMutation = useMutation({
    mutationFn: ({
      publicId,
      payload,
    }: AdminUpdateCommissionRuleVariables) =>
      adminCommissionsApi.updateCommissionRule(publicId, payload),

    onSuccess: invalidateCommissionRules,
  });

  // ---------------------------------------------------------------------------
  // Activate Commission Rule
  // ---------------------------------------------------------------------------

  const activateMutation = useMutation({
    mutationFn: ({
      publicId,
      payload,
    }: AdminActivateCommissionRuleVariables) =>
      adminCommissionsApi.activateCommissionRule(publicId, payload),

    onSuccess: invalidateCommissionRules,
  });

  // ---------------------------------------------------------------------------
  // Deactivate Commission Rule
  // ---------------------------------------------------------------------------

  const deactivateMutation = useMutation({
    mutationFn: ({
      publicId,
      payload,
    }: AdminDeactivateCommissionRuleVariables) =>
      adminCommissionsApi.deactivateCommissionRule(publicId, payload),

    onSuccess: invalidateCommissionRules,
  });

  // ---------------------------------------------------------------------------
  // Return
  // ---------------------------------------------------------------------------

  return {
    createCommissionRule: createMutation.mutate,
    createCommissionRuleAsync: createMutation.mutateAsync,
    isCreatingCommissionRule: createMutation.isPending,
    createCommissionRuleError: createMutation.error,
    createCommissionRuleMutation: createMutation,

    updateCommissionRule: updateMutation.mutate,
    updateCommissionRuleAsync: updateMutation.mutateAsync,
    isUpdatingCommissionRule: updateMutation.isPending,
    updateCommissionRuleError: updateMutation.error,
    updateCommissionRuleMutation: updateMutation,

    activateCommissionRule: activateMutation.mutate,
    activateCommissionRuleAsync: activateMutation.mutateAsync,
    isActivatingCommissionRule: activateMutation.isPending,
    activateCommissionRuleError: activateMutation.error,
    activateCommissionRuleMutation: activateMutation,

    deactivateCommissionRule: deactivateMutation.mutate,
    deactivateCommissionRuleAsync: deactivateMutation.mutateAsync,
    isDeactivatingCommissionRule: deactivateMutation.isPending,
    deactivateCommissionRuleError: deactivateMutation.error,
    deactivateCommissionRuleMutation: deactivateMutation,
  };
}
