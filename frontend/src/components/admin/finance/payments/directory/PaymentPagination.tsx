'use client';

// ============================================================
// Financial Payments — Pagination
// ============================================================

import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaymentPaginationProps {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  className?: string;
}

function getVisiblePages(currentPage: number, totalPages: number) {
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  return Array.from({ length: Math.max(0, end - start + 1) }, (_, index) =>
    start + index,
  );
}

export function PaymentPagination({
  page,
  pageSize,
  totalItems,
  totalPages,
  hasPreviousPage,
  hasNextPage,
  onPageChange,
  disabled = false,
  className,
}: PaymentPaginationProps) {
  const safePage = Math.max(1, page);
  const firstItem = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const lastItem = Math.min(safePage * pageSize, totalItems);
  const visiblePages = getVisiblePages(safePage, totalPages);

  if (totalItems === 0 && totalPages === 0) {
    return (
      <div className={['text-sm text-[var(--foreground-muted)]', className ?? ''].join(' ')}>
        No payment records to paginate.
      </div>
    );
  }

  const buttonClass = [
    'inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg',
    'border border-[var(--border)] px-3 text-sm font-medium',
    'text-[var(--foreground-secondary)] transition-colors',
    'hover:bg-[var(--background-subtle)]',
    'focus-visible:outline-2 focus-visible:outline-[var(--brand)]',
    'disabled:cursor-not-allowed disabled:opacity-40',
  ].join(' ');

  return (
    <nav
      aria-label="Payment pagination"
      className={[
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        className ?? '',
      ].join(' ')}
    >
      <p className="text-sm text-[var(--foreground-muted)]">
        Showing{' '}
        <span className="font-medium text-[var(--foreground)]">{firstItem}</span>
        {'–'}
        <span className="font-medium text-[var(--foreground)]">{lastItem}</span>
        {' of '}
        <span className="font-medium text-[var(--foreground)]">
          {totalItems.toLocaleString()}
        </span>
        {' payments'}
      </p>

      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          className={buttonClass}
          disabled={disabled || !hasPreviousPage}
          onClick={() => onPageChange(safePage - 1)}
        >
          <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          Previous
        </button>

        {visiblePages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            aria-label={`Go to page ${pageNumber}`}
            aria-current={pageNumber === safePage ? 'page' : undefined}
            disabled={disabled}
            onClick={() => onPageChange(pageNumber)}
            className={[
              'min-h-9 min-w-9 rounded-lg border px-2 text-sm font-medium',
              'focus-visible:outline-2 focus-visible:outline-[var(--brand)]',
              pageNumber === safePage
                ? 'border-[var(--brand)] bg-[var(--brand)] text-white'
                : 'border-[var(--border)] text-[var(--foreground-secondary)] hover:bg-[var(--background-subtle)]',
              disabled ? 'cursor-not-allowed opacity-40' : '',
            ].join(' ')}
          >
            {pageNumber}
          </button>
        ))}

        <button
          type="button"
          className={buttonClass}
          disabled={disabled || !hasNextPage}
          onClick={() => onPageChange(safePage + 1)}
        >
          Next
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}

export default PaymentPagination;