'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import {
  useAdminBookingCommissions,
} from '@/features/admin/finance/commissions';

import type {
  AdminBookingCommissionPagination,
} from '@/features/admin/finance/commissions';

import type {
  AdminCommissionFiltersModel,
  AdminCreateBookingCommissionModel,
} from '@/features/admin/finance/commissions/models';

import {
  useAdminBookingCommissionOperations,
} from '@/features/admin/finance/commissions/hooks';

import {
  BookingCommissionCreateDialog,
} from '../operations/booking/BookingCommissionCreateDialog';

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

const columns: readonly CommissionTableColumn[] = [
  { key: 'booking', label: 'Booking' },
  { key: 'journey', label: 'Journey' },
  { key: 'percentage', label: 'Rate' },
  { key: 'baseAmount', label: 'Base amount' },
  { key: 'commissionAmount', label: 'Commission' },
  { key: 'status', label: 'Status' },
  { key: 'createdAt', label: 'Created' },
  { key: 'actions', label: 'Actions' },
];

const PAGE_SIZE = 20;

// -----------------------------------------------------------------------------
// Formatting
// -----------------------------------------------------------------------------

function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
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

export function BookingCommissionDirectoryContainer() {
  const router = useRouter();

  // ---------------------------------------------------------------------------
  // Directory State
  // ---------------------------------------------------------------------------

  const [search, setSearch] = useState('');

  const [status, setStatus] =
    useState<CommissionStatusFilterValue>('ALL');

  const [pagination, setPagination] =
    useState<AdminBookingCommissionPagination>({
      page: 1,
      pageSize: PAGE_SIZE,
    });

  // ---------------------------------------------------------------------------
  // Create Dialog State
  // ---------------------------------------------------------------------------

  const [isCreateDialogOpen, setIsCreateDialogOpen] =
    useState(false);

  // ---------------------------------------------------------------------------
  // Filters
  // ---------------------------------------------------------------------------

  const filters = useMemo<AdminCommissionFiltersModel>(
    () => ({
      search,
      type: 'BOOKING',
      ...(status !== 'ALL' ? { status } : {}),
    }),
    [search, status],
  );

  // ---------------------------------------------------------------------------
  // Directory Query
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
  } = useAdminBookingCommissions(
    filters,
    pagination,
    {
      sortBy: 'createdAt',
      sortDirection: 'desc',
    },
  );

  // ---------------------------------------------------------------------------
  // Operations
  // ---------------------------------------------------------------------------

  const {
    createBookingCommissionAsync,
    isCreatingBookingCommission,
    createBookingCommissionError,
    createBookingCommissionMutation,
  } = useAdminBookingCommissionOperations();

  // ---------------------------------------------------------------------------
  // Directory Controls
  // ---------------------------------------------------------------------------

  function changeSearch(value: string) {
    setSearch(value);

    setPagination((current) => ({
      ...current,
      page: 1,
    }));
  }

  function changeStatus(value: CommissionStatusFilterValue) {
    setStatus(value);

    setPagination((current) => ({
      ...current,
      page: 1,
    }));
  }

  function changePage(page: number) {
    setPagination((current) => ({
      ...current,
      page,
    }));
  }

  // ---------------------------------------------------------------------------
  // Create Dialog Controls
  // ---------------------------------------------------------------------------

  function openCreateDialog() {
    createBookingCommissionMutation.reset();
    setIsCreateDialogOpen(true);
  }

  function closeCreateDialog() {
    if (isCreatingBookingCommission) {
      return;
    }

    setIsCreateDialogOpen(false);
  }

  // ---------------------------------------------------------------------------
  // Create Booking Commission
  // ---------------------------------------------------------------------------

  async function handleCreate(
    payload: AdminCreateBookingCommissionModel,
  ): Promise<void> {
    try {
      const createdCommission =
        await createBookingCommissionAsync(payload);

      setIsCreateDialogOpen(false);

      // Open the newly created commission using its returned public ID.
      router.push(
        `/admin/finance/commissions/booking/${encodeURIComponent(
          createdCommission.publicId,
        )}`,
      );
    } catch {
      // React Query retains the mutation error.
      // The create dialog displays it and remains open for retry.
    }
  }

  // ---------------------------------------------------------------------------
  // Operation Feedback
  // ---------------------------------------------------------------------------

  const createError =
    createBookingCommissionError instanceof Error
      ? createBookingCommissionError.message
      : null;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <CommissionPageContainer>
      <div className="space-y-6">

        {/* Page Header */}

        <header className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-[var(--foreground-secondary)]">
                Finance / Commissions
              </p>

              <h1 className="text-2xl font-semibold text-[var(--foreground)]">
                Booking Commissions
              </h1>

              <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                Review and manage commissions generated from bookings.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[var(--background-subtle)] px-3 py-1 text-sm text-[var(--foreground-secondary)]">
                {totalFiltered} records
              </span>

              <button
                type="button"
                onClick={openCreateDialog}
                disabled={isCreatingBookingCommission}
                className="inline-flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Create booking commission
              </button>
            </div>
          </div>
        </header>

        {/* Directory Controls */}

        <section
          aria-label="Commission directory controls"
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="w-full sm:max-w-sm">
            <label
              htmlFor="booking-commission-search"
              className="sr-only"
            >
              Search booking commissions
            </label>

            <input
              id="booking-commission-search"
              type="search"
              value={search}
              onChange={(event) => changeSearch(event.target.value)}
              placeholder="Search booking, journey or commission ID..."
              className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--border-strong)]"
            />
          </div>

          <CommissionFilters
            status={status}
            onStatusChange={changeStatus}
            disabled={isLoading}
          />
        </section>

        {/* Directory Results */}

        {isLoading ? (
          <div
            role="status"
            className="rounded-[var(--radius-lg)] border border-[var(--border)] p-8 text-center text-sm text-[var(--foreground-secondary)]"
          >
            Loading booking commissions...
          </div>
        ) : isError ? (
          <div
            role="alert"
            className="rounded-[var(--radius-lg)] border border-red-300 p-6"
          >
            <p className="font-medium text-red-700">
              Unable to load booking commissions.
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
        ) : commissions.length === 0 ? (
          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] p-10 text-center">
            <h2 className="font-semibold text-[var(--foreground)]">
              No booking commissions found
            </h2>

            <p className="mt-2 text-sm text-[var(--foreground-secondary)]">
              Try changing your search or status filter, or create a new booking commission.
            </p>
          </div>
        ) : (
          <>
            <CommissionTable columns={columns}>
              {commissions.map((commission) => (
                <tr
                  key={commission.publicId}
                  className="hover:bg-[var(--background-subtle)]"
                >
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="font-medium text-[var(--foreground)]">
                      {commission.bookingPublicId}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-[var(--foreground-secondary)]">
                    {commission.journeyPublicId}
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

                  <td className="whitespace-nowrap px-4 py-3 font-medium">
                    {formatAmount(
                      commission.commissionAmount,
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
                      href={`/admin/finance/commissions/booking/${encodeURIComponent(commission.publicId)}`}
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
                  onClick={() => changePage(currentPage - 1)}
                  className="rounded-[var(--radius-md)] border border-[var(--border)] px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>

                <button
                  type="button"
                  disabled={
                    currentPage >= totalPages || isFetching
                  }
                  onClick={() => changePage(currentPage + 1)}
                  className="rounded-[var(--radius-md)] border border-[var(--border)] px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Create Dialog */}

      <BookingCommissionCreateDialog
        open={isCreateDialogOpen}
        loading={isCreatingBookingCommission}
        serverError={createError}
        onClose={closeCreateDialog}
        onSubmit={handleCreate}
      />
    </CommissionPageContainer>
  );
}

export default BookingCommissionDirectoryContainer;