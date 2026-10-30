
/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Financial Payment Provider Operations Hook
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Create financial payment providers.
 * - Update provider details.
 * - Enable and disable providers.
 * - Change provider integration status.
 * - Invalidate provider queries after successful operations.
 *
 * Architecture:
 * - API access remains in the API layer.
 * - TanStack Query manages mutations and cache invalidation.
 * - Business rules remain in the backend.
 * -----------------------------------------------------------------------------
 */

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { adminProvidersApi } from '../api';

import type {
  AdminChangeProviderStatusInput,
  AdminCreateProviderInput,
  AdminProviderOperationParams,
  AdminUpdateProviderInput,
} from '../models';

import { adminProviderKeys } from './useAdminProviders';

// -----------------------------------------------------------------------------
// Mutation Variables
// -----------------------------------------------------------------------------

export interface AdminUpdateProviderVariables {
  params: AdminProviderOperationParams;
  input: AdminUpdateProviderInput;
}

export interface AdminChangeProviderStatusVariables {
  params: AdminProviderOperationParams;
  input: AdminChangeProviderStatusInput;
}

// -----------------------------------------------------------------------------
// Operations Hook
// -----------------------------------------------------------------------------

export function useAdminProviderOperations() {
  const queryClient = useQueryClient();

  // ---------------------------------------------------------------------------
  // Cache Invalidation
  // ---------------------------------------------------------------------------

  const invalidateProviderQueries = async () => {
    await queryClient.invalidateQueries({
      queryKey: adminProviderKeys.all,
    });
  };

  // ---------------------------------------------------------------------------
  // Create Provider
  // ---------------------------------------------------------------------------

  const createProvider = useMutation({
    mutationFn: (input: AdminCreateProviderInput) =>
      adminProvidersApi.create(input),

    onSuccess: invalidateProviderQueries,
  });

  // ---------------------------------------------------------------------------
  // Update Provider
  // ---------------------------------------------------------------------------

  const updateProvider = useMutation({
    mutationFn: ({
      params,
      input,
    }: AdminUpdateProviderVariables) =>
      adminProvidersApi.update(params, input),

    onSuccess: invalidateProviderQueries,
  });

  // ---------------------------------------------------------------------------
  // Enable Provider
  // ---------------------------------------------------------------------------

  const enableProvider = useMutation({
    mutationFn: (params: AdminProviderOperationParams) =>
      adminProvidersApi.enable(params),

    onSuccess: invalidateProviderQueries,
  });

  // ---------------------------------------------------------------------------
  // Disable Provider
  // ---------------------------------------------------------------------------

  const disableProvider = useMutation({
    mutationFn: (params: AdminProviderOperationParams) =>
      adminProvidersApi.disable(params),

    onSuccess: invalidateProviderQueries,
  });

  // ---------------------------------------------------------------------------
  // Change Provider Status
  // ---------------------------------------------------------------------------

  const changeProviderStatus = useMutation({
    mutationFn: ({
      params,
      input,
    }: AdminChangeProviderStatusVariables) =>
      adminProvidersApi.changeStatus(params, input),

    onSuccess: invalidateProviderQueries,
  });

  // ---------------------------------------------------------------------------
  // Return
  // ---------------------------------------------------------------------------

  return {
    createProvider,
    updateProvider,
    enableProvider,
    disableProvider,
    changeProviderStatus,

    isCreating: createProvider.isPending,
    isUpdating: updateProvider.isPending,
    isEnabling: enableProvider.isPending,
    isDisabling: disableProvider.isPending,
    isChangingStatus: changeProviderStatus.isPending,

    isLoading:
      createProvider.isPending ||
      updateProvider.isPending ||
      enableProvider.isPending ||
      disableProvider.isPending ||
      changeProviderStatus.isPending,
  };
}
