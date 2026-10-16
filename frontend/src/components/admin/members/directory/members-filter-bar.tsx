
// -----------------------------------------------------------------------------
// sisiMove — Members Filter Bar
// -----------------------------------------------------------------------------
//
// Filter controls for the Admin Members directory.
//
// Responsibilities:
// - Collect a search query.
// - Filter by confirmed Identity lifecycle status.
// - Emit filter changes through typed callbacks.
// - Allow the user to clear all filters.
//
// Non-responsibilities:
// - Fetching member records.
// - Calling backend endpoints.
// - Applying server-side filtering.
// - Managing directory pagination.
//
// -----------------------------------------------------------------------------

'use client';

import type { ReactNode } from 'react';

import type { MemberStatus } from '@/features/admin/members/models/member-status.model';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface MembersFilterValues {
  readonly search: string;
  readonly status: MemberStatus | 'ALL';
}

export interface MembersFilterBarProps {
  /** Current filter values, controlled by the parent. */
  readonly values: MembersFilterValues;

  /** Called when either filter changes. */
  readonly onChange: (values: MembersFilterValues) => void;

  /** Optional additional action, such as an export control. */
  readonly actions?: ReactNode;

  /** Optional additional CSS classes. */
  readonly className?: string;

  /** Whether filter controls are disabled. */
  readonly disabled?: boolean;
}

// -----------------------------------------------------------------------------
// Status Options
// -----------------------------------------------------------------------------

const STATUS_OPTIONS: ReadonlyArray<{
  readonly value: MemberStatus | 'ALL';
  readonly label: string;
}> = [
  { value: 'ALL', label: 'All statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'SUSPENDED', label: 'Suspended' },
  { value: 'CLOSED', label: 'Closed' },
];

// -----------------------------------------------------------------------------
// Members Filter Bar
// -----------------------------------------------------------------------------

export function MembersFilterBar({
  values,
  onChange,
  actions,
  className,
  disabled = false,
}: MembersFilterBarProps): ReactNode {
  const hasActiveFilters =
    values.search.trim().length > 0 || values.status !== 'ALL';

  const rootClasses = [
    'flex min-w-0 flex-col gap-3',
    'lg:flex-row lg:items-center lg:justify-between',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const controlClasses = [
    'h-10 w-full rounded-[var(--radius-md)] border',
    'border-[var(--border)] bg-[var(--surface)]',
    'px-3 text-sm text-[var(--foreground)]',
    'placeholder:text-[var(--foreground-muted)]',
    'focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-[var(--brand)]/30',
    'disabled:cursor-not-allowed disabled:opacity-60',
  ].join(' ');

  function clearFilters(): void {
    onChange({
      search: '',
      status: 'ALL',
    });
  }

  return (
    <div className={rootClasses}>
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative min-w-0 flex-1 sm:min-w-64">
          <label
            htmlFor="members-directory-search"
            className="sr-only"
          >
            Search members
          </label>

          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground-muted)]"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m16 16 4 4" strokeLinecap="round" />
          </svg>

          <input
            id="members-directory-search"
            type="search"
            autoComplete="off"
            value={values.search}
            disabled={disabled}
            onChange={(event) =>
              onChange({
                ...values,
                search: event.target.value,
              })
            }
            placeholder="Search by email, phone or ID"
            className={`${controlClasses} pl-9`}
          />
        </div>

        <div className="w-full sm:w-48">
          <label
            htmlFor="members-directory-status"
            className="sr-only"
          >
            Filter by member status
          </label>

          <select
            id="members-directory-status"
            value={values.status}
            disabled={disabled}
            onChange={(event) =>
              onChange({
                ...values,
                status: event.target.value as MemberStatus | 'ALL',
              })
            }
            className={controlClasses}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            disabled={disabled}
            onClick={clearFilters}
            className={[
              'inline-flex h-10 shrink-0 items-center justify-center',
              'rounded-[var(--radius-md)] px-3 text-sm font-medium',
              'text-[var(--foreground-secondary)]',
              'transition-colors hover:bg-[var(--background-muted)]',
              'focus-visible:outline-none focus-visible:ring-2',
              'focus-visible:ring-[var(--brand)]/30',
              'disabled:cursor-not-allowed disabled:opacity-60',
            ].join(' ')}
          >
            Clear filters
          </button>
        )}
      </div>

      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      ) : null}
    </div>
  );
}

export default MembersFilterBar;
