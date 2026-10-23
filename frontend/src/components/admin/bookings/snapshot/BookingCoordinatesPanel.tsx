
'use client';

import { useState } from 'react';
import { Check, Copy, MapPin } from 'lucide-react';

import type { AdminBookingSnapshot } from '@/features/admin/bookings/models/admin-booking.model';
import { cn } from '@/foundation/utils/cn';

interface BookingCoordinatesPanelProps {
  snapshot: AdminBookingSnapshot;
  className?: string;
}

function CoordinateRow({
  label,
  latitude,
  longitude,
}: {
  label: string;
  latitude: number;
  longitude: number;
}) {
  const [copied, setCopied] = useState(false);

  const coordinates = `${latitude}, ${longitude}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(coordinates);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--background-muted)] text-[var(--brand)]">
            <MapPin aria-hidden="true" className="size-4" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--foreground)]">
              {label}
            </p>
            <p className="mt-1 break-all font-mono text-sm text-[var(--foreground-secondary)]">
              {coordinates}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Copy ${label.toLowerCase()} coordinates`}
          title={`Copy ${label.toLowerCase()} coordinates`}
          className="inline-flex shrink-0 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--foreground-secondary)] transition hover:bg-[var(--background-subtle)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
        >
          {copied ? (
            <>
              <Check aria-hidden="true" className="size-3.5" />
              Copied
            </>
          ) : (
            <>
              <Copy aria-hidden="true" className="size-3.5" />
              Copy
            </>
          )}
        </button>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-[var(--border-subtle)] pt-3">
        <div>
          <dt className="text-xs text-[var(--foreground-muted)]">
            Latitude
          </dt>
          <dd className="mt-1 font-mono text-sm tabular-nums text-[var(--foreground)]">
            {latitude}
          </dd>
        </div>

        <div>
          <dt className="text-xs text-[var(--foreground-muted)]">
            Longitude
          </dt>
          <dd className="mt-1 font-mono text-sm tabular-nums text-[var(--foreground)]">
            {longitude}
          </dd>
        </div>
      </dl>
    </div>
  );
}

export function BookingCoordinatesPanel({
  snapshot,
  className,
}: BookingCoordinatesPanelProps) {
  return (
    <section
      aria-label="Booking route coordinates"
      className={cn(
        'rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6',
        className,
      )}
    >
      <div>
        <h3 className="text-base font-semibold text-[var(--foreground)]">
          Route coordinates
        </h3>
        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Recorded geographic coordinates for the booked journey.
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CoordinateRow
          label="Origin"
          latitude={snapshot.originCoordinates.latitude}
          longitude={snapshot.originCoordinates.longitude}
        />

        <CoordinateRow
          label="Destination"
          latitude={snapshot.destinationCoordinates.latitude}
          longitude={snapshot.destinationCoordinates.longitude}
        />
      </div>

      <p className="mt-4 text-xs leading-5 text-[var(--foreground-muted)]">
        These are the coordinates stored with the booking snapshot. They are
        not a live vehicle location.
      </p>
    </section>
  );
}

export type { BookingCoordinatesPanelProps };
