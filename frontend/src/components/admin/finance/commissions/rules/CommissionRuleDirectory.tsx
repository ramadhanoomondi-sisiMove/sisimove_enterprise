
// -----------------------------------------------------------------------------
// sisiMove Admin — Commission Rule Directory
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Fetch commission rules.
// - Own search, type and status filter state.
// - Coordinate pagination.
// - Coordinate commission rule creation.
// - Compose the commission rule table.
//
// Architecture:
// - Query hooks own server data and filtering.
// - Operations hooks own mutations.
// - This component coordinates directory state.
// - CommissionRuleTable owns table rendering.
// - CommissionRuleTableRow owns individual row rendering.
// - Backend remains authoritative for commission rule persistence.
// -----------------------------------------------------------------------------

'use client';

import { useState } from 'react';

import {
  Button,
  Card,
  ErrorState,
  Skeleton,
} from '@/components/ui';

import {
  useAdminCommissionRules,
  useAdminCommissionRuleOperations,
} from '@/features/admin/finance/commissions/hooks';

import type {
  AdminCreateCommissionRuleModel,
} from '@/features/admin/finance/commissions/models';

import { CommissionRuleTable } from './CommissionRuleTable';

import {
  CommissionRuleCreateDialog,
} from '../operations/rules';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const PAGE_SIZE = 20;

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface CommissionRuleDirectoryProps {
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function getErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

// -----------------------------------------------------------------------------
// Loading State
// -----------------------------------------------------------------------------

function CommissionRuleDirectorySkeleton() {
  return (
    <Card padding="md">
      <div className="space-y-5">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-10 w-full" />

        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </Card>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function CommissionRuleDirectory({
  className,
}: CommissionRuleDirectoryProps) {
  // ---------------------------------------------------------------------------
  // Directory State
  // ---------------------------------------------------------------------------

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  // ---------------------------------------------------------------------------
  // Create Dialog State
  // ---------------------------------------------------------------------------

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [operationError, setOperationError] =
    useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Commission Rule Query
  // ---------------------------------------------------------------------------

  const {
    rules,
    totalFiltered,
    totalPages,
    currentPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminCommissionRules(
    {
      search: search.trim() || undefined,
      type: typeFilter
        ? (typeFilter as 'BOOKING' | 'EARNING')
        : undefined,
      status: statusFilter
        ? (statusFilter as 'ACTIVE' | 'INACTIVE')
        : undefined,
    },
    {
      page,
      pageSize: PAGE_SIZE,
    },
  );

  // ---------------------------------------------------------------------------
  // Commission Rule Operations
  // ---------------------------------------------------------------------------

  const {
    createCommissionRuleAsync,
    isCreatingCommissionRule,
    createCommissionRuleError,
  } = useAdminCommissionRuleOperations();

  const createError =
    operationError ??
    (createCommissionRuleError
      ? getErrorMessage(
          createCommissionRuleError,
          'Unable to create the commission rule.',
        )
      : null);

  // ---------------------------------------------------------------------------
  // Filter Handlers
  // ---------------------------------------------------------------------------

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleTypeChange(value: string) {
    setTypeFilter(value);
    setPage(1);
  }

  function handleStatusChange(value: string) {
    setStatusFilter(value);
    setPage(1);
  }

  // ---------------------------------------------------------------------------
  // Create Dialog Handlers
  // ---------------------------------------------------------------------------

  function handleOpenCreateDialog() {
    setOperationError(null);
    setIsCreateDialogOpen(true);
  }

  function handleCloseCreateDialog() {
    if (isCreatingCommissionRule) {
      return;
    }

    setOperationError(null);
    setIsCreateDialogOpen(false);
  }

  async function handleCreateCommissionRule(
    payload: AdminCreateCommissionRuleModel,
  ) {
    setOperationError(null);

    try {
      await createCommissionRuleAsync(payload);

      setIsCreateDialogOpen(false);
    } catch (caughtError) {
      setOperationError(
        getErrorMessage(
          caughtError,
          'The commission rule could not be created. Please try again.',
        ),
      );

      throw caughtError;
    }
  }

  // ---------------------------------------------------------------------------
  // Loading State
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <div className={className}>
        <CommissionRuleDirectorySkeleton />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Query Error
  // ---------------------------------------------------------------------------

  if (isError) {
    return (
      <div className={className}>
        <ErrorState
          title="Unable to load commission rules"
          description={
            error instanceof Error
              ? error.message
              : 'Commission rules could not be loaded. Please try again.'
          }
          retryAction={{
            label: 'Retry',
            onClick: () => {
              void refetch();
            },
          }}
        />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className={['space-y-4', className].filter(Boolean).join(' ')}>
      {/* Directory Controls */}

      <Card padding="md">
        <div className="space-y-4">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                Commission rules
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Review commission percentages, rule status, effective
                periods, and versions.
              </p>
            </div>

            <Button
              type="button"
              variant="primary"
              onClick={handleOpenCreateDialog}
              disabled={isCreatingCommissionRule}
            >
              Create commission rule
            </Button>
          </div>

          {/* Search and Filters */}

          <div className="grid gap-3 md:grid-cols-3">
            <input
              type="search"
              value={search}
              onChange={(event) =>
                handleSearchChange(event.target.value)
              }
              placeholder="Search commission rules..."
              aria-label="Search commission rules"
              className="min-h-10 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            />

            <select
              value={typeFilter}
              onChange={(event) =>
                handleTypeChange(event.target.value)
              }
              aria-label="Filter by commission type"
              className="min-h-10 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              <option value="">All commission types</option>
              <option value="BOOKING">Booking</option>
              <option value="EARNING">Earning</option>
            </select>

            <select
              value={statusFilter}
              onChange={(event) =>
                handleStatusChange(event.target.value)
              }
              aria-label="Filter by rule status"
              className="min-h-10 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              <option value="">All rule statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {/* Result Count */}

          <p className="text-sm text-muted-foreground">
            {totalFiltered} {totalFiltered === 1 ? 'rule' : 'rules'} found
          </p>
        </div>
      </Card>

      {/* Create Operation Feedback */}

      {createError && (
        <div
          role="alert"
          className="rounded-md border border-[var(--danger)] bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]"
        >
          {createError}
        </div>
      )}

      {/* Commission Rule Table */}

      <CommissionRuleTable rules={rules} />

      {/* Pagination */}

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() =>
                setPage((current) => Math.max(1, current - 1))
              }
              className="rounded-md border border-[var(--border)] px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() =>
                setPage((current) => current + 1)
              }
              className="rounded-md border border-[var(--border)] px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Create Commission Rule Dialog */}

      <CommissionRuleCreateDialog
        open={isCreateDialogOpen}
        loading={isCreatingCommissionRule}
        onClose={handleCloseCreateDialog}
        onSubmit={handleCreateCommissionRule}
      />
    </div>
  );
}
