'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/foundation/utils/cn';

export interface BoardingPaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  className?: string;
}

export function BoardingPagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  disabled = false,
  className,
}: BoardingPaginationProps) {
  const safeTotalItems = Math.max(0, totalItems);
  const safePageSize = Math.max(1, pageSize);
  const safeTotalPages = Math.max(1, totalPages);
  const currentPage = Math.min(
    Math.max(1, page),
    safeTotalPages,
  );

  const startItem =
    safeTotalItems === 0
      ? 0
      : (currentPage - 1) * safePageSize + 1;

  const endItem = Math.min(
    currentPage * safePageSize,
    safeTotalItems,
  );

  const canGoPrevious = currentPage > 1 && !disabled;
  const canGoNext =
    currentPage < safeTotalPages && !disabled;

  const buttonClass = cn(
    'inline-flex min-h-9 items-center justify-center gap-1.5',
    'rounded-[var(--radius-md)] border border-[var(--border)]',
    'bg-[var(--surface)] px-3 text-sm font-medium',
    'text-[var(--foreground)] transition-colors',
    'hover:bg-[var(--background-muted)]',
    'focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-[var(--brand)]/30',
    'disabled:pointer-events-none disabled:opacity-40',
  );

  return (
    <nav
      aria-label="Boarding directory pagination"
      className={cn(
        'flex flex-col gap-3 sm:flex-row',
        'sm:items-center sm:justify-between',
        className,
      )}
    >
      <p
        className="text-sm text-[var(--foreground-secondary)]"
        aria-live="polite"
      >
        Showing{' '}
        <span className="font-medium text-[var(--foreground)]">
          {startItem}–{endItem}
        </span>{' '}
        of{' '}
        <span className="font-medium text-[var(--foreground)]">
          {safeTotalItems}
        </span>{' '}
        boarding records
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className={buttonClass}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
          aria-label="Go to previous page"
        >
          <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          <span>Previous</span>
        </button>

        <span
          className="min-w-24 text-center text-sm text-[var(--foreground-secondary)]"
          aria-current="page"
        >
          Page {currentPage} of {safeTotalPages}
        </span>

        <button
          type="button"
          className={buttonClass}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          aria-label="Go to next page"
        >
          <span>Next</span>
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}
