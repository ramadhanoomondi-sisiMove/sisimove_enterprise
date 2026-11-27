
/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Journey Completion Filters Hook
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Maintain journey completion filter state.
 * - Update individual filters.
 * - Clear all active filters.
 * - Report whether filters are active.
 *
 * Architecture:
 * - Filter state is local UI state.
 * - Backend-supported filters are defined by AdminJourneyCompletionFilters.
 * - No API calls are made directly from this hook.
 * -----------------------------------------------------------------------------
 */

import { useCallback, useMemo, useState } from 'react';

import type {
  AdminJourneyCompletionFilters,
  AdminJourneyCompletionFilterKey,
} from '../models';

import {
  ADMIN_JOURNEY_COMPLETION_DEFAULT_FILTERS,
} from '../models';

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useAdminJourneyCompletionFilters(
  initialFilters: AdminJourneyCompletionFilters = {},
) {
  const [filters, setFilters] =
    useState<AdminJourneyCompletionFilters>(() => ({
      ...ADMIN_JOURNEY_COMPLETION_DEFAULT_FILTERS,
      ...initialFilters,
    }));

  // ---------------------------------------------------------------------------
  // Update All Filters
  // ---------------------------------------------------------------------------

  const updateFilters = useCallback(
    (updates: Partial<AdminJourneyCompletionFilters>) => {
      setFilters((current) => ({
        ...current,
        ...updates,
      }));
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Update One Filter
  // ---------------------------------------------------------------------------

  const updateFilter = useCallback(
    <K extends AdminJourneyCompletionFilterKey>(
      key: K,
      value: AdminJourneyCompletionFilters[K],
    ) => {
      setFilters((current) => ({
        ...current,
        [key]: value,
      }));
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Clear Filters
  // ---------------------------------------------------------------------------

  const clearFilters = useCallback(() => {
    setFilters({
      ...ADMIN_JOURNEY_COMPLETION_DEFAULT_FILTERS,
    });
  }, []);

  // ---------------------------------------------------------------------------
  // Active Filter State
  // ---------------------------------------------------------------------------

  const hasActiveFilters = useMemo(
    () =>
      Object.values(filters).some(
        (value) => value !== undefined && value !== '',
      ),
    [filters],
  );

  return {
    filters,
    setFilters,
    updateFilters,
    updateFilter,
    clearFilters,
    hasActiveFilters,
  };
}
