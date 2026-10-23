
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';

interface BookingLoadingStateProps {
  /** Display the loading state as a full-page section or compact panel. */
  variant?: 'page' | 'compact';

  /** Optional loading message. */
  message?: string;

  /** Number of placeholder booking rows to display. */
  rows?: number;

  /** Additional CSS classes. */
  className?: string;
}

export function BookingLoadingState({
  variant = 'page',
  message = 'Loading bookings…',
  rows = 5,
  className,
}: BookingLoadingStateProps) {
  const rowCount = Math.max(1, Math.floor(rows));

  if (variant === 'compact') {
    return (
      <div
        role="status"
        aria-label={message}
        className={`flex items-center justify-center gap-3 py-6 text-sm text-[var(--foreground-muted)] ${className ?? ''}`}
      >
        <Spinner size="md" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <section
      aria-label="Booking loading state"
      aria-busy="true"
      className={`space-y-5 ${className ?? ''}`}
    >
      <div className="flex items-center gap-3">
        <Spinner size="md" />
        <p className="text-sm text-[var(--foreground-secondary)]">
          {message}
        </p>
      </div>

      <div className="surface space-y-4 p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-16" />
            </div>
          ))}
        </div>

        <div className="space-y-3 border-t border-[var(--border-subtle)] pt-4">
          {Array.from({ length: rowCount }, (_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 border-b border-[var(--border-subtle)] py-3 last:border-b-0"
            >
              <Skeleton radius="full" className="h-9 w-9 shrink-0" />

              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-3 w-32 max-w-full" />
                <Skeleton className="h-3 w-48 max-w-full" />
              </div>

              <Skeleton className="h-6 w-20 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
