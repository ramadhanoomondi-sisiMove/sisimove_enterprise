
'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import type { HTMLAttributes } from 'react';

import { cn } from '@/foundation/utils/cn';
import { Button } from '@/components/ui/button';

export interface AssetPaginationProps
  extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  readonly page: number;
  readonly pageSize: number;
  readonly totalItems: number;
  readonly onPageChange: (page: number) => void;
  readonly onPageSizeChange?: (pageSize: number) => void;
  readonly pageSizeOptions?: readonly number[];
  readonly disabled?: boolean;
}

export function AssetPagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  disabled = false,
  className,
  ...props
}: AssetPaginationProps) {
  const safePageSize = Math.max(1, pageSize);
  const safeTotalItems = Math.max(0, totalItems);
  const totalPages = Math.max(1, Math.ceil(safeTotalItems / safePageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const startItem =
    safeTotalItems === 0 ? 0 : (currentPage - 1) * safePageSize + 1;

  const endItem = Math.min(currentPage * safePageSize, safeTotalItems);

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <nav
      {...props}
      aria-label="Asset directory pagination"
      className={cn(
        'flex flex-col gap-4 border-t border-[var(--border)] py-4',
        'sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p
          aria-live="polite"
          className="text-sm text-[var(--muted-foreground)]"
        >
          Showing{' '}
          <span className="font-medium text-[var(--foreground)]">
            {startItem}–{endItem}
          </span>{' '}
          of{' '}
          <span className="font-medium text-[var(--foreground)]">
            {safeTotalItems.toLocaleString()}
          </span>{' '}
          assets
        </p>

        {onPageSizeChange && (
          <label className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
            Rows
            <select
              value={safePageSize}
              disabled={disabled}
              onChange={(event) => {
                const nextSize = Number(event.target.value);
                if (!Number.isFinite(nextSize) || nextSize <= 0) return;

                onPageSizeChange(nextSize);
                onPageChange(1);
              }}
              className={cn(
                'h-9 rounded-lg border border-[var(--border)]',
                'bg-[var(--background)] px-2 text-sm',
                'text-[var(--foreground)] outline-none',
                'focus-visible:ring-2 focus-visible:ring-[var(--brand)]',
                'disabled:cursor-not-allowed disabled:opacity-50',
              )}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            per page
          </label>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || !canGoPrevious}
          onClick={() => onPageChange(1)}
          aria-label="Go to first page"
          className="!size-9 !min-h-9 !px-0"
        >
          <ChevronsLeft aria-hidden="true" className="size-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || !canGoPrevious}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Go to previous page"
          className="!size-9 !min-h-9 !px-0"
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
        </Button>

        <span className="min-w-24 px-2 text-center text-sm text-[var(--muted-foreground)]">
          Page{' '}
          <span className="font-semibold text-[var(--foreground)]">
            {currentPage}
          </span>{' '}
          of {totalPages}
        </span>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || !canGoNext}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Go to next page"
          className="!size-9 !min-h-9 !px-0"
        >
          <ChevronRight aria-hidden="true" className="size-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || !canGoNext}
          onClick={() => onPageChange(totalPages)}
          aria-label="Go to last page"
          className="!size-9 !min-h-9 !px-0"
        >
          <ChevronsRight aria-hidden="true" className="size-4" />
        </Button>
      </div>
    </nav>
  );
}

export default AssetPagination;
