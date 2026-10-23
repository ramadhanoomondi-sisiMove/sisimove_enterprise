
'use client';

/**
 * sisiMove — useJourneyFilters
 *
 * Manages journey directory filter state.
 *
 * Responsibilities:
 * - Track origin, destination, departure date, price range, and status.
 * - Provide handlers to update and reset filters.
 * - Expose a normalized filter object for query construction.
 *
 * Non-responsibilities:
 * - Fetching journeys.
 * - Applying backend business rules.
 * - Modifying API requests directly.
 */

import { useCallback, useMemo, useState } from 'react';

import type { JourneyStatus } from '../models/journey.enums';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyFilters {
  from: string;
  to: string;
  date: string;
  minPrice: string;
  maxPrice: string;
  status: JourneyStatus | '';
}

export type JourneyFilterUpdates = Partial<JourneyFilters>;

// -----------------------------------------------------------------------------
// Defaults
// -----------------------------------------------------------------------------

const DEFAULT_FILTERS: JourneyFilters = {
  from: '',
  to: '',
  date: '',
  minPrice: '',
  maxPrice: '',
  status: '',
};

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useJourneyFilters(initialFilters?: JourneyFilterUpdates) {
  const [filters, setFilters] = useState<JourneyFilters>(() => ({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  }));

  const updateFilter = useCallback(
    <K extends keyof JourneyFilters>(
      key: K,
      value: JourneyFilters[K],
    ) => {
      setFilters((current) => ({
        ...current,
        [key]: value,
      }));
    },
    [],
  );

  const updateFilters = useCallback((updates: JourneyFilterUpdates) => {
    setFilters((current) => ({
      ...current,
      ...updates,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ ...DEFAULT_FILTERS });
  }, []);

  const activeFilterCount = useMemo(
    () =>
      Object.values(filters).filter(
        (value) => value !== '',
      ).length,
    [filters],
  );

  const publicQuery = useMemo(
    () => ({
      from: filters.from.trim() || undefined,
      to: filters.to.trim() || undefined,
      date: filters.date || undefined,
      minPrice:
        filters.minPrice.trim() !== ''
          ? Number(filters.minPrice)
          : undefined,
      maxPrice:
        filters.maxPrice.trim() !== ''
          ? Number(filters.maxPrice)
          : undefined,
    }),
    [filters],
  );

  return {
    filters,
    setFilters,
    updateFilter,
    updateFilters,
    resetFilters,
    activeFilterCount,
    publicQuery,
  };
}

export default useJourneyFilters;
