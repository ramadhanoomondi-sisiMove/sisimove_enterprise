
'use client';

/**
 * sisiMove — Journey Schedule Panel
 *
 * Presents the scheduled departure and arrival alongside recorded
 * journey lifecycle timestamps.
 *
 * Responsibilities:
 * - Display departure and arrival details.
 * - Show the schedule timezone.
 * - Compose the reusable journey timeline.
 * - Handle missing or invalid schedule values gracefully.
 *
 * This component is presentation-only. It does not update schedules
 * or change journey lifecycle state.
 */

import { useMemo } from 'react';
import {
  CalendarClock,
  Clock3,
  Globe2,
  Hourglass,
} from 'lucide-react';

import { cn } from '@/foundation/utils/cn';
import type { Journey } from '@/features/admin/journeys/models/journey.model';

import JourneyTimeline from './JourneyTimeline';

export interface JourneySchedulePanelProps {
  journey: Journey;
  className?: string;
  timezone?: string;
  showTimeline?: boolean;
}

function formatDateTime(
  value: string | null | undefined,
  timezone: string,
): string | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: timezone,
    }).format(date);
  } catch {
    return null;
  }
}

function ScheduleDetail({
  label,
  value,
  timezone,
  icon: Icon,
}: {
  label: string;
  value: string | null | undefined;
  timezone: string;
  icon: typeof CalendarClock;
}) {
  const formattedValue = formatDateTime(value, timezone);

  return (
    <div className="min-w-0 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
        <Icon aria-hidden="true" className="size-4 shrink-0" />
        <p className="text-xs font-medium uppercase tracking-wide">
          {label}
        </p>
      </div>

      {formattedValue ? (
        <time
          dateTime={value ?? undefined}
          className="mt-3 block break-words text-sm font-semibold text-[var(--foreground)]"
        >
          {formattedValue}
        </time>
      ) : (
        <p className="mt-3 text-sm text-[var(--foreground-muted)]">
          {value ? 'Invalid date or timezone' : 'Not specified'}
        </p>
      )}

      <p className="mt-2 break-words text-xs text-[var(--foreground-muted)]">
        {timezone}
      </p>
    </div>
  );
}

export default function JourneySchedulePanel({
  journey,
  className,
  timezone,
  showTimeline = true,
}: JourneySchedulePanelProps) {
  const journeyTimezone =
    timezone || journey.schedule.timezone || 'UTC';

  const scheduleDuration = useMemo(() => {
    const departure = new Date(journey.schedule.departureAt).getTime();
    const arrival = journey.schedule.arrivalAt
      ? new Date(journey.schedule.arrivalAt).getTime()
      : Number.NaN;

    if (
      !Number.isFinite(departure) ||
      !Number.isFinite(arrival) ||
      arrival < departure
    ) {
      return null;
    }

    const totalMinutes = Math.round((arrival - departure) / 60_000);
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;

    return [
      days > 0 ? `${days}d` : null,
      hours > 0 ? `${hours}h` : null,
      minutes > 0 ? `${minutes}m` : null,
    ]
      .filter(Boolean)
      .join(' ') || 'Less than a minute';
  }, [journey.schedule.departureAt, journey.schedule.arrivalAt]);

  return (
    <section
      aria-labelledby="journey-schedule-heading"
      className={cn('min-w-0 space-y-5', className)}
    >
      <header className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]">
          <CalendarClock aria-hidden="true" className="size-5" />
        </span>

        <div className="min-w-0">
          <h2
            id="journey-schedule-heading"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Schedule details
          </h2>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Departure, arrival, and journey timeline
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ScheduleDetail
          label="Scheduled departure"
          value={journey.schedule.departureAt}
          timezone={journeyTimezone}
          icon={CalendarClock}
        />

        <ScheduleDetail
          label="Scheduled arrival"
          value={journey.schedule.arrivalAt}
          timezone={journeyTimezone}
          icon={Clock3}
        />
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--background-subtle)] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <Globe2
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-[var(--foreground-muted)]"
          />

          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--foreground)]">
              Schedule timezone
            </p>

            <p className="mt-1 break-words text-sm text-[var(--foreground-muted)]">
              {journeyTimezone}
            </p>
          </div>
        </div>

        <div className="flex min-w-0 items-start gap-3 sm:max-w-[50%]">
          <Hourglass
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-[var(--foreground-muted)]"
          />

          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--foreground)]">
              Planned duration
            </p>

            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              {scheduleDuration ?? 'Unavailable'}
            </p>
          </div>
        </div>
      </div>

      {showTimeline && <JourneyTimeline journey={journey} timezone={journeyTimezone} />}
    </section>
  );
}
