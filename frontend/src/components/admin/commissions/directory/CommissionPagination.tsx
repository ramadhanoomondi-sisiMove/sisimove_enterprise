export interface CommissionPaginationProps {
  readonly page: number;
  readonly totalPages: number;
  readonly onPageChange: (page: number) => void;
  readonly disabled?: boolean;
  readonly className?: string;
}

export function CommissionPagination({
  page,
  totalPages,
  onPageChange,
  disabled = false,
  className,
}: CommissionPaginationProps) {
  const hasPages = totalPages > 0;
  const currentPage = hasPages
    ? Math.min(Math.max(page, 1), totalPages)
    : 0;

  const canGoPrevious = hasPages && currentPage > 1;
  const canGoNext = hasPages && currentPage < totalPages;

  if (!hasPages) {
    return null;
  }

  const buttonClassName =
    'rounded-[var(--radius-md)] border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--background-subtle)] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]';

  return (
    <nav
      aria-label="Commission directory pagination"
      className={[
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <p className="text-sm text-[var(--foreground-secondary)]">
        Page{' '}
        <span className="font-semibold tabular-nums text-[var(--foreground)]">
          {currentPage}
        </span>{' '}
        of{' '}
        <span className="font-semibold tabular-nums text-[var(--foreground)]">
          {totalPages}
        </span>
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className={buttonClassName}
          disabled={disabled || !canGoPrevious}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>

        <button
          type="button"
          className={buttonClassName}
          disabled={disabled || !canGoNext}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </nav>
  );
}