// -----------------------------------------------------------------------------
// sisiMove — Journey Booking Snapshot
// -----------------------------------------------------------------------------
//
// Presentation of the immutable Journey information captured when the booking
// was created.
//
// Responsibilities:
// - Present the historical route.
// - Present the historical coordinates.
// - Present the historical departure/arrival times.
// - Present the historical timezone.
// - Present the historical vehicle information when available.
//
// Non-responsibilities:
// - Fetching the current Journey.
// - Reconstructing Journey state.
// - Editing snapshot information.
// - Booking lifecycle management.
// - Navigation.
//
// IMPORTANT:
//
// This component renders the booking-owned snapshot. It must never replace
// these values with information from the current Journey because the Journey
// may have changed after this booking was created.
//
// -----------------------------------------------------------------------------

import type { JourneyBookingSnapshot } from '@/features/journey-booking/models';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyBookingSnapshotProps {
  /**
   * Immutable journey information captured at booking time.
   */
  snapshot: JourneyBookingSnapshot;

  /**
   * Optional additional CSS classes.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyBookingSnapshot({
  snapshot,
  className,
}: JourneyBookingSnapshotProps) {
  return (
    <section
      aria-labelledby="journey-booking-snapshot-title"
      className={[
        'flex',
        'flex-col',
        'gap-5',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* -------------------------------------------------------------------
          Section heading
          ------------------------------------------------------------------- */}

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
          Journey at booking
        </p>

        <h2
          id="journey-booking-snapshot-title"
          className="mt-1 text-base font-semibold text-[var(--foreground)]"
        >
          Trip details
        </h2>
      </div>

      {/* -------------------------------------------------------------------
          Historical route
          ------------------------------------------------------------------- */}

      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="flex flex-col gap-4">
          <SnapshotLocation
            label="From"
            name={snapshot.originName}
            coordinates={snapshot.originCoordinates}
          />

          <div
            aria-hidden="true"
            className="ml-1 h-5 border-l border-dashed border-[var(--border-strong)]"
          />

          <SnapshotLocation
            label="To"
            name={snapshot.destinationName}
            coordinates={snapshot.destinationCoordinates}
          />
        </div>
      </div>

      {/* -------------------------------------------------------------------
          Historical schedule
          ------------------------------------------------------------------- */}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <SnapshotValue
          label="Departure"
          value={formatDateTime(snapshot.departureAt)}
        />

        {snapshot.arrivalAt && (
          <SnapshotValue
            label="Arrival"
            value={formatDateTime(snapshot.arrivalAt)}
          />
        )}

        <SnapshotValue
          label="Timezone"
          value={snapshot.timezone}
        />
      </div>

      {/* -------------------------------------------------------------------
          Historical vehicle
          ------------------------------------------------------------------- */}

      {snapshot.vehicle && (
        <div className="border-t border-[var(--border-subtle)] pt-5">
          <div className="mb-3">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Vehicle at booking
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {snapshot.vehicle.make && (
              <SnapshotValue
                label="Make"
                value={snapshot.vehicle.make}
              />
            )}

            {snapshot.vehicle.model && (
              <SnapshotValue
                label="Model"
                value={snapshot.vehicle.model}
              />
            )}

            {snapshot.vehicle.year !== undefined && (
              <SnapshotValue
                label="Year"
                value={String(snapshot.vehicle.year)}
              />
            )}

            {snapshot.vehicle.color && (
              <SnapshotValue
                label="Color"
                value={snapshot.vehicle.color}
              />
            )}

            {snapshot.vehicle.registration && (
              <SnapshotValue
                label="Registration"
                value={snapshot.vehicle.registration}
                mono
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}

// -----------------------------------------------------------------------------
// Location
// -----------------------------------------------------------------------------

interface SnapshotLocationProps {
  label: string;
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

function SnapshotLocation({
  label,
  name,
  coordinates,
}: SnapshotLocationProps) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <span
        aria-hidden="true"
        className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--brand)]"
      />

      <div className="min-w-0">
        <p className="text-xs font-medium text-[var(--foreground-muted)]">
          {label}
        </p>

        <p className="mt-0.5 truncate text-sm font-semibold text-[var(--foreground)]">
          {name}
        </p>

        <p className="mt-1 text-xs text-[var(--foreground-subtle)]">
          {formatCoordinates(
            coordinates.latitude,
            coordinates.longitude,
          )}
        </p>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Snapshot Value
// -----------------------------------------------------------------------------

interface SnapshotValueProps {
  label: string;
  value: string;
  mono?: boolean;
}

function SnapshotValue({
  label,
  value,
  mono = false,
}: SnapshotValueProps) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium text-[var(--foreground-muted)]">
        {label}
      </p>

      <p
        className={[
          'mt-1',
          'truncate',
          'text-sm',
          'font-medium',
          'text-[var(--foreground)]',
          mono ? 'font-mono text-xs' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        title={value}
      >
        {value}
      </p>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Formatting
// -----------------------------------------------------------------------------

function formatDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function formatCoordinates(
  latitude: number,
  longitude: number,
): string {
  return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
}