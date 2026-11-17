
/**
 * -----------------------------------------------------------------------------
 * SisiMove Admin — Financial Payment Provider Operations Hook
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Create financial payment providers.
 * - Update provider details.
 * - Enable and disable providers.
 * - Change provider integration status.
 * - Configure M-PESA Daraja credentials.
 * - Test M-PESA Daraja OAuth authentication.
 * - Enable and disable provider capabilities.
 * - Invalidate provider queries after successful state-changing operations.
 *
 * M-PESA scope:
 *
 * TOP-UP:
 * - STK Push.
 * - C2B PayBill / Buy Goods.
 *
 * WITHDRAWAL:
 * - B2C withdrawal of customer available funds.
 *
 * Architecture:
 * - API access remains in the API layer.
 * - TanStack Query manages mutations and cache invalidation.
 * - Backend owns business rules and financial consequences.
 * - This hook never handles credentials directly beyond forwarding
 *   the configuration request to the API layer.
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
  AdminConfigureMpesaResponse,
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

  const invalidateProviderQueries = async (): Promise<void> => {
    await queryClient.invalidateQueries({
      queryKey: adminProviderKeys.all,
    });
  };

  // ---------------------------------------------------------------------------
  // Create Provider
  // ---------------------------------------------------------------------------

  const createProvider = useMutation<
    Awaited<ReturnType<typeof adminProvidersApi.create>>,
    Error,
    AdminCreateProviderInput
  >({
    mutationFn: (input) => adminProvidersApi.create(input),
    onSuccess: invalidateProviderQueries,
  });

  // ---------------------------------------------------------------------------
  // Update Provider
  // ---------------------------------------------------------------------------

  const updateProvider = useMutation<
    Awaited<ReturnType<typeof adminProvidersApi.update>>,
    Error,
    AdminUpdateProviderVariables
  >({
    mutationFn: ({ params, input }) =>
      adminProvidersApi.update(params, input),

    onSuccess: invalidateProviderQueries,
  });

  // ---------------------------------------------------------------------------
  // Enable Provider
  // ---------------------------------------------------------------------------

  const enableProvider = useMutation<
    Awaited<ReturnType<typeof adminProvidersApi.enable>>,
    Error,
    AdminProviderOperationParams
  >({
    mutationFn: (params) =>
      adminProvidersApi.enable(params),

    onSuccess: invalidateProviderQueries,
  });

  // ---------------------------------------------------------------------------
  // Disable Provider
  // ---------------------------------------------------------------------------

  const disableProvider = useMutation<
    Awaited<ReturnType<typeof adminProvidersApi.disable>>,
    Error,
    AdminProviderOperationParams
  >({
    mutationFn: (params) =>
      adminProvidersApi.disable(params),

    onSuccess: invalidateProviderQueries,
  });

  // ---------------------------------------------------------------------------
  // Change Provider Status
  // ---------------------------------------------------------------------------

  const changeProviderStatus = useMutation<
    Awaited<ReturnType<typeof adminProvidersApi.changeStatus>>,
    Error,
    AdminChangeProviderStatusVariables
  >({
    mutationFn: ({ params, input }) =>
      adminProvidersApi.changeStatus(params, input),

    onSuccess: invalidateProviderQueries,
  });

  // ===========================================================================
  // M-PESA Operations
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Configure M-PESA
  // ---------------------------------------------------------------------------

  /**
   * Configure Daraja credentials.
   *
   * Supports:
   *
   * TOP-UP:
   * - STK Push.
   * - C2B PayBill / Buy Goods.
   *
   * WITHDRAWAL:
   * - B2C available-funds withdrawal.
   *
   * The backend validates configuration completeness and encrypts credentials.
   */
  const configureMpesa = useMutation<
    AdminConfigureMpesaResponse,
    Error,
    AdminConfigureMpesaVariables
  >({
    mutationFn: ({ params, input }) =>
      adminProvidersApi.configureMpesa(params, input),

    onSuccess: invalidateProviderQueries,
  });

  // ---------------------------------------------------------------------------
  // Test M-PESA Connection
  // ---------------------------------------------------------------------------

  /**
   * Test Daraja OAuth authentication.
   *
   * This is a connectivity test, not a financial transaction.
   * It does not authorize top-ups or withdrawals.
   */
  const testMpesaConnection = useMutation<
    AdminTestMpesaConnectionResponse,
    Error,
    AdminProviderOperationParams
  >({
    mutationFn: (params) =>
      adminProvidersApi.testMpesaConnection(params),
  });

  // ===========================================================================
  // Provider Capability Operations
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Enable Capability
  // ---------------------------------------------------------------------------

  const enableCapability = useMutation<
    Awaited<ReturnType<typeof adminProvidersApi.enableCapability>>,
    Error,
    AdminProviderCapabilityOperationParams
  >({
    mutationFn: (params) =>
      adminProvidersApi.enableCapability(params),

    onSuccess: invalidateProviderQueries,
  });

  // ---------------------------------------------------------------------------
  // Disable Capability
  // ---------------------------------------------------------------------------

  const disableCapability = useMutation<
    Awaited<ReturnType<typeof adminProvidersApi.disableCapability>>,
    Error,
    AdminProviderCapabilityOperationParams
  >({
    mutationFn: (params) =>
      adminProvidersApi.disableCapability(params),

    onSuccess: invalidateProviderQueries,
  });

  // ===========================================================================
  // Return
  // ===========================================================================

  return {
    // Provider operations
    createProvider,
    updateProvider,
    enableProvider,
    disableProvider,
    changeProviderStatus,

    // M-PESA operations
    configureMpesa,
    testMpesaConnection,

    // Capability operations
    enableCapability,
    disableCapability,

    // Individual loading states
    isCreating: createProvider.isPending,
    isUpdating: updateProvider.isPending,
    isEnabling: enableProvider.isPending,
    isDisabling: disableProvider.isPending,
    isChangingStatus: changeProviderStatus.isPending,

    isConfiguringMpesa: configureMpesa.isPending,
    isTestingMpesaConnection: testMpesaConnection.isPending,

    isEnablingCapability: enableCapability.isPending,
    isDisablingCapability: disableCapability.isPending,

    // Mutation errors
    createProviderError: createProvider.error,
    updateProviderError: updateProvider.error,
    configureMpesaError: configureMpesa.error,
    testMpesaConnectionError: testMpesaConnection.error,

    // Mutation results
    configureMpesaResult: configureMpesa.data,
    mpesaConnectionResult: testMpesaConnection.data,

    // Aggregate loading state
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
