import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface FinancialAccountPaginationProps {
  page: number;
  pageCount: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export function FinancialAccountPagination({ page, pageCount, pageSize, totalCount, onPageChange }: FinancialAccountPaginationProps) {
  const start = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);
  const buttonClass = 'inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-[var(--border)] px-3 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--background-muted)] disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <nav aria-label="Financial account pages" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-[var(--foreground-secondary)]">
        Showing <span className="font-medium text-[var(--foreground)]">{start}–{end}</span> of <span className="font-medium text-[var(--foreground)]">{totalCount}</span>
      </p>
      <div className="flex items-center gap-2">
        <button type="button" className={buttonClass} disabled={page <= 1} onClick={() => onPageChange(Math.max(1, page - 1))}>
          <ChevronLeft size={15} aria-hidden="true" /> Previous
        </button>
        <span className="min-w-[88px] text-center text-sm text-[var(--foreground-secondary)]">Page {page} of {pageCount}</span>
        <button type="button" className={buttonClass} disabled={page >= pageCount} onClick={() => onPageChange(Math.min(pageCount, page + 1))}>
          Next <ChevronRight size={15} aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
