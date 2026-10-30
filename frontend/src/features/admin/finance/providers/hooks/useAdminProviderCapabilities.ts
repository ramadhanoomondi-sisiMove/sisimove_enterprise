
/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Financial Payment Provider Capabilities Hook
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Expose capabilities belonging to a selected provider.
 * - Enable individual provider capabilities.
 * - Disable individual provider capabilities.
 * - Refresh provider data after successful capability operations.
 *
 * Architecture:
 * - Provider data comes from useAdminProvider.
 * - API access remains in the API layer.
 * - TanStack Query manages mutations and cache invalidation.
 * - Capability business rules remain in the backend.
 * -----------------------------------------------------------------------------
 */

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { adminProvidersApi } from '../api';

import type {
  AdminProviderCapability,
  AdminProviderCapabilityOperationParams,
} from '../models';

import { adminProviderKeys } from './useAdminProviders';
import { useAdminProvider } from './useAdminProvider';

// -----------------------------------------------------------------------------
// Capability Operations Hook
// -----------------------------------------------------------------------------

export function useAdminProviderCapabilities(
  providerPublicId: string | undefined,
) {
  const queryClient = useQueryClient();

  const providerQuery = useAdminProvider(providerPublicId);

  // ---------------------------------------------------------------------------
  // Cache Invalidation
  // ---------------------------------------------------------------------------

  const invalidateProviderQueries = async () => {
    await queryClient.invalidateQueries({
      queryKey: adminProviderKeys.all,
    });
  };

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
  // Provider Capabilities
  // ---------------------------------------------------------------------------

  const capabilities: AdminProviderCapability[] =
    providerQuery.provider?.capabilities ?? [];

  // ---------------------------------------------------------------------------
  // Return
  // ---------------------------------------------------------------------------

  return {
    capabilities,
    provider: providerQuery.provider,

    enableCapability,
    disableCapability,

    isEnabling: enableCapability.isPending,
    isDisabling: disableCapability.isPending,

    isLoading: providerQuery.isLoading,
    isFetching: providerQuery.isFetching,
    isError: providerQuery.isError,
    error: providerQuery.error,

    refetch: providerQuery.refetch,
  };
}
