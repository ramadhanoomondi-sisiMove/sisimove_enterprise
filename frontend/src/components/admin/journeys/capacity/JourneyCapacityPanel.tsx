
'use client';

/**
 * sisiMove — Journey Capacity Panel
 *
 * Displays the passenger seat capacity recorded for a journey.
 *
 * Responsibilities:
 * - Present total, booked, and available seats.
 * - Visualize seat occupancy.
 * - Identify inconsistent capacity values without silently correcting them.
 * - Handle missing or invalid capacity values gracefully.
 *
 * This component is presentation-only. It does not book seats or modify capacity.
 */

import {
  Armchair,
  CheckCircle2,
  CircleAlert,
  Users,
} from 'lucide-react';

import { cn } from '@/foundation/utils/cn';
import type { Journey } from '@/features/admin/journeys/models/journey.model';

export interface JourneyCapacityPanelProps {
  journey: Pick<Journey, 'capacity'>;
  className?: string;
  compact?: boolean;
}

function CapacityMetric({
  label,
  value,
  icon: Icon,
  description,
}: {
  label: string;
  value: string;
  icon: typeof Armchair;
  description: string;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
        <Icon aria-hidden="true" className="size-4 shrink-0" />
        <p className="text-xs font-medium">{label}</p>
      </div>

      <p className="mt-3 text-2xl font-semibold tabular-nums text-[var(--foreground)]">
        {value}
      </p>

      <p className="mt-1 text-xs text-[var(--foreground-muted)]">
        {description}
      </p>
    </div>
  );
}

export default function JourneyCapacityPanel({
  journey,
  className,
  compact = false,
}: JourneyCapacityPanelProps) {
  const { totalSeats, bookedSeats, availableSeats } = journey.capacity;

  const valuesAreValid =
    Number.isFinite(totalSeats) &&
    Number.isFinite(bookedSeats) &&
    Number.isFinite(availableSeats) &&
    totalSeats >= 0 &&
    bookedSeats >= 0 &&
    availableSeats >= 0;

  const capacityIsConsistent =
    valuesAreValid &&
    bookedSeats + availableSeats === totalSeats;

  const occupancyPercentage =
    valuesAreValid && totalSeats > 0
      ? Math.min(100, (bookedSeats / totalSeats) * 100)
      : null;

  const formatSeats = (value: number) =>
    Number.isFinite(value) ? String(value) : '—';

  return (
    <section
      aria-labelledby="journey-capacity-heading"
      className={cn('min-w-0 space-y-4', className)}
    >
      <header className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]">
          <Armchair aria-hidden="true" className="size-5" />
        </span>

        <div className="min-w-0">
          <h2
            id="journey-capacity-heading"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Seat capacity
          </h2>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Passenger seats recorded for this journey
          </p>
        </div>
      </header>

      <div
        className={cn(
          'grid grid-cols-1 gap-3 sm:grid-cols-3',
          compact && 'gap-2',
        )}
      >
        <CapacityMetric
          label="Total seats"
          value={formatSeats(totalSeats)}
          icon={Armchair}
          description="Journey capacity"
        />

        <CapacityMetric
          label="Booked seats"
          value={formatSeats(bookedSeats)}
          icon={Users}
          description="Seats currently booked"
        />

        <CapacityMetric
          label="Available seats"
          value={formatSeats(availableSeats)}
          icon={CheckCircle2}
          description="Seats recorded as available"
        />
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium text-[var(--foreground)]">
            Seat occupancy
          </p>

          <p className="text-sm font-semibold tabular-nums text-[var(--foreground)]">
            {occupancyPercentage !== null
              ? `${occupancyPercentage.toFixed(1)}%`
              : 'Unavailable'}
          </p>
        </div>

        <div
          role="progressbar"
          aria-label="Seat occupancy"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={occupancyPercentage ?? undefined}
          aria-valuetext={
            occupancyPercentage !== null
              ? `${occupancyPercentage.toFixed(1)} percent occupied`
              : 'Occupancy unavailable'
          }
          className="mt-3 h-2.5 overflow-hidden rounded-full bg-[var(--background-subtle)]"
        >
          <div
            className="h-full rounded-full bg-[var(--brand)] transition-[width]"
            style={{
              width: `${occupancyPercentage ?? 0}%`,
            }}
          />
        </div>

        {occupancyPercentage === null && (
          <p className="mt-2 text-xs text-[var(--foreground-muted)]">
            Occupancy cannot be calculated because capacity values are invalid
            or total seats are zero.
          </p>
        )}
      </div>

      {!capacityIsConsistent && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-[var(--warning)]/30 bg-[var(--warning-soft)] p-4"
        >
          <CircleAlert
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0 text-[var(--warning)]"
          />

          <div>
            <p className="text-sm font-medium text-[var(--foreground)]">
              Capacity values need verification
            </p>

            <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
              {valuesAreValid
                ? 'Booked seats plus available seats do not equal total seats.'
                : 'One or more seat values are negative or invalid.'}{' '}
              Check the recorded capacity before relying on these figures.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
