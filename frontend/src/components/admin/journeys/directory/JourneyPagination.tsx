
'use client';

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

import { cn } from '@/foundation/utils/cn';
import type { JourneyPagination as JourneyPaginationModel } from '@/features/admin/journeys/models/journey-filters.model';

interface JourneyPaginationProps {
  pagination: JourneyPaginationModel;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
  disabled?: boolean;
}

export default function JourneyPagination({
  pagination,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  className,
  disabled = false,
}: JourneyPaginationProps) {
  const { page, pageSize, totalItems, totalPages } = pagination;

  const safeTotalItems = Math.max(0, totalItems);
  const safeTotalPages = Math.max(0, totalPages);
  const currentPage = safeTotalPages > 0
    ? Math.min(Math.max(1, page), safeTotalPages)
    : 0;

  const startItem =
    currentPage === 0 ? 0 : (currentPage - 1) * pageSize + 1;

  const endItem =
    currentPage === 0
      ? 0
      : Math.min(currentPage * pageSize, safeTotalItems);

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage > 0 && currentPage < safeTotalPages;

  const buttonClassName =
    'inline-flex size-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--background-subtle)] hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]';

  const goToPage = (nextPage: number) => {
    if (disabled || safeTotalPages === 0) return;

    const boundedPage = Math.min(
      Math.max(1, nextPage),
      safeTotalPages,
    );

    if (boundedPage !== page) {
      onPageChange(boundedPage);
    }
  };

  return (
    <nav
      aria-label="Journey directory pagination"
      className={cn(
        'flex flex-col gap-4 border-t border-[var(--border)] pt-4 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p
          className="text-sm text-[var(--foreground-muted)]"
          aria-live="polite"
        >
          {safeTotalItems === 0 ? (
            'No journeys to display'
          ) : (
            <>
              Showing{' '}
              <span className="font-medium text-[var(--foreground)] tabular-nums">
                {startItem.toLocaleString()}–{endItem.toLocaleString()}
              </span>{' '}
              of{' '}
              <span className="font-medium text-[var(--foreground)] tabular-nums">
                {safeTotalItems.toLocaleString()}
              </span>{' '}
              journeys
            </>
          )}
        </p>

        {onPageSizeChange && (
          <label className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
            <span>Rows</span>

            <select
              value={pageSize}
              disabled={disabled}
              onChange={(event) =>
                onPageSizeChange(Number(event.target.value))
              }
              className="h-9 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/15 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {Array.from(
                new Set([...pageSizeOptions, pageSize]),
              )
                .filter((size) => Number.isInteger(size) && size > 0)
                .sort((a, b) => a - b)
                .map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
            </select>
            <span>per page</span>
          </label>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => goToPage(1)}
          disabled={disabled || !canGoPrevious}
          aria-label="Go to first page"
          title="First page"
          className={buttonClassName}
        >
          <ChevronsLeft aria-hidden="true" className="size-4" />
        </button>

        <button
          type="button"
          onClick={() => goToPage(currentPage - 1)}
          disabled={disabled || !canGoPrevious}
          aria-label="Go to previous page"
          title="Previous page"
          className={buttonClassName}
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
        </button>

        <span className="min-w-24 px-2 text-center text-sm text-[var(--foreground-secondary)]">
          Page{' '}
          <span className="font-semibold text-[var(--foreground)] tabular-nums">
            {currentPage}
          </span>{' '}
          of{' '}
          <span className="font-semibold text-[var(--foreground)] tabular-nums">
            {safeTotalPages}
          </span>
        </span>

        <button
          type="button"
          onClick={() => goToPage(currentPage + 1)}
          disabled={disabled || !canGoNext}
          aria-label="Go to next page"
          title="Next page"
          className={buttonClassName}
        >
          <ChevronRight aria-hidden="true" className="size-4" />
        </button>

        <button
          type="button"
          onClick={() => goToPage(safeTotalPages)}
          disabled={disabled || !canGoNext}
          aria-label="Go to last page"
          title="Last page"
          className={buttonClassName}
        >
          <ChevronsRight aria-hidden="true" className="size-4" />
        </button>
      </div>
    </nav>
  );
}
