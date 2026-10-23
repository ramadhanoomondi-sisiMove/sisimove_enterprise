
import {
  ArrowRight,
  CalendarClock,
  Clock3,
  MapPin,
} from 'lucide-react';

import type { AdminBookingSnapshot } from '@/features/admin/bookings/models/admin-booking.model';
import { cn } from '@/foundation/utils/cn';

interface BookingRouteSummaryProps {
  snapshot: AdminBookingSnapshot;
  className?: string;
}

function formatSnapshotDate(
  value: string | null,
  timezone: string,
): string {
  if (!value) return 'Not recorded';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return 'Not recorded';

  try {
    return new Intl.DateTimeFormat('en-KE', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: timezone,
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat('en-KE', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'UTC',
    }).format(date);
  }
}

function getDuration(
  departureAt: string,
  arrivalAt: string | null,
): string | null {
  if (!arrivalAt) return null;

  const departure = new Date(departureAt).getTime();
  const arrival = new Date(arrivalAt).getTime();

  if (
    !Number.isFinite(departure) ||
    !Number.isFinite(arrival) ||
    arrival < departure
  ) {
    return null;
  }

  const totalMinutes = Math.round((arrival - departure) / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} hr`;

  return `${hours} hr ${minutes} min`;
}

export function BookingRouteSummary({
  snapshot,
  className,
}: BookingRouteSummaryProps) {
  const duration = getDuration(
    snapshot.departureAt,
    snapshot.arrivalAt,
  );

  return (
    <section
      aria-label="Historical booking route"
      className={cn(
        'overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)]',
        className,
      )}
    >
      <div className="border-b border-[var(--border-subtle)] bg-[var(--background-subtle)] px-5 py-4 sm:px-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
          <MapPin
            aria-hidden="true"
            className="size-4 text-[var(--brand)]"
          />
          Route captured for this booking
        </div>
        <p className="mt-1 text-xs text-[var(--foreground-muted)]">
          Historical journey details stored with the booking.
        </p>
      </div>

      <div className="grid gap-6 p-5 sm:p-6 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            <span className="size-2 rounded-full bg-[var(--success)]" />
            Origin
          </div>

          <p className="mt-2 break-words text-lg font-semibold text-[var(--foreground)]">
            {snapshot.originName || 'Origin not recorded'}
          </p>

          <p className="mt-2 text-sm text-[var(--foreground-secondary)]">
            Departure
          </p>

          <div className="mt-1 flex items-start gap-2 text-sm font-medium text-[var(--foreground)]">
            <CalendarClock
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-[var(--foreground-muted)]"
            />
            <time dateTime={snapshot.departureAt}>
              {formatSnapshotDate(
                snapshot.departureAt,
                snapshot.timezone,
              )}
            </time>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-[var(--brand)] md:flex-col">
          <div className="hidden h-px w-10 bg-[var(--border-strong)] md:block" />
          <ArrowRight
            aria-hidden="true"
            className="size-5"
          />
          <div className="hidden h-px w-10 bg-[var(--border-strong)] md:block" />

          {duration && (
            <span className="text-xs font-medium text-[var(--foreground-secondary)]">
              {duration}
            </span>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            <span className="size-2 rounded-full bg-[var(--danger)]" />
            Destination
          </div>

          <p className="mt-2 break-words text-lg font-semibold text-[var(--foreground)]">
            {snapshot.destinationName || 'Destination not recorded'}
          </p>

          <p className="mt-2 text-sm text-[var(--foreground-secondary)]">
            Arrival
          </p>

          <div className="mt-1 flex items-start gap-2 text-sm font-medium text-[var(--foreground)]">
            <Clock3
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-[var(--foreground-muted)]"
            />
            {snapshot.arrivalAt ? (
              <time dateTime={snapshot.arrivalAt}>
                {formatSnapshotDate(
                  snapshot.arrivalAt,
                  snapshot.timezone,
                )}
              </time>
            ) : (
              <span>Not recorded</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border-subtle)] px-5 py-3 text-xs text-[var(--foreground-muted)] sm:px-6">
        <span>Snapshot timezone</span>
        <span className="font-medium text-[var(--foreground-secondary)]">
          {snapshot.timezone || 'Not specified'}
        </span>
      </div>
    </section>
  );
}

export type { BookingRouteSummaryProps };
