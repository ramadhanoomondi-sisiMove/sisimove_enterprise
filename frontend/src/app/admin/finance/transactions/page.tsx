
'use client';

// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Transactions Page
// -----------------------------------------------------------------------------
//
// Platform finance control center composing:
// - Finance operations header and toolbar
// - Platform-wide transaction metrics
// - Searchable, filterable, sortable, paginated transaction directory
//
// Monetary volume remains grouped by currency.
// Detail navigation uses the canonical finance transaction route and public ID.
// -----------------------------------------------------------------------------

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { ADMIN_ROUTES } from '@/foundation/routing/admin-routes';

import {
  DEFAULT_ADMIN_FINANCIAL_TRANSACTION_FILTERS,
} from '@/features/admin/finance/transactions/models';

import type {
  AdminFinancialTransactionFilters,
} from '@/features/admin/finance/transactions/models';

import {
  useAdminFinancialTransactions,
  useAdminFinancialTransactionMetrics,
} from '@/features/admin/finance/transactions/hooks';

import { TransactionPageContainer } from '@/components/admin/finance/transactions/layout/TransactionPageContainer';
import { TransactionPageToolbar } from '@/components/admin/finance/transactions/layout/TransactionPageToolbar';
import { TransactionControlCenterHeader } from '@/components/admin/finance/transactions/layout/TransactionControlCenterHeader';

import { TransactionOverview } from '@/components/admin/finance/transactions/overview/TransactionOverview';
import { TransactionDirectory } from '@/components/admin/finance/transactions/directory';

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function FinancialTransactionsPage() {
  const router = useRouter();

  const [filters, setFilters] = useState<AdminFinancialTransactionFilters>(
    () => ({ ...DEFAULT_ADMIN_FINANCIAL_TRANSACTION_FILTERS }),
  );

  const {
    transactions,
    allTransactions,
    totalFiltered,
    query,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminFinancialTransactions(filters);

  const {
    metrics,
    isLoading: isMetricsLoading,
    isError: isMetricsError,
  } = useAdminFinancialTransactionMetrics();

  // ---------------------------------------------------------------------------
  // Derived data
  // ---------------------------------------------------------------------------

  const currencies = useMemo(
    () =>
      [
        ...new Set(
          allTransactions
            .map((transaction) => transaction.currency?.toUpperCase())
            .filter((currency): currency is string => Boolean(currency)),
        ),
      ].sort(),
    [allTransactions],
  );

  // ---------------------------------------------------------------------------
  // Navigation and actions
  // ---------------------------------------------------------------------------

  const handleOpenTransaction = useCallback(
    (publicId: string) => {
      router.push(ADMIN_ROUTES.FINANCE_TRANSACTION(publicId));
    },
    [router],
  );

  const handleRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  // TransactionDirectory emits the complete filters object.
  const handleFiltersChange = useCallback(
    (nextFilters: AdminFinancialTransactionFilters) => {
      setFilters(nextFilters);
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <TransactionPageContainer size="2xl">
      <div className="space-y-6">
        <TransactionControlCenterHeader
          title="Financial transactions"
          description="Monitor transaction activity, investigate exceptions, and review financial operations across the platform."
          actions={
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isLoading || query.isFetching}
              className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--background-muted)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {query.isFetching ? 'Refreshing…' : 'Refresh transactions'}
            </button>
          }
        />

        <TransactionPageToolbar
          title="Transaction directory"
          description="Search transactions, narrow results with filters, and open a transaction to inspect its details."
          leadingContent={
            <p
              className="mt-2 text-sm text-[var(--foreground-secondary)]"
              aria-live="polite"
            >
              {isLoading
                ? 'Loading financial transactions…'
                : isError
                  ? 'Financial transactions could not be loaded'
                  : `${allTransactions.length.toLocaleString('en-KE')} transaction${
                      allTransactions.length === 1 ? '' : 's'
                    } loaded · ${totalFiltered.toLocaleString('en-KE')} matching filters`}
            </p>
          }
        />

        {metrics ? (
          <TransactionOverview metrics={metrics} />
        ) : isMetricsLoading ? (
          <section
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
            aria-live="polite"
          >
            <p className="text-sm text-[var(--foreground-muted)]">
              Loading transaction overview…
            </p>
          </section>
        ) : isMetricsError ? (
          <section
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
            role="status"
          >
            <p className="text-sm text-[var(--foreground-muted)]">
              Transaction overview metrics are temporarily unavailable. The directory can still be used.
            </p>
          </section>
        ) : null}

        <TransactionDirectory
          transactions={transactions}
          filters={filters}
          totalItems={totalFiltered}
          onFiltersChange={handleFiltersChange}
          onViewTransaction={(transaction) =>
            handleOpenTransaction(transaction.publicId)
          }
          currencies={currencies}
          isLoading={isLoading}
          error={isError ? error : undefined}
          onRetry={handleRefresh}
          detailHref={(publicId) =>
            ADMIN_ROUTES.FINANCE_TRANSACTION(publicId)
          }
          containerSize="2xl"
        />
      </div>
    </TransactionPageContainer>
  );
}
