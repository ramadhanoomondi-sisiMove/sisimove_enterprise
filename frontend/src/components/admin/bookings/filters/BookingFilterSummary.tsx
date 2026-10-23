
interface BookingFilterSummaryProps {
  /** Total bookings in the current result set. */
  totalBookings: number;

  /** Number of bookings currently displayed. */
  visibleBookings: number;

  /** One-based current page. */
  page: number;

  /** Requested page size. */
  pageSize: number;

  /** Whether the booking results are loading. */
  isLoading?: boolean;
}

export function BookingFilterSummary({
  totalBookings,
  visibleBookings,
  page,
  pageSize,
  isLoading = false,
}: BookingFilterSummaryProps) {
  const total = Math.max(0, totalBookings);
  const visible = Math.max(0, visibleBookings);
  const currentPage = Math.max(1, page);
  const size = Math.max(1, pageSize);

  const start = visible === 0 ? 0 : (currentPage - 1) * size + 1;
  const end = visible === 0 ? 0 : Math.min(start + visible - 1, total);

  return (
    <div
      aria-live="polite"
      className="flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-[var(--foreground-secondary)]">
        {isLoading ? (
          'Loading bookings…'
        ) : (
          <>
            Showing{' '}
            <span className="font-semibold text-[var(--foreground)]">
              {start}–{end}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-[var(--foreground)]">
              {total}
            </span>{' '}
            bookings
          </>
        )}
      </p>

      {!isLoading && (
        <p className="text-xs text-[var(--foreground-muted)]">
          Page {currentPage}
        </p>
      )}
    </div>
  );
}
