
'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Booking Results
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Render a collection of journey booking cards.
// - Display the number of bookings currently shown.
// - Render an empty state when no bookings match the current view.
// - Keep collection rendering separate from fetching and filtering.
//
// This component does not fetch data or own filter state.
// -----------------------------------------------------------------------------

import { ClipboardList } from 'lucide-react';

import type { JourneyBooking } from '@/features/journey-booking';

import { JourneyBookingCard } from './journey-booking-card';
import { JourneyBookingEmptyState } from './journey-booking-empty-state';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyBookingResultsProps {
  /**
   * Bookings to display.
   *
   * The parent component is responsible for supplying the journey-scoped,
   * filtered collection.
   */
  bookings: JourneyBooking[];

  /**
   * Optional heading above the results.
   */
  title?: string;

  /**
   * Optional description below the heading.
   */
  description?: string;

  /**
   * Message displayed when the collection is empty.
   */
  emptyTitle?: string;

  /**
   * Explanation displayed when the collection is empty.
   */
  emptyDescription?: string;

  /**
   * Optional styling supplied by the parent component.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyBookingResults({
  bookings,
  title = 'Journey bookings',
  description,
  emptyTitle = 'No bookings found',
  emptyDescription =
    'There are no bookings to display for this journey and the current filters.',
  className,
}: JourneyBookingResultsProps) {
  if (bookings.length === 0) {
    return (
      <section
        aria-label={title}
        className={className}
      >
        <JourneyBookingEmptyState
          title={emptyTitle}
          description={emptyDescription}
        />
      </section>
    );
  }

  return (
    <section
      aria-labelledby="journey-booking-results-title"
      className={className}
    >
      {/* Results heading and count */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2
            id="journey-booking-results-title"
            className="text-lg font-semibold tracking-tight text-[var(--foreground)]"
          >
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-sm leading-6 text-[var(--foreground-muted)]">
              {description}
            </p>
          )}
        </div>

        <div
          aria-live="polite"
          className={[
            'inline-flex shrink-0 items-center gap-2',
            'rounded-[var(--radius-full)]',
            'border border-[var(--border)]',
            'bg-[var(--surface)]',
            'px-3 py-1.5',
            'text-sm font-medium',
            'text-[var(--foreground-secondary)]',
          ].join(' ')}
        >
          <ClipboardList
            className="size-4 text-[var(--foreground-subtle)]"
            aria-hidden="true"
          />

          <span>
            {bookings.length}{' '}
            {bookings.length === 1 ? 'booking' : 'bookings'}
          </span>
        </div>
      </div>

      {/* Booking cards */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {bookings.map((booking) => (
          <JourneyBookingCard
            key={booking.publicId}
            booking={booking}
          />
        ))}
      </div>
    </section>
  );
}
