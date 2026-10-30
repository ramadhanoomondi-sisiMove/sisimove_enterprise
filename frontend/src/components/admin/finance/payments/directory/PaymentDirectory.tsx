'use client';

// ============================================================
// Financial Payments — Directory
// Responsibility: Compose search, filters, active filter chips,
// payment table, loading/error states, and pagination.
// ============================================================

import { useMemo } from 'react';

import type {
  AdminFinancialPaymentFilters,
  AdminFinancialPaymentPage,
} from '@/features/admin/finance/payments';

import { PaymentDirectoryHeader } from './PaymentDirectoryHeader';
import { PaymentSearch } from './PaymentSearch';
import { PaymentFilters } from './PaymentFilters';
import { PaymentFilterChips } from './PaymentFilterChips';
import { PaymentTable } from './PaymentTable';
import { PaymentTableSkeleton } from './PaymentTableSkeleton';
import { PaymentPagination } from './PaymentPagination';

export interface PaymentDirectoryProps {
  page: AdminFinancialPaymentPage;
  filters: AdminFinancialPaymentFilters;
  onFiltersChange: (filters: AdminFinancialPaymentFilters) => void;
  onPageChange: (page: number) => void;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  className?: string;
}

export function PaymentDirectory({
  page,
  filters,
  onFiltersChange,
  onPageChange,
  loading = false,
  error,
  onRetry,
  className,
}: PaymentDirectoryProps) {
  const activeFilterCount = useMemo(() => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === 'statuses') {
        return Array.isArray(value) && value.length > 0;
      }

      return typeof value === 'string' && value.trim().length > 0;
    }).length;
  }, [filters]);

  function updateFilter<K extends keyof AdminFinancialPaymentFilters>(
    key: K,
    value: AdminFinancialPaymentFilters[K],
  ) {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  }

  function clearFilters() {
    onFiltersChange({});
    onPageChange(1);
  }

  return (
    <section className={className}>
      <PaymentDirectoryHeader totalPayments={page.totalItems} />

      <div className="mt-6 space-y-4">
        <PaymentSearch
          value={filters.search ?? ''}
          onChange={(search) => {
            updateFilter('search', search);
            onPageChange(1);
          }}
          disabled={loading}
        />

        <PaymentFilters
          filters={filters}
          onChange={(nextFilters) => {
            onFiltersChange(nextFilters);
            onPageChange(1);
          }}
          onClear={clearFilters}
          disabled={loading}
        />

        <PaymentFilterChips
          filters={filters}
          onRemove={(key) => {
            const nextFilters = { ...filters };

            if (key === 'statuses') {
              nextFilters.statuses = [];
            } else {
              delete nextFilters[key];
            }

            onFiltersChange(nextFilters);
            onPageChange(1);
          }}
          onClear={clearFilters}
        />

        {error ? (
          <div
            role="alert"
            className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/5 p-4"
          >
            <p className="text-sm text-[var(--danger)]">{error}</p>

            {onRetry ? (
              <button
                type="button"
                onClick={onRetry}
                className="mt-3 text-sm font-semibold text-[var(--foreground)] underline underline-offset-4"
              >
                Try again
              </button>
            ) : null}
          </div>
        ) : loading ? (
          <PaymentTableSkeleton />
        ) : (
          <PaymentTable payments={page.items} />
        )}

        <PaymentPagination
          page={page.page}
          pageSize={page.pageSize}
          totalItems={page.totalItems}
          totalPages={page.totalPages}
          hasPreviousPage={page.hasPreviousPage}
          hasNextPage={page.hasNextPage}
          onPageChange={onPageChange}
          disabled={loading || Boolean(error)}
        />

        {activeFilterCount > 0 ? (
          <p className="text-xs text-[var(--foreground-muted)]">
            {activeFilterCount} active filter
            {activeFilterCount === 1 ? '' : 's'}
          </p>
        ) : null}
      </div>
    </section>
  );
}

export default PaymentDirectory;