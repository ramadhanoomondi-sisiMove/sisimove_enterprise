'use client';

// -----------------------------------------------------------------------------
// sisiMove Admin — Earning Commission Directory Container
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Fetch and display earning commissions.
// - Own search, status filter and pagination state.
// - Delegate filtering, sorting and pagination to the query hook.
// - Link each commission to its details route.
//
// Architecture:
// - API access remains in the feature API layer.
// - Query hook owns data fetching and client-side data processing.
// - Backend remains authoritative for commission operations.
// -----------------------------------------------------------------------------

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { useAdminEarningCommissions } from '@/features/admin/finance/commissions/hooks';
import type {
  AdminEarningCommissionPagination,
  AdminEarningCommissionSort,
} from '@/features/admin/finance/commissions/hooks/useAdminEarningCommissions';
import type {
  AdminCommissionFiltersModel,
} from '@/features/admin/finance/commissions/models';

import { CommissionPageContainer } from '../layout/CommissionPageContainer';
import {
  CommissionFilters,
  type CommissionStatusFilterValue,
} from '../directory/CommissionFilters';
import {
  CommissionTable,
  type CommissionTableColumn,
} from '../directory/CommissionTable';

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

const PAGE_SIZE = 20;

const columns: readonly CommissionTableColumn[] = [
  { key: 'provider', label: 'Provider' },
  { key: 'journey', label: 'Journey' },
  { key: 'settlement', label: 'Settlement' },
  { key: 'percentage', label: 'Rate' },
  { key: 'baseAmount', label: 'Base amount' },
  { key: 'commissionAmount', label: 'Commission' },
  { key: 'netAmount', label: 'Net amount' },
  { key: 'status', label: 'Status' },
  { key: 'createdAt', label: 'Created' },
  { key: 'actions', label: 'Actions' },
];

// -----------------------------------------------------------------------------
// Formatting
// -----------------------------------------------------------------------------

function formatAmount(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
  }).format(date);
}

function getStatusClassName(status: string): string {
  switch (status) {
    case 'ASSESSED':
      return 'bg-emerald-100 text-emerald-800';

    case 'CANCELLED':
      return 'bg-red-100 text-red-800';

    default:
      return 'bg-amber-100 text-amber-800';
  }
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function EarningCommissionDirectoryContainer() {
  // ---------------------------------------------------------------------------
  // Search and Filters
  // ---------------------------------------------------------------------------

  const [search, setSearch] = useState('');

  const [status, setStatus] =
    useState<CommissionStatusFilterValue>('ALL');

  // ---------------------------------------------------------------------------
  // Pagination
  // ---------------------------------------------------------------------------

  const [pagination, setPagination] =
    useState<AdminEarningCommissionPagination>({
      page: 1,
      pageSize: PAGE_SIZE,
    });

  // ---------------------------------------------------------------------------
  // Query Parameters
  // ---------------------------------------------------------------------------

  const filters = useMemo<AdminCommissionFiltersModel>(
    () => ({
      search,
      type: 'EARNING',
      ...(status !== 'ALL' ? { status } : {}),
    }),
    [search, status],
  );

  const sort = useMemo<AdminEarningCommissionSort>(
    () => ({
      sortBy: 'createdAt',
      sortDirection: 'desc',
    }),
    [],
  );

  // ---------------------------------------------------------------------------
  // Query
  // ---------------------------------------------------------------------------

  const {
    commissions,
    totalFiltered,
    totalPages,
    currentPage,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useAdminEarningCommissions(
    filters,
    pagination,
    sort,
  );

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  function handleSearchChange(value: string) {
    setSearch(value);

    setPagination((current) => ({
      ...current,
      page: 1,
    }));
  }

  function handleStatusChange(
    value: CommissionStatusFilterValue,
  ) {
    setStatus(value);

    setPagination((current) => ({
      ...current,
      page: 1,
    }));
  }

  function handlePageChange(page: number) {
    setPagination((current) => ({
      ...current,
      page,
    }));
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <CommissionPageContainer>
      <div className="space-y-6">
        {/* Page Header */}

        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-[var(--foreground-secondary)]">
              Finance / Commissions
            </p>

            <h1 className="text-2xl font-semibold text-[var(--foreground)]">
              Earning Commissions
            </h1>

            <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
              Review provider earning commissions and their financial records.
            </p>
          </div>

          <span className="rounded-full bg-[var(--background-subtle)] px-3 py-1 text-sm text-[var(--foreground-secondary)]">
            {totalFiltered} records
          </span>
        </header>

        {/* Search and Filters */}

        <section
          aria-label="Earning commission directory controls"
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="w-full sm:max-w-sm">
            <label
              htmlFor="earning-commission-search"
              className="sr-only"
            >
              Search earning commissions
            </label>

            <input
              id="earning-commission-search"
              type="search"
              value={search}
              onChange={(event) =>
                handleSearchChange(event.target.value)
              }
              placeholder="Search provider, journey or commission ID..."
              className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--border-strong)]"
            />
          </div>

          <CommissionFilters
            status={status}
            onStatusChange={handleStatusChange}
            disabled={isLoading}
          />
        </section>

        {/* Loading State */}

        {isLoading && (
          <div
            role="status"
            className="rounded-[var(--radius-lg)] border border-[var(--border)] p-8 text-center text-sm text-[var(--foreground-secondary)]"
          >
            Loading earning commissions...
          </div>
        )}

        {/* Error State */}

        {!isLoading && isError && (
          <div
            role="alert"
            className="rounded-[var(--radius-lg)] border border-red-300 p-6"
          >
            <p className="font-medium text-red-700">
              Unable to load earning commissions.
            </p>

            <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
              {error instanceof Error
                ? error.message
                : 'An unexpected error occurred.'}
            </p>

            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-3 rounded-[var(--radius-md)] border border-[var(--border)] px-3 py-2 text-sm font-medium"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty State */}

        {!isLoading && !isError && commissions.length === 0 && (
          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] p-10 text-center">
            <h2 className="font-semibold text-[var(--foreground)]">
              No earning commissions found
            </h2>

            <p className="mt-2 text-sm text-[var(--foreground-secondary)]">
              Try changing your search or status filter.
            </p>
          </div>
        )}

        {/* Commission Table */}

        {!isLoading && !isError && commissions.length > 0 && (
          <>
            <CommissionTable columns={columns}>
              {commissions.map((commission) => (
                <tr
                  key={commission.publicId}
                  className="hover:bg-[var(--background-subtle)]"
                >
                  <td className="whitespace-nowrap px-4 py-3 font-medium">
                    {commission.providerPublicId}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-[var(--foreground-secondary)]">
                    {commission.journeyPublicId}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-[var(--foreground-secondary)]">
                    {commission.settlementPublicId}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3">
                    {commission.percentage}%
                  </td>

                  <td className="whitespace-nowrap px-4 py-3">
                    {formatAmount(
                      commission.baseAmount,
                      commission.currency,
                    )}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3">
                    {formatAmount(
                      commission.commissionAmount,
                      commission.currency,
                    )}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 font-medium">
                    {formatAmount(
                      commission.netAmount,
                      commission.currency,
                    )}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3">
                    <span
                      className={[
                        'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
                        getStatusClassName(commission.status),
                      ].join(' ')}
                    >
                      {commission.status}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-[var(--foreground-secondary)]">
                    {formatDate(commission.createdAt)}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3">
                    <Link
                      href={`/admin/finance/commissions/earning/${encodeURIComponent(commission.publicId)}`}
                      className="font-medium text-[var(--primary)] hover:underline"
                    >
                      View details
                    </Link>
                  </td>
                </tr>
              ))}
            </CommissionTable>

            {/* Pagination */}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-[var(--foreground-secondary)]">
                Page {currentPage} of {totalPages} · {totalFiltered} records
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage <= 1 || isFetching}
                  onClick={() =>
                    handlePageChange(currentPage - 1)
                  }
                  className="rounded-[var(--radius-md)] border border-[var(--border)] px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>

                <button
                  type="button"
                  disabled={
                    currentPage >= totalPages || isFetching
                  }
                  onClick={() =>
                    handlePageChange(currentPage + 1)
                  }
                  className="rounded-[var(--radius-md)] border border-[var(--border)] px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </CommissionPageContainer>
  );
}

export default EarningCommissionDirectoryContainer;