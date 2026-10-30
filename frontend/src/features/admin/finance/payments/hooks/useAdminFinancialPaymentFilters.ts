
 // -----------------------------------------------------------------------------
 // sisiMove Admin — Financial Payment Filters Hook
 // -----------------------------------------------------------------------------

import { useCallback, useState } from 'react';

import type {
  AdminFinancialPaymentFilters,
} from '../models';

import {
  DEFAULT_ADMIN_FINANCIAL_PAYMENT_FILTERS,
} from '../models';

// -----------------------------------------------------------------------------
// Pagination State
// -----------------------------------------------------------------------------

export interface AdminFinancialPaymentPagination {
  page: number;
  pageSize: number;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useAdminFinancialPaymentFilters(
  initialFilters: AdminFinancialPaymentFilters =
    DEFAULT_ADMIN_FINANCIAL_PAYMENT_FILTERS,
  initialPagination: AdminFinancialPaymentPagination = {
    page: 1,
    pageSize: 20,
  },
) {
  // ---------------------------------------------------------------------------
  // Filter State
  // ---------------------------------------------------------------------------

  const [filters, setFiltersState] =
    useState<AdminFinancialPaymentFilters>(() => ({
      ...DEFAULT_ADMIN_FINANCIAL_PAYMENT_FILTERS,
      ...initialFilters,
      statuses: initialFilters.statuses
        ? [...initialFilters.statuses]
        : [],
    }));

  // ---------------------------------------------------------------------------
  // Pagination State
  // ---------------------------------------------------------------------------

  const [pagination, setPagination] =
    useState<AdminFinancialPaymentPagination>(() => ({
      page: Math.max(1, Math.floor(initialPagination.page)),
      pageSize: Math.max(1, Math.floor(initialPagination.pageSize)),
    }));

  // ---------------------------------------------------------------------------
  // Replace Filters
  // ---------------------------------------------------------------------------

  const setFilters = useCallback(
    (nextFilters: AdminFinancialPaymentFilters) => {
      setFiltersState({
        ...nextFilters,
        statuses: nextFilters.statuses
          ? [...nextFilters.statuses]
          : [],
      });

      setPagination((current) => ({
        ...current,
        page: 1,
      }));
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Update One Filter
  // ---------------------------------------------------------------------------

  const updateFilter = useCallback(
    <K extends keyof AdminFinancialPaymentFilters>(
      key: K,
      value: AdminFinancialPaymentFilters[K],
    ) => {
      setFiltersState((current) => ({
        ...current,
        [key]: value,
        statuses:
          key === 'statuses' && Array.isArray(value)
            ? [...value]
            : current.statuses,
      }));

      setPagination((current) => ({
        ...current,
        page: 1,
      }));
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Set Current Page
  // ---------------------------------------------------------------------------

  const setPage = useCallback((page: number) => {
    setPagination((current) => ({
      ...current,
      page: Math.max(1, Math.floor(page)),
    }));
  }, []);

  // ---------------------------------------------------------------------------
  // Set Page Size
  // ---------------------------------------------------------------------------

  const setPageSize = useCallback((pageSize: number) => {
    setPagination({
      page: 1,
      pageSize: Math.max(1, Math.floor(pageSize)),
    });
  }, []);

  // ---------------------------------------------------------------------------
  // Reset Filters
  // ---------------------------------------------------------------------------

  const resetFilters = useCallback(() => {
    setFiltersState({
      ...DEFAULT_ADMIN_FINANCIAL_PAYMENT_FILTERS,
      statuses: [],
    });

    setPagination((current) => ({
      ...current,
      page: 1,
    }));
  }, []);

  // ---------------------------------------------------------------------------
  // Return
  // ---------------------------------------------------------------------------

  return {
    filters,
    pagination,

    // Convenient pagination accessors
    page: pagination.page,
    pageSize: pagination.pageSize,

    setFilters,
    updateFilter,
    setPage,
    setPageSize,
    resetFilters,
  };
}
