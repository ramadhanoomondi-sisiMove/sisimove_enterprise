"use client";
/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Financial Payment Provider Filters Hook
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Maintain provider filter state.
 * - Update individual filters.
 * - Replace or reset all filters.
 * - Identify whether any filters are active.
 *
 * Architecture:
 * - Filters remain separate from pagination and sorting.
 * - API requests are handled by the API layer.
 * - Filtering is applied by useAdminProviders.
 * -----------------------------------------------------------------------------
 */

import { useCallback, useMemo, useState } from 'react';

import type { AdminProviderFilters } from '../models';

// -----------------------------------------------------------------------------
// Default Filters
// -----------------------------------------------------------------------------

export const DEFAULT_ADMIN_PROVIDER_FILTERS: AdminProviderFilters = {};

// -----------------------------------------------------------------------------
// Filter Hook
// -----------------------------------------------------------------------------

export function useAdminProviderFilters(
  initialFilters: AdminProviderFilters = DEFAULT_ADMIN_PROVIDER_FILTERS,
) {
  const [filters, setFilters] =
    useState<AdminProviderFilters>(initialFilters);

  // ---------------------------------------------------------------------------
  // Update Individual Filter
  // ---------------------------------------------------------------------------

  const updateFilter = useCallback(
    <K extends keyof AdminProviderFilters>(
      key: K,
      value: AdminProviderFilters[K] | undefined,
    ) => {
      setFilters((current) => {
        const next = { ...current };

        if (value === undefined) {
          delete next[key];
        } else {
          next[key] = value;
        }

        return next;
      });
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Replace All Filters
  // ---------------------------------------------------------------------------

  const replaceFilters = useCallback(
    (nextFilters: AdminProviderFilters) => {
      setFilters(nextFilters);
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Reset Filters
  // ---------------------------------------------------------------------------

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_ADMIN_PROVIDER_FILTERS);
  }, []);

  // ---------------------------------------------------------------------------
  // Active Filter State
  // ---------------------------------------------------------------------------

  const hasActiveFilters = useMemo(
    () => Object.keys(filters).length > 0,
    [filters],
  );

  // ---------------------------------------------------------------------------
  // Return
  // ---------------------------------------------------------------------------

  return {
    filters,
    setFilters,
    updateFilter,
    replaceFilters,
    resetFilters,
    hasActiveFilters,
  };
}
