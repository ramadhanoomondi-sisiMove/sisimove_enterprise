// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Schedule
// -----------------------------------------------------------------------------
//
// Presentation component for the schedule portion of a public Journey Demand.
//
// The component receives already-resolved schedule values. It does not fetch
// data, perform matching, or apply Journey Demand business rules.
//
// ISO-8601 values are formatted only for presentation.
//
// -----------------------------------------------------------------------------

import type { HTMLAttributes } from 'react';

import { cn } from '../../../foundation/utils/cn';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDemandScheduleProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  earliestDeparture: string;
  latestDeparture: string;
  timezone?: string | null;
}

// -----------------------------------------------------------------------------
// Date Formatting
// -----------------------------------------------------------------------------

function formatDepartureWindow(
  earliestDeparture: string,
  latestDeparture: string,
  timezone?: string | null,
): string {
  const earliest = new Date(earliestDeparture);
  const latest = new Date(latestDeparture);

  if (
    Number.isNaN(earliest.getTime()) ||
    Number.isNaN(latest.getTime())
  ) {
    return 'Flexible departure';
  }

  const formatter = new Intl.DateTimeFormat('en-KE', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone || undefined,
  });

  const formattedEarliest = formatter.format(earliest);
  const formattedLatest = formatter.format(latest);

  if (formattedEarliest === formattedLatest) {
    return formattedEarliest;
  }

  return `${formattedEarliest} – ${formattedLatest}`;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandSchedule({
  earliestDeparture,
  latestDeparture,
  timezone,
  className,
  ...props
}: JourneyDemandScheduleProps) {
  const scheduleLabel = formatDepartureWindow(
    earliestDeparture,
    latestDeparture,
    timezone,
  );

  return (
    <div
      className={cn('flex min-w-0 items-start gap-3', className)}
      {...props}
    >
      <span
        aria-hidden="true"
        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-600"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-4 w-4"
        >
          <circle cx="12" cy="12" r="8.5" />
          <path
            strokeLinecap="round"
            d="M12 7.5v5l3.25 2"
          />
        </svg>
      </span>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          Departure
        </p>

        <p className="mt-1 text-sm font-medium text-neutral-950">
          {scheduleLabel}
        </p>
      </div>
    </div>
  );
}