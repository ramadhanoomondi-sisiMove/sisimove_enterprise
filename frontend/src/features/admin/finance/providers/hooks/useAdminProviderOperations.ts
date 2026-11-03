
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
 * - Configure M-PESA credentials securely.
 * - Test M-PESA Daraja OAuth authentication.
 * - Enable and disable provider capabilities.
 * - Invalidate provider queries after successful state-changing operations.
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
  AdminConfigureMpesaInput,
  AdminCreateProviderInput,
  AdminProviderCapabilityOperationParams,
  AdminProviderOperationParams,
  AdminTestMpesaConnectionResponse,
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

export interface AdminConfigureMpesaVariables {
  params: AdminProviderOperationParams;
  input: AdminConfigureMpesaInput;
}

// =============================================================================
// Operations Hook
// =============================================================================

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
  // Configure M-PESA
  // ---------------------------------------------------------------------------

  const configureMpesa = useMutation({
    mutationFn: ({
      params,
      input,
    }: AdminConfigureMpesaVariables) =>
      adminProvidersApi.configureMpesa(params, input),

    onSuccess: invalidateProviderQueries,
  });

  // ---------------------------------------------------------------------------
  // Test M-PESA Connection
  // ---------------------------------------------------------------------------

  const testMpesaConnection = useMutation<
    AdminTestMpesaConnectionResponse,
    Error,
    AdminProviderOperationParams
  >({
    mutationFn: (params) =>
      adminProvidersApi.testMpesaConnection(params),
  });

  // ---------------------------------------------------------------------------
  // Enable Capability
  // ---------------------------------------------------------------------------

  const enableCapability = useMutation({
    mutationFn: (
      params: AdminProviderCapabilityOperationParams,
    ) => adminProvidersApi.enableCapability(params),

    onSuccess: invalidateProviderQueries,
  });

  // ---------------------------------------------------------------------------
  // Disable Capability
  // ---------------------------------------------------------------------------

  const disableCapability = useMutation({
    mutationFn: (
      params: AdminProviderCapabilityOperationParams,
    ) => adminProvidersApi.disableCapability(params),

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
    configureMpesa,
    testMpesaConnection,
    enableCapability,
    disableCapability,

    isCreating: createProvider.isPending,
    isUpdating: updateProvider.isPending,
    isEnabling: enableProvider.isPending,
    isDisabling: disableProvider.isPending,
    isChangingStatus: changeProviderStatus.isPending,
    isConfiguringMpesa: configureMpesa.isPending,
    isTestingMpesaConnection: testMpesaConnection.isPending,

    isEnablingCapability: enableCapability.isPending,
    isDisablingCapability: disableCapability.isPending,

    isLoading:
      createProvider.isPending ||
      updateProvider.isPending ||
      enableProvider.isPending ||
      disableProvider.isPending ||
      changeProviderStatus.isPending ||
      configureMpesa.isPending ||
      testMpesaConnection.isPending ||
      enableCapability.isPending ||
      disableCapability.isPending,
  };
}
