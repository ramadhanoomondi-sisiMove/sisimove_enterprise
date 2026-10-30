
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

export interface ProviderPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function ProviderPagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  className,
}: ProviderPaginationProps) {
  const safeTotalPages = Math.max(1, totalPages);
  const safeCurrentPage = Math.min(
    Math.max(1, currentPage),
    safeTotalPages,
  );

  const startItem =
    totalItems === 0
      ? 0
      : (safeCurrentPage - 1) * pageSize + 1;

  const endItem = Math.min(
    safeCurrentPage * pageSize,
    totalItems,
  );

  const isFirstPage = safeCurrentPage === 1;
  const isLastPage = safeCurrentPage === safeTotalPages;

  const buttonClassName =
    'inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-muted-foreground transition-colors hover:bg-[var(--background-muted)] hover:text-foreground disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

  return (
    <nav
      aria-label="Provider directory pagination"
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <p className="text-sm text-muted-foreground">
        Showing{' '}
        <span className="font-medium tabular-nums text-foreground">
          {startItem}–{endItem}
        </span>{' '}
        of{' '}
        <span className="font-medium tabular-nums text-foreground">
          {totalItems}
        </span>{' '}
        providers
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className={buttonClassName}
          onClick={() => onPageChange(1)}
          disabled={isFirstPage}
          aria-label="Go to first page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>

        <button
          type="button"
          className={buttonClassName}
          onClick={() => onPageChange(safeCurrentPage - 1)}
          disabled={isFirstPage}
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <span
          className="min-w-24 text-center text-sm font-medium tabular-nums text-foreground"
          aria-live="polite"
        >
          Page {safeCurrentPage} of {safeTotalPages}
        </span>

        <button
          type="button"
          className={buttonClassName}
          onClick={() => onPageChange(safeCurrentPage + 1)}
          disabled={isLastPage}
          aria-label="Go to next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <button
          type="button"
          className={buttonClassName}
          onClick={() => onPageChange(safeTotalPages)}
          disabled={isLastPage}
          aria-label="Go to last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}
