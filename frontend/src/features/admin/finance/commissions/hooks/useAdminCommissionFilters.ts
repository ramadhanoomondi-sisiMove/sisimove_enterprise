
/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Commission Filters Hook
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Own commission listing filter state.
 * - Update individual commission filters.
 * - Replace the complete filter configuration.
 * - Reset all filters to their default state.
 * - Expose whether any filters are currently active.
 *
 * Architecture:
 * - Filter state remains local to the frontend.
 * - Filter definitions reuse AdminCommissionFiltersModel.
 * - Filtering is applied by the relevant commission query hooks.
 * - This hook does not perform API requests.
 * -----------------------------------------------------------------------------
 */

import {
  useCallback,
  useMemo,
  useState,
} from 'react';

import type {
  AdminCommissionFiltersModel,
} from '../models';

// -----------------------------------------------------------------------------
// Filter Field Types
// -----------------------------------------------------------------------------

export type AdminCommissionFilterField =
  keyof AdminCommissionFiltersModel;

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useAdminCommissionFilters(
  initialFilters: AdminCommissionFiltersModel = {},
) {
  const [filters, setFilters] =
    useState<AdminCommissionFiltersModel>(initialFilters);

  // ---------------------------------------------------------------------------
  // Update Individual Filter
  // ---------------------------------------------------------------------------

  const updateFilter = useCallback(
    <K extends AdminCommissionFilterField>(
      field: K,
      value: AdminCommissionFiltersModel[K],
    ): void => {
      setFilters((current) => ({
        ...current,
        [field]: value,
      }));
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Replace All Filters
  // ---------------------------------------------------------------------------

  const updateFilters = useCallback(
    (nextFilters: AdminCommissionFiltersModel): void => {
      setFilters(nextFilters);
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Clear Individual Filter
  // ---------------------------------------------------------------------------

  const clearFilter = useCallback(
    (field: AdminCommissionFilterField): void => {
      setFilters((current) => ({
        ...current,
        [field]: undefined,
      }));
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Reset All Filters
  // ---------------------------------------------------------------------------

  const resetFilters = useCallback((): void => {
    setFilters({});
  }, []);

  // ---------------------------------------------------------------------------
  // Active Filter State
  // ---------------------------------------------------------------------------

  const hasActiveFilters = useMemo(
    () =>
      Object.values(filters).some((value) => {
        if (value === undefined || value === null) {
          return false;
        }

        if (typeof value === 'string') {
          return value.trim().length > 0;
        }

        return true;
      }),
    [filters],
  );

  // ---------------------------------------------------------------------------
  // Return
  // ---------------------------------------------------------------------------

  return {
    filters,

    setFilters,
    updateFilter,
    updateFilters,
    clearFilter,
    resetFilters,

    hasActiveFilters,
  };
}
