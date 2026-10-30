
 // -----------------------------------------------------------------------------
 // sisiMove Admin — Payment Method Filters Hook
 // -----------------------------------------------------------------------------

import { useCallback, useMemo, useState } from 'react';

import type { AdminPaymentMethod } from '../models';

import type {
  AdminPaymentMethodFilters,
} from './useAdminPaymentMethods';

// -----------------------------------------------------------------------------
// Defaults
// -----------------------------------------------------------------------------

const DEFAULT_FILTERS: AdminPaymentMethodFilters = {
  search: '',
  accountPublicId: '',
  providers: [],
  types: [],
  activeState: 'all',
  defaultState: 'all',
};

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useAdminPaymentMethodFilters(
  paymentMethods: readonly AdminPaymentMethod[],
) {
  const [filters, setFilters] =
    useState<AdminPaymentMethodFilters>(DEFAULT_FILTERS);

  const updateFilters = useCallback(
    (updates: Partial<AdminPaymentMethodFilters>) => {
      setFilters((current) => ({
        ...current,
        ...updates,
      }));
    },
    [],
  );

  const resetFilters = useCallback(() => {
    setFilters({ ...DEFAULT_FILTERS });
  }, []);

  const providers = useMemo(
    () =>
      [...new Set(paymentMethods.map((method) => method.provider))]
        .sort((a, b) => a.localeCompare(b)),
    [paymentMethods],
  );

  const types = useMemo(
    () =>
      [...new Set(paymentMethods.map((method) => method.type))]
        .sort((a, b) => a.localeCompare(b)),
    [paymentMethods],
  );

  const hasActiveFilters =
    Boolean(filters.search?.trim()) ||
    Boolean(filters.accountPublicId?.trim()) ||
    Boolean(filters.providers?.length) ||
    Boolean(filters.types?.length) ||
    filters.activeState !== 'all' ||
    filters.defaultState !== 'all';

  return {
    filters,
    updateFilters,
    resetFilters,
    providers,
    types,
    hasActiveFilters,
  };
}

export default useAdminPaymentMethodFilters;
