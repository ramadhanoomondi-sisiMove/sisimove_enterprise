
/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Financial Payment Provider Metrics Hook
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Calculate provider totals and status summaries.
 * - Calculate operational and enabled provider counts.
 * - Summarize providers by type, status and environment.
 * - Calculate capability totals and availability summaries.
 *
 * Architecture:
 * - API access remains in the API layer.
 * - TanStack Query manages server data and caching.
 * - Metrics are calculated client-side.
 * - useMemo avoids unnecessary recalculation.
 * -----------------------------------------------------------------------------
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { adminProvidersApi } from '../api';

import type {
  AdminProvider,
  AdminProviderMetrics,
} from '../models';

import { adminProviderKeys } from './useAdminProviders';

// -----------------------------------------------------------------------------
// Metrics Calculation
// -----------------------------------------------------------------------------

export function calculateAdminProviderMetrics(
  providers: AdminProvider[],
): AdminProviderMetrics {
  const metrics: AdminProviderMetrics = {
    totalProviders: providers.length,

    enabledProviders: 0,
    disabledProviders: 0,

    operationalProviders: 0,
    nonOperationalProviders: 0,

    providersByType: {},
    providersByStatus: {},
    providersByEnvironment: {},

    totalCapabilities: 0,
    supportedCapabilities: 0,
    enabledCapabilities: 0,
    usableCapabilities: 0,
  };

  for (const provider of providers) {
    // -------------------------------------------------------------------------
    // Provider Status
    // -------------------------------------------------------------------------

    if (provider.isEnabled) {
      metrics.enabledProviders += 1;
    } else {
      metrics.disabledProviders += 1;
    }

    if (provider.isOperational) {
      metrics.operationalProviders += 1;
    } else {
      metrics.nonOperationalProviders += 1;
    }

    // -------------------------------------------------------------------------
    // Provider Classification
    // -------------------------------------------------------------------------

    metrics.providersByType[provider.type] =
      (metrics.providersByType[provider.type] ?? 0) + 1;

    metrics.providersByStatus[provider.status] =
      (metrics.providersByStatus[provider.status] ?? 0) + 1;

    metrics.providersByEnvironment[provider.environment] =
      (metrics.providersByEnvironment[provider.environment] ?? 0) + 1;

    // -------------------------------------------------------------------------
    // Capability Metrics
    // -------------------------------------------------------------------------

    for (const capability of provider.capabilities) {
      metrics.totalCapabilities += 1;

      if (capability.isSupported) {
        metrics.supportedCapabilities += 1;
      }

      if (capability.isEnabled) {
        metrics.enabledCapabilities += 1;
      }

      if (capability.canBeUsed) {
        metrics.usableCapabilities += 1;
      }
    }
  }

  return metrics;
}

// -----------------------------------------------------------------------------
// Query Hook
// -----------------------------------------------------------------------------

export function useAdminProviderMetrics() {
  const query = useQuery({
    queryKey: adminProviderKeys.list(),
    queryFn: () => adminProvidersApi.list(),
  });

  const providers = useMemo<AdminProvider[]>(
    () => query.data ?? [],
    [query.data],
  );

  const metrics = useMemo(
    () => calculateAdminProviderMetrics(providers),
    [providers],
  );

  return {
    metrics,
    providers,

    query,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
