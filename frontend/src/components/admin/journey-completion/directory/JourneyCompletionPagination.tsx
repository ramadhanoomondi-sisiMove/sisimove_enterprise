
import type {
  AdminJourneyCompletionPage,
} from '@/features/admin/journey-completion/models';

export interface JourneyCompletionPaginationProps {
  page: AdminJourneyCompletionPage<unknown>;
  onPageChange: (page: number) => void;
  className?: string;
}

export function JourneyCompletionPagination({
  page,
  onPageChange,
  className,
}: JourneyCompletionPaginationProps) {
  if (page.totalPages <= 1) return null;

  const start = page.totalItems === 0
    ? 0
    : (page.page - 1) * page.pageSize + 1;

  const end = Math.min(page.page * page.pageSize, page.totalItems);

  return (
    <nav
      aria-label="Journey completion pagination"
      className={`flex flex-col gap-3 border-t border-[var(--border)] pt-4 sm:flex-row sm:items-center sm:justify-between ${className ?? ''}`}
    >
      <p className="text-sm text-[var(--foreground-muted)]">
        Showing <span className="font-medium text-[var(--foreground)]">{start}–{end}</span>
        {' '}of{' '}
        <span className="font-medium text-[var(--foreground)]">
          {page.totalItems.toLocaleString()}
        </span>
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={!page.hasPreviousPage}
          onClick={() => onPageChange(page.page - 1)}
          className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--foreground-secondary)] transition hover:bg-[var(--background-subtle)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        <span className="min-w-20 text-center text-sm tabular-nums text-[var(--foreground-secondary)]">
          Page {page.page} of {page.totalPages}
        </span>

        <button
          type="button"
          disabled={!page.hasNextPage}
          onClick={() => onPageChange(page.page + 1)}
          className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--foreground-secondary)] transition hover:bg-[var(--background-subtle)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </nav>
  );
}
