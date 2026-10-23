
'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BookingPaginationProps {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export function BookingPagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  className = '',
}: BookingPaginationProps) {
  const safePageSize = Math.max(1, pageSize);
  const totalPages = Math.max(
    1,
    Math.ceil(Math.max(0, totalItems) / safePageSize),
  );
  const currentPage = Math.min(
    Math.max(1, page),
    totalPages,
  );

  const startItem =
    totalItems === 0 ? 0 : (currentPage - 1) * safePageSize + 1;

  const endItem = Math.min(
    currentPage * safePageSize,
    Math.max(0, totalItems),
  );

  const buttonClass =
    'inline-flex size-9 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] text-[var(--foreground-secondary)] transition hover:bg-[var(--background-subtle)] hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <nav
      aria-label="Booking pagination"
      className={`flex flex-col gap-4 border-t border-[var(--border)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--foreground-secondary)]">
        <span aria-live="polite">
          Showing{' '}
          <span className="font-medium text-[var(--foreground)]">
            {startItem}–{endItem}
          </span>{' '}
          of{' '}
          <span className="font-medium text-[var(--foreground)]">
            {Math.max(0, totalItems)}
          </span>{' '}
          bookings
        </span>

        {onPageSizeChange && (
          <label className="flex items-center gap-2">
            <span>Rows</span>
            <select
              value={safePageSize}
              onChange={(event) => {
                onPageSizeChange(Number(event.target.value));
                onPageChange(1);
              }}
              className="h-9 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] px-2 text-sm text-[var(--foreground)] outline-none focus:ring-2 focus:ring-[var(--brand)]"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
          className={buttonClass}
        >
          <ChevronLeft size={16} aria-hidden="true" />
        </button>

        <span className="min-w-24 text-center text-sm text-[var(--foreground-secondary)]">
          Page{' '}
          <span className="font-medium text-[var(--foreground)]">
            {currentPage}
          </span>{' '}
          of {totalPages}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
          className={buttonClass}
        >
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
