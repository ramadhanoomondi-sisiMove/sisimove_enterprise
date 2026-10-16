
// -----------------------------------------------------------------------------
// sisiMove — Member Pagination
// -----------------------------------------------------------------------------
//
// Pagination controls for the Admin Members feature.
//
// Responsibilities:
// - Display the current record range and total number of members.
// - Allow navigation between pages.
// - Optionally allow the user to change page size.
// - Disable navigation when the relevant boundary is reached.
// - Remain independent of API fetching and routing.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface MemberPaginationProps {
  /** Current one-based page number. */
  readonly page: number;

  /** Total number of pages. */
  readonly totalPages: number;

  /** Total number of records across all pages. */
  readonly totalItems: number;

  /** Number of records displayed on the current page. */
  readonly pageSize: number;

  /** Called when the requested page changes. */
  readonly onPageChange: (page: number) => void;

  /** Optional page-size change callback. */
  readonly onPageSizeChange?: (pageSize: number) => void;

  /** Available page-size options. */
  readonly pageSizeOptions?: readonly number[];

  /** Optional additional CSS classes. */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function getRecordRange(
  page: number,
  pageSize: number,
  totalItems: number,
): { start: number; end: number } {
  if (totalItems <= 0) {
    return { start: 0, end: 0 };
  }

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return { start, end };
}

function getPageNumbers(
  page: number,
  totalPages: number,
): number[] {
  const visiblePages = 5;

  if (totalPages <= visiblePages) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  let start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + visiblePages - 1);

  if (end - start + 1 < visiblePages) {
    start = Math.max(1, end - visiblePages + 1);
  }

  return Array.from(
    { length: end - start + 1 },
    (_, index) => start + index,
  );
}

// -----------------------------------------------------------------------------
// Member Pagination
// -----------------------------------------------------------------------------

export function MemberPagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  className,
}: MemberPaginationProps): ReactNode {
  const safeTotalItems = Math.max(0, Math.floor(totalItems));
  const safeTotalPages = Math.max(0, Math.floor(totalPages));
  const safePageSize = Math.max(1, Math.floor(pageSize));

  const safePage = safeTotalPages > 0
    ? Math.min(Math.max(1, Math.floor(page)), safeTotalPages)
    : 1;

  const { start, end } = getRecordRange(
    safePage,
    safePageSize,
    safeTotalItems,
  );

  const pageNumbers = getPageNumbers(safePage, safeTotalPages);
  const isFirstPage = safePage <= 1;
  const isLastPage =
    safeTotalPages === 0 || safePage >= safeTotalPages;

  const buttonClass = cn(
    'inline-flex h-9 min-w-9 items-center justify-center',
    'rounded-[var(--radius-md)] border px-3 text-sm font-medium',
    'transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-[var(--brand)]/30',
    'disabled:pointer-events-none disabled:opacity-40',
  );

  const neutralButtonClass = cn(
    buttonClass,
    'border-[var(--border)] bg-[var(--surface)]',
    'text-[var(--foreground-secondary)]',
    'hover:bg-[var(--background-muted)]',
  );

  const activeButtonClass = cn(
    buttonClass,
    'border-[var(--brand)] bg-[var(--brand)]',
    'text-[var(--brand-foreground)]',
  );

  return (
    <nav
      aria-label="Member directory pagination"
      className={cn(
        'flex min-w-0 flex-col gap-4',
        'sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p
          className="text-sm text-[var(--foreground-muted)]"
          aria-live="polite"
        >
          {safeTotalItems === 0 ? (
            'No members to display'
          ) : (
            <>
              Showing{' '}
              <span className="font-medium text-[var(--foreground)]">
                {start}–{end}
              </span>{' '}
              of{' '}
              <span className="font-medium text-[var(--foreground)]">
                {safeTotalItems}
              </span>{' '}
              members
            </>
          )}
        </p>

        {onPageSizeChange && (
          <label className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
            <span>Rows</span>
            <select
              aria-label="Members per page"
              value={safePageSize}
              onChange={(event) => {
                const nextPageSize = Number(event.target.value);

                if (
                  Number.isInteger(nextPageSize) &&
                  pageSizeOptions.includes(nextPageSize)
                ) {
                  onPageSizeChange(nextPageSize);
                }
              }}
              className={cn(
                'h-9 rounded-[var(--radius-md)] border',
                'border-[var(--border)] bg-[var(--surface)] px-2',
                'text-sm text-[var(--foreground)]',
                'focus-visible:outline-none focus-visible:ring-2',
                'focus-visible:ring-[var(--brand)]/30',
              )}
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1">
        <button
          type="button"
          aria-label="Go to first page"
          disabled={isFirstPage}
          onClick={() => onPageChange(1)}
          className={neutralButtonClass}
        >
          «
        </button>

        <button
          type="button"
          aria-label="Go to previous page"
          disabled={isFirstPage}
          onClick={() => onPageChange(safePage - 1)}
          className={neutralButtonClass}
        >
          ‹
        </button>

        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            aria-label={`Go to page ${pageNumber}`}
            aria-current={pageNumber === safePage ? 'page' : undefined}
            onClick={() => onPageChange(pageNumber)}
            className={
              pageNumber === safePage
                ? activeButtonClass
                : neutralButtonClass
            }
          >
            {pageNumber}
          </button>
        ))}

        <button
          type="button"
          aria-label="Go to next page"
          disabled={isLastPage}
          onClick={() => onPageChange(safePage + 1)}
          className={neutralButtonClass}
        >
          ›
        </button>

        <button
          type="button"
          aria-label="Go to last page"
          disabled={isLastPage}
          onClick={() => onPageChange(safeTotalPages)}
          className={neutralButtonClass}
        >
          »
        </button>
      </div>
    </nav>
  );
}

export default MemberPagination;
