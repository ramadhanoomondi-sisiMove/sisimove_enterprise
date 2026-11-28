
'use client';

// -----------------------------------------------------------------------------
// sisiMove Admin — Commission Directory
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Load booking and earning commissions.
// - Combine both commission types into one directory.
// - Own directory search, status, type and date filters.
// - Apply client-side sorting and pagination.
// - Render commission records using shared commission components.
// - Coordinate earning commission creation.
// - Delegate data fetching and caching to query hooks.
//
// -----------------------------------------------------------------------------

import {
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  Button,
} from '@/components/ui';

import {
  useAdminBookingCommissions,
  useAdminCommissionFilters,
  useAdminEarningCommissions,
  useAdminEarningCommissionOperations,
} from '@/features/admin/finance/commissions/hooks';

import type {
  AdminBookingCommissionModel,
  AdminCommissionFiltersModel,
  AdminCreateEarningCommissionModel,
  AdminEarningCommissionModel,
} from '@/features/admin/finance/commissions/models';

import {
  CommissionAmount,
  CommissionBookingLink,
  CommissionDate,
  CommissionEmptyState,
  CommissionErrorState,
  CommissionJourneyLink,
  CommissionProviderLink,
  CommissionPublicId,
  CommissionRuleLink,
  CommissionStatusBadge,
  CommissionTypeBadge,
} from '../shared';

import { CommissionDirectoryHeader } from './CommissionDirectoryHeader';
import { CommissionSearch } from './CommissionSearch';
import {
  CommissionFilters,
} from './CommissionFilters';
import type {
  CommissionStatusFilterValue,
} from './CommissionFilters';
import { CommissionFilterChips } from './CommissionFilterChips';
import { CommissionTable } from './CommissionTable';
import { CommissionTableRow } from './CommissionTableRow';
import { CommissionTableSkeleton } from './CommissionTableSkeleton';
import { CommissionPagination } from './CommissionPagination';
import { CommissionTypeTabs } from './CommissionTypeTabs';

import type {
  CommissionActiveFilter,
} from './CommissionFilterChips';

import type {
  CommissionDirectoryType,
} from './CommissionTypeTabs';

import {
  EarningCommissionCreateDialog,
} from '../operations/earning';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type CommissionDirectoryRecord =
  | {
      readonly type: 'BOOKING';
      readonly commission: AdminBookingCommissionModel;
    }
  | {
      readonly type: 'EARNING';
      readonly commission: AdminEarningCommissionModel;
    };

export interface CommissionDirectoryProps {
  readonly pageSize?: number;
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const DEFAULT_PAGE_SIZE = 20;

const TABLE_COLUMNS = [
  {
    key: 'commission',
    label: 'Commission',
  },
  {
    key: 'type',
    label: 'Type',
  },
  {
    key: 'related',
    label: 'Related Record',
  },
  {
    key: 'rule',
    label: 'Commission Rule',
  },
  {
    key: 'amount',
    label: 'Amount',
  },
  {
    key: 'status',
    label: 'Status',
  },
  {
    key: 'createdAt',
    label: 'Created',
  },
] as const;

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function toTimestamp(
  value: string | Date | null | undefined,
): number {
  if (!value) {
    return 0;
  }

  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

/**
 * Converts a date-only filter into a timestamp.
 *
 * The upper date boundary is moved to the end of that day so records
 * created later on the selected end date are included.
 */
function getDateBoundary(
  value: string | Date | null | undefined,
  endOfDay = false,
): number | undefined {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  if (endOfDay) {
    date.setHours(23, 59, 59, 999);
  } else {
    date.setHours(0, 0, 0, 0);
  }

  return date.getTime();
}

function getSearchableValues(
  record: CommissionDirectoryRecord,
): string[] {
  if (record.type === 'BOOKING') {
    const commission = record.commission;

    return [
      commission.publicId,
      commission.commissionRulePublicId,
      commission.currency,
      commission.bookingPublicId,
      commission.journeyPublicId,
    ];
  }

  const commission = record.commission;

  return [
    commission.publicId,
    commission.commissionRulePublicId,
    commission.currency,
    commission.journeyPublicId,
    commission.settlementPublicId,
    commission.providerPublicId,
  ];
}

function getActiveFilters(
  filters: AdminCommissionFiltersModel,
  type: CommissionDirectoryType,
): CommissionActiveFilter[] {
  const activeFilters: CommissionActiveFilter[] = [];

  if (filters.search?.trim()) {
    activeFilters.push({
      key: 'search',
      label: 'Search',
      value: filters.search,
    });
  }

  if (filters.status) {
    activeFilters.push({
      key: 'status',
      label: 'Status',
      value: filters.status,
    });
  }

  if (filters.createdFrom) {
    activeFilters.push({
      key: 'createdFrom',
      label: 'From',
      value: filters.createdFrom,
    });
  }

  if (filters.createdTo) {
    activeFilters.push({
      key: 'createdTo',
      label: 'To',
      value: filters.createdTo,
    });
  }

  if (type !== 'ALL') {
    activeFilters.push({
      key: 'type',
      label: 'Type',
      value: type,
    });
  }

  return activeFilters;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Unable to create the earning commission. Please try again.';
}

// -----------------------------------------------------------------------------
// Commission Directory
// -----------------------------------------------------------------------------

export function CommissionDirectory({
  pageSize = DEFAULT_PAGE_SIZE,
  className,
}: CommissionDirectoryProps) {
  // ---------------------------------------------------------------------------
  // Filter state
  // ---------------------------------------------------------------------------

  const {
    filters,
    updateFilter,
    clearFilter,
    resetFilters,
  } = useAdminCommissionFilters();

  const [type, setType] =
    useState<CommissionDirectoryType>('ALL');

  const [page, setPage] = useState(1);

  // ---------------------------------------------------------------------------
  // Earning commission creation state
  // ---------------------------------------------------------------------------

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [createOperationError, setCreateOperationError] =
    useState<string | null>(null);

  const {
    createEarningCommissionAsync,
    isCreatingEarningCommission,
  } = useAdminEarningCommissionOperations();

  // ---------------------------------------------------------------------------
  // Booking commission query
  // ---------------------------------------------------------------------------

  const {
    allCommissions: bookingCommissions,
    isLoading: isBookingLoading,
    isError: isBookingError,
    refetch: refetchBooking,
  } = useAdminBookingCommissions(
    {},
    {
      page: 1,
      pageSize: 1,
    },
  );

  // ---------------------------------------------------------------------------
  // Earning commission query
  // ---------------------------------------------------------------------------

  const {
    allCommissions: earningCommissions,
    isLoading: isEarningLoading,
    isError: isEarningError,
    refetch: refetchEarning,
  } = useAdminEarningCommissions(
    {},
    {
      page: 1,
      pageSize: 1,
    },
  );

  // ---------------------------------------------------------------------------
  // Query states
  // ---------------------------------------------------------------------------

  const isLoading =
    isBookingLoading ||
    isEarningLoading;

  const isError =
    isBookingError ||
    isEarningError;

  const handleRetry = useCallback(() => {
    void refetchBooking();
    void refetchEarning();
  }, [
    refetchBooking,
    refetchEarning,
  ]);

  // ---------------------------------------------------------------------------
  // Earning commission creation
  // ---------------------------------------------------------------------------

  const handleOpenCreateDialog = useCallback(() => {
    setCreateOperationError(null);
    setIsCreateDialogOpen(true);
  }, []);

  const handleCloseCreateDialog = useCallback(() => {
    if (isCreatingEarningCommission) {
      return;
    }

    setIsCreateDialogOpen(false);
    setCreateOperationError(null);
  }, [isCreatingEarningCommission]);

  const handleCreateEarningCommission = useCallback(
    async (payload: AdminCreateEarningCommissionModel) => {
      if (isCreatingEarningCommission) {
        return;
      }

      setCreateOperationError(null);

      try {
        await createEarningCommissionAsync(payload);

        setIsCreateDialogOpen(false);
      } catch (error) {
        setCreateOperationError(getErrorMessage(error));
      }
    },
    [
      createEarningCommissionAsync,
      isCreatingEarningCommission,
    ],
  );

  // ---------------------------------------------------------------------------
  // Combine booking and earning commissions
  // ---------------------------------------------------------------------------

  const allCommissions = useMemo<CommissionDirectoryRecord[]>(() => {
    const bookingRecords: CommissionDirectoryRecord[] =
      bookingCommissions.map((commission) => ({
        type: 'BOOKING',
        commission,
      }));

    const earningRecords: CommissionDirectoryRecord[] =
      earningCommissions.map((commission) => ({
        type: 'EARNING',
        commission,
      }));

    if (type === 'BOOKING') {
      return bookingRecords;
    }

    if (type === 'EARNING') {
      return earningRecords;
    }

    return [
      ...bookingRecords,
      ...earningRecords,
    ];
  }, [
    bookingCommissions,
    earningCommissions,
    type,
  ]);

  // ---------------------------------------------------------------------------
  // Apply search, status and date filters
  // ---------------------------------------------------------------------------

  const status: CommissionStatusFilterValue =
    filters.status ?? 'ALL';

  const filteredCommissions = useMemo(() => {
    const search =
      filters.search?.trim().toLowerCase() ?? '';

    const createdFrom = getDateBoundary(
      filters.createdFrom,
    );

    const createdTo = getDateBoundary(
      filters.createdTo,
      true,
    );

    return allCommissions
      .filter((record) => {
        const commission = record.commission;

        // Search
        if (search) {
          const matchesSearch = getSearchableValues(record).some(
            (value) =>
              value.toLowerCase().includes(search),
          );

          if (!matchesSearch) {
            return false;
          }
        }

        // Status
        if (
          status !== 'ALL' &&
          commission.status !== status
        ) {
          return false;
        }

        // Created date
        const createdAt = toTimestamp(
          commission.createdAt,
        );

        if (
          createdFrom !== undefined &&
          createdAt < createdFrom
        ) {
          return false;
        }

        if (
          createdTo !== undefined &&
          createdAt > createdTo
        ) {
          return false;
        }

        return true;
      })
      .sort(
        (a, b) =>
          toTimestamp(b.commission.createdAt) -
          toTimestamp(a.commission.createdAt),
      );
  }, [
    allCommissions,
    filters.search,
    filters.createdFrom,
    filters.createdTo,
    status,
  ]);

  // ---------------------------------------------------------------------------
  // Pagination
  // ---------------------------------------------------------------------------

  const totalFiltered = filteredCommissions.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalFiltered / pageSize),
  );

  const currentPage = Math.min(
    Math.max(page, 1),
    totalPages,
  );

  const paginatedCommissions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;

    return filteredCommissions.slice(
      start,
      start + pageSize,
    );
  }, [
    filteredCommissions,
    currentPage,
    pageSize,
  ]);

  // ---------------------------------------------------------------------------
  // Filter handlers
  // ---------------------------------------------------------------------------

  const handleSearchChange = useCallback(
    (value: string) => {
      updateFilter('search', value);
      setPage(1);
    },
    [updateFilter],
  );

  const handleStatusChange = useCallback(
    (value: CommissionStatusFilterValue) => {
      updateFilter(
        'status',
        value === 'ALL' ? undefined : value,
      );

      setPage(1);
    },
    [updateFilter],
  );

  const handleTypeChange = useCallback(
    (value: CommissionDirectoryType) => {
      setType(value);
      setPage(1);
    },
    [],
  );

  const handleRemoveFilter = useCallback(
    (key: string) => {
      if (key === 'type') {
        setType('ALL');
      } else if (
        key === 'search' ||
        key === 'status' ||
        key === 'createdFrom' ||
        key === 'createdTo'
      ) {
        clearFilter(key);
      }

      setPage(1);
    },
    [clearFilter],
  );

  const handleClearAll = useCallback(() => {
    resetFilters();
    setType('ALL');
    setPage(1);
  }, [resetFilters]);

  const handlePageChange = useCallback(
    (nextPage: number) => {
      setPage(
        Math.min(
          Math.max(nextPage, 1),
          totalPages,
        ),
      );
    },
    [totalPages],
  );

  // ---------------------------------------------------------------------------
  // Active filter chips
  // ---------------------------------------------------------------------------

  const activeFilters = useMemo(
    () => getActiveFilters(filters, type),
    [filters, type],
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <section
      className={className}
      aria-label="Commission directory"
    >
      <CommissionDirectoryHeader />

      <div className="mt-6 space-y-4">
        {/* Commission type tabs and earning creation action */}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CommissionTypeTabs
            value={type}
            onChange={handleTypeChange}
            disabled={isLoading}
          />

          {type === 'EARNING' && (
            <Button
              type="button"
              variant="primary"
              onClick={handleOpenCreateDialog}
              disabled={isCreatingEarningCommission}
            >
              Create earning commission
            </Button>
          )}
        </div>

        {/* Earning commission creation error */}

        {createOperationError && (
          <div
            role="alert"
            className="rounded-md border border-[var(--danger)] bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]"
          >
            {createOperationError}
          </div>
        )}

        {/* Search and status filters */}

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex-1">
            <CommissionSearch
              value={filters.search ?? ''}
              onQueryChange={handleSearchChange}
              disabled={isLoading}
            />
          </div>

          <CommissionFilters
            status={status}
            onStatusChange={handleStatusChange}
            disabled={isLoading}
          />
        </div>

        {/* Active filters */}

        <CommissionFilterChips
          filters={activeFilters}
          onRemove={handleRemoveFilter}
          onClearAll={handleClearAll}
        />

        {/* Loading state */}

        {isLoading ? (
          <CommissionTableSkeleton
            rows={pageSize}
            columns={TABLE_COLUMNS.length}
          />
        ) : isError ? (
          // Error state
          <CommissionErrorState
            title="Unable to load commissions"
            description="Something went wrong while loading commission records. Please try again."
            retryAction={{
              label: 'Try again',
              onClick: handleRetry,
            }}
          />
        ) : filteredCommissions.length === 0 ? (
          // Empty state
          <CommissionEmptyState
            title="No commissions found"
            description="There are no commission records matching the selected filters."
            secondaryAction={{
              label: 'Clear filters',
              onClick: handleClearAll,
            }}
          />
        ) : (
          // Commission table and pagination
          <>
            <CommissionTable
              columns={TABLE_COLUMNS}
            >
              {paginatedCommissions.map((record) => (
                <CommissionDirectoryTableRow
                  key={`${record.type}-${record.commission.publicId}`}
                  record={record}
                />
              ))}
            </CommissionTable>

            <CommissionPagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {/* Earning commission creation dialog */}

      <EarningCommissionCreateDialog
        open={isCreateDialogOpen}
        loading={isCreatingEarningCommission}
        onClose={handleCloseCreateDialog}
        onSubmit={handleCreateEarningCommission}
      />
    </section>
  );
}

// -----------------------------------------------------------------------------
// Commission Directory Table Row
// -----------------------------------------------------------------------------

interface CommissionDirectoryTableRowProps {
  readonly record: CommissionDirectoryRecord;
}

function CommissionDirectoryTableRow({
  record,
}: CommissionDirectoryTableRowProps) {
  const commission = record.commission;

  return (
    <CommissionTableRow
      cells={[
        {
          key: 'commission',
          content: (
            <CommissionPublicId
              publicId={commission.publicId}
              copyable
            />
          ),
        },
        {
          key: 'type',
          content: (
            <CommissionTypeBadge
              type={record.type}
            />
          ),
        },
        {
          key: 'related',
          content:
            record.type === 'BOOKING' ? (
              <div className="space-y-1">
                <CommissionBookingLink
                  publicId={record.commission.bookingPublicId}
                />

                <div>
                  <CommissionJourneyLink
                    publicId={record.commission.journeyPublicId}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <div>
                  <CommissionJourneyLink
                    publicId={record.commission.journeyPublicId}
                  />
                </div>

                <div>
                  <CommissionProviderLink
                    publicId={record.commission.providerPublicId}
                  />
                </div>
              </div>
            ),
        },
        {
          key: 'rule',
          content: (
            <CommissionRuleLink
              publicId={commission.commissionRulePublicId}
            />
          ),
        },
        {
          key: 'amount',
          content: (
            <CommissionAmount
              amount={commission.commissionAmount}
              currency={commission.currency}
            />
          ),
        },
        {
          key: 'status',
          content: (
            <CommissionStatusBadge
              status={commission.status}
            />
          ),
        },
        {
          key: 'createdAt',
          content: (
            <CommissionDate
              value={commission.createdAt}
            />
          ),
        },
      ]}
    />
  );
}
