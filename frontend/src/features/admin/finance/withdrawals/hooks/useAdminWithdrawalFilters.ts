
/**
 * -----------------------------------------------------------------------------
 * SisiMove Admin — Financial Account Withdrawal Filters Hook
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Maintain withdrawal filter state.
 * - Update individual filter fields.
 * - Update multiple filters together.
 * - Reset filters to their defaults.
 *
 * Architecture:
 * - Filter state is local UI state.
 * - Filtering itself is performed by useAdminWithdrawals.
 * -----------------------------------------------------------------------------
 */

import { useCallback, useState } from 'react';

import {
  DEFAULT_ADMIN_WITHDRAWAL_FILTERS,
  type AdminWithdrawalFilters,
  type AdminWithdrawalFilterKey,
} from '../models/admin-withdrawal-filters.model';

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useAdminWithdrawalFilters() {
  const [filters, setFilters] = useState<AdminWithdrawalFilters>({
    ...DEFAULT_ADMIN_WITHDRAWAL_FILTERS,
  });

  const setFilter = useCallback(
    <K extends AdminWithdrawalFilterKey>(
      key: K,
      value: AdminWithdrawalFilters[K],
    ) => {
      setFilters((current) => ({
        ...current,
        [key]: value,
      }));
    },
    [],
  );

  const updateFilters = useCallback(
    (updates: Partial<AdminWithdrawalFilters>) => {
      setFilters((current) => ({
        ...current,
        ...updates,
      }));
    },
    [],
  );

  const resetFilters = useCallback(() => {
    setFilters({
      ...DEFAULT_ADMIN_WITHDRAWAL_FILTERS,
    });
  }, []);

  return {
    filters,
    setFilters,
    setFilter,
    updateFilters,
    resetFilters,
  };
}

export default useAdminWithdrawalFilters;
