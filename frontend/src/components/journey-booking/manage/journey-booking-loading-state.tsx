
'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Booking Loading State
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Indicate that journey bookings are being loaded.
// - Provide a stable layout while booking data is unavailable.
// - Reuse shared design-system loading primitives.
//
// This component does not fetch data.
// -----------------------------------------------------------------------------

import { Skeleton, Spinner } from '@/components/ui';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyBookingLoadingStateProps {
  /**
   * Number of booking placeholders to display.
   */
  count?: number;

  /**
   * Optional message shown alongside the spinner.
   */
  message?: string;

  /**
   * Additional styling supplied by the parent component.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyBookingLoadingState({
  count = 3,
  message = 'Loading journey bookings...',
  className,
}: JourneyBookingLoadingStateProps) {
  const placeholderCount = Math.max(1, Math.floor(count));

  return (
    <section
      aria-label="Journey bookings"
      aria-busy="true"
      className={className}
    >
      <div className="mb-6 flex items-center gap-3">
        <Spinner size="md" label={message} />

        <p className="text-sm font-medium text-[var(--foreground-secondary)]">
          {message}
        </p>
      </div>

      <div className="space-y-4">
        {Array.from({ length: placeholderCount }, (_, index) => (
          <div
            key={index}
            className={[
              'rounded-[var(--radius-lg)]',
              'border border-[var(--border)]',
              'bg-[var(--surface)]',
              'p-5',
            ].join(' ')}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1 space-y-3">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-48 max-w-full" />
              </div>

              <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>

              <div className="col-span-2 space-y-2 sm:col-span-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
