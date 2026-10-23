
'use client';

/**
 * sisiMove — Journey Bookings Panel
 *
 * Presents booking records associated with a specific journey.
 *
 * Responsibilities:
 * - Scope supplied bookings to the selected journey.
 * - Display a booking count and optional API total.
 * - Compose JourneyBookingTable.
 * - Handle loading and empty states.
 *
 * This component does not fetch, create, cancel, or modify bookings.
 */

import { useMemo } from 'react';
import { ClipboardList, Users } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';
import type { JourneyBooking } from '@/features/admin/journeys/models/journey-booking.model';
import type { Journey } from '@/features/admin/journeys/models/journey.model';

import JourneyBookingTable from './JourneyBookingTable';

export interface JourneyBookingsPanelProps {
  journey: Pick<Journey, 'publicId'>;
  bookings: readonly JourneyBooking[];
  total?: number;
  loading?: boolean;
  className?: string;
}

export default function JourneyBookingsPanel({
  journey,
  bookings,
  total,
  loading = false,
  className,
}: JourneyBookingsPanelProps) {
  const journeyBookings = useMemo(
    () =>
      bookings.filter(
        (booking) => booking.journeyPublicId === journey.publicId,
      ),
    [bookings, journey.publicId],
  );

  const displayedTotal =
    total !== undefined && Number.isFinite(total) && total >= 0
      ? total
      : journeyBookings.length;

  return (
    <section
      aria-labelledby="journey-bookings-heading"
      className={cn('min-w-0 space-y-4', className)}
    >
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]">
            <ClipboardList aria-hidden="true" className="size-5" />
          </span>

          <div className="min-w-0">
            <h2
              id="journey-bookings-heading"
              className="text-base font-semibold text-[var(--foreground)]"
            >
              Journey bookings
            </h2>

            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              Booking records linked to this journey
            </p>
          </div>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5">
          <Users
            aria-hidden="true"
            className="size-4 text-[var(--foreground-muted)]"
          />

          <span className="text-sm font-medium tabular-nums text-[var(--foreground)]">
            {loading ? 'Loading…' : displayedTotal}
          </span>

          <span className="text-xs text-[var(--foreground-muted)]">
            {displayedTotal === 1 ? 'booking' : 'bookings'}
          </span>
        </div>
      </header>

      {!loading && journeyBookings.length > 0 && (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--background-subtle)] px-3 py-2">
          <p className="break-all font-mono text-xs text-[var(--foreground-muted)]">
            Journey ID: {journey.publicId}
          </p>
        </div>
      )}

      <JourneyBookingTable
        bookings={journeyBookings}
        loading={loading}
      />

      {!loading && displayedTotal > journeyBookings.length && (
        <p className="text-xs text-[var(--foreground-muted)]">
          {journeyBookings.length} matching booking
          {journeyBookings.length === 1 ? '' : 's'} loaded out of{' '}
          {displayedTotal} total. Additional records may be available through
          pagination in the data layer.
        </p>
      )}
    </section>
  );
}
