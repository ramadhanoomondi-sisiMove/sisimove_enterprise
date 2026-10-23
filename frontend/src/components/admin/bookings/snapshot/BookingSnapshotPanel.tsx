
import { Camera, ShieldCheck } from 'lucide-react';

import type { AdminBookingSnapshot } from '@/features/admin/bookings/models/admin-booking.model';
import { cn } from '@/foundation/utils/cn';

import { BookingRouteSummary } from './BookingRouteSummary';
import { BookingCoordinatesPanel } from './BookingCoordinatesPanel';
import { BookingVehicleSnapshot } from './BookingVehicleSnapshot';

interface BookingSnapshotPanelProps {
  snapshot: AdminBookingSnapshot | null;
  className?: string;
}

export function BookingSnapshotPanel({
  snapshot,
  className,
}: BookingSnapshotPanelProps) {
  return (
    <section
      aria-labelledby="booking-snapshot-heading"
      className={cn('space-y-5', className)}
    >
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--brand-soft)] text-[var(--brand)]">
            <Camera aria-hidden="true" className="size-5" />
          </div>

          <div className="min-w-0">
            <h2
              id="booking-snapshot-heading"
              className="text-lg font-semibold tracking-tight text-[var(--foreground)]"
            >
              Booking snapshot
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--foreground-secondary)]">
              The journey, location, and vehicle details preserved with this
              booking for historical reference.
            </p>
          </div>
        </div>

        <div className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background-subtle)] px-3 py-1.5 text-xs font-medium text-[var(--foreground-secondary)]">
          <ShieldCheck aria-hidden="true" className="size-3.5" />
          Historical record
        </div>
      </header>

      {!snapshot ? (
        <div className="rounded-[var(--radius-xl)] border border-dashed border-[var(--border-strong)] bg-[var(--background-subtle)] px-5 py-10 text-center">
          <Camera
            aria-hidden="true"
            className="mx-auto size-9 text-[var(--foreground-muted)]"
          />
          <h3 className="mt-3 text-sm font-semibold text-[var(--foreground)]">
            Snapshot unavailable
          </h3>
          <p className="mx-auto mt-1 max-w-lg text-sm leading-6 text-[var(--foreground-secondary)]">
            No historical journey snapshot is attached to this booking record.
            The original route and vehicle details cannot be displayed here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <BookingRouteSummary snapshot={snapshot} />

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <BookingCoordinatesPanel snapshot={snapshot} />
            <BookingVehicleSnapshot vehicle={snapshot.vehicle} />
          </div>
        </div>
      )}
    </section>
  );
}

export type { BookingSnapshotPanelProps };
