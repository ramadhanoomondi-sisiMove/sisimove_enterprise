// -----------------------------------------------------------------------------
// sisiMove — Member List Skeleton
// -----------------------------------------------------------------------------
//
// Member-specific loading placeholder for the Admin Members directory.
//
// Responsibilities:
// - Reserve space while the member directory is loading.
// - Approximate the layout of the directory toolbar and member rows.
// - Keep the loading layout responsive.
// - Provide accessible loading semantics.
// - Reuse the shared Skeleton component.
//
// Non-responsibilities:
// - Fetching or refreshing member records.
// - Deciding whether loading has completed.
// - Rendering errors or empty states.
//
// Architecture:
//
// Members Directory
//        │
//        ▼
// MemberListSkeleton
//        │
//        ▼
//   Shared Skeleton
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface MemberListSkeletonProps {
  /**
   * Number of placeholder rows to render.
   */
  readonly rows?: number;

  /**
   * Whether to include the directory toolbar placeholder.
   */
  readonly showToolbar?: boolean;

  /**
   * Whether to include the table header placeholder.
   */
  readonly showTableHeader?: boolean;

  /**
   * Optional additional presentation classes.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const DEFAULT_ROWS = 6;
const MAX_ROWS = 12;

// -----------------------------------------------------------------------------
// Member List Skeleton
// -----------------------------------------------------------------------------

export function MemberListSkeleton({
  rows = DEFAULT_ROWS,
  showToolbar = true,
  showTableHeader = true,
  className,
}: MemberListSkeletonProps): ReactNode {
  const rowCount = Number.isFinite(rows)
    ? Math.min(MAX_ROWS, Math.max(1, Math.floor(rows)))
    : DEFAULT_ROWS;

  const classes = [
    'min-w-0 space-y-4',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classes}
      role="status"
      aria-label="Loading members"
      aria-busy="true"
    >
      <span className="sr-only">Loading members…</span>

      {showToolbar ? (
        <div
          aria-hidden="true"
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <Skeleton className="h-10 w-full sm:max-w-sm" radius="md" />

          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-10 w-24" radius="md" />
            <Skeleton className="h-10 w-28" radius="md" />
            <Skeleton className="h-10 w-20" radius="md" />
          </div>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)]">
        {showTableHeader ? (
          <div
            aria-hidden="true"
            className="hidden grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.8fr)] gap-4 border-b border-[var(--border)] px-5 py-4 md:grid"
          >
            <Skeleton className="h-3 w-20" radius="sm" />
            <Skeleton className="h-3 w-24" radius="sm" />
            <Skeleton className="h-3 w-20" radius="sm" />
            <Skeleton className="h-3 w-16" radius="sm" />
          </div>
        ) : null}

        <div className="divide-y divide-[var(--border-subtle)]">
          {Array.from({ length: rowCount }, (_, index) => (
            <div
              key={index}
              aria-hidden="true"
              className="flex min-w-0 items-center gap-3 px-4 py-4 sm:gap-4 sm:px-5"
            >
              <Skeleton
                className="h-10 w-10 shrink-0"
                radius="full"
              />

              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-3.5 w-32 max-w-full" radius="sm" />
                <Skeleton className="h-3 w-44 max-w-full" radius="sm" />

                <div className="flex flex-wrap gap-2 md:hidden">
                  <Skeleton className="h-5 w-16" radius="full" />
                  <Skeleton className="h-5 w-20" radius="full" />
                </div>
              </div>

              <div className="hidden w-28 shrink-0 md:block">
                <Skeleton className="h-5 w-20" radius="full" />
              </div>

              <div className="hidden w-28 shrink-0 lg:block">
                <Skeleton className="h-5 w-24" radius="full" />
              </div>

              <div className="hidden w-20 shrink-0 md:block">
                <Skeleton className="h-8 w-8" radius="md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MemberListSkeleton;