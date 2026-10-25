// src/components/admin/finance/account-holds/directory/AccountHoldPagination.tsx

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

export interface AccountHoldPaginationProps {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export function AccountHoldPagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  className,
}: AccountHoldPaginationProps) {
  const safeTotal = Math.max(0, totalItems);
  const safePageSize = Math.max(1, pageSize);
  const totalPages = Math.max(1, Math.ceil(safeTotal / safePageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const start = safeTotal === 0 ? 0 : (currentPage - 1) * safePageSize + 1;
  const end = Math.min(currentPage * safePageSize, safeTotal);

  const buttonClass = cn(
    'inline-flex size-9 items-center justify-center rounded-[var(--radius-md)]',
    'border border-[var(--border)] bg-[var(--surface)]',
    'text-[var(--foreground-secondary)] transition-colors',
    'hover:bg-[var(--background-muted)] hover:text-[var(--foreground)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]',
    'disabled:pointer-events-none disabled:opacity-40',
  );

  return (
    <nav
      aria-label="Account hold pagination"
      className={cn(
        'flex flex-col gap-4 border-t border-[var(--border)] px-4 py-4',
        'sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--foreground-muted)]">
        <p aria-live="polite">
          Showing{' '}
          <span className="font-medium text-[var(--foreground)]">{start}</span>
          {' '}–{' '}
          <span className="font-medium text-[var(--foreground)]">{end}</span>
          {' '}of{' '}
          <span className="font-medium text-[var(--foreground)]">
            {safeTotal.toLocaleString('en-KE')}
          </span>
        </p>

        {onPageSizeChange && (
          <label className="flex items-center gap-2">
            <span>Rows</span>
            <select
              value={safePageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              className={cn(
                'h-9 rounded-[var(--radius-md)] border border-[var(--border)]',
                'bg-[var(--surface)] px-2 text-sm text-[var(--foreground)]',
                'outline-none focus:border-[var(--brand)]',
              )}
              aria-label="Rows per page"
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
          className={buttonClass}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || safeTotal === 0}
          aria-label="Go to previous page"
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
        </button>

        <span className="min-w-24 text-center text-sm text-[var(--foreground-secondary)]">
          Page <span className="font-semibold">{currentPage}</span> of{' '}
          <span className="font-semibold">{totalPages}</span>
        </span>

        <button
          type="button"
          className={buttonClass}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || safeTotal === 0}
          aria-label="Go to next page"
        >
          <ChevronRight aria-hidden="true" className="size-4" />
        </button>
      </div>
    </nav>
  );
}