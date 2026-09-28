// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Schedule Summary
// -----------------------------------------------------------------------------
//
// Read-only presentation of a public Journey Demand schedule.
//
// Architecture:
// - Consumes PublicJourneyDemandSchedule.
// - Does not fetch data.
// - Does not mutate data.
// - Does not reconstruct schedule semantics.
// - Does not calculate duration.
// - Does not convert a flexible departure window into a single departure time.
// - Preserves optional arrival constraints exactly as supplied by the API.
//
// Public schedule values are ISO-8601 strings. Presentation formatting is
// delegated to the shared foundation formatters.
//
// The public model intentionally differs from the authenticated
// JourneyDemandSchedule model:
//
//   PublicJourneyDemandSchedule
//     -> public marketplace/detail presentation
//
//   JourneyDemandSchedule
//     -> authenticated/editor presentation and management
//
// -----------------------------------------------------------------------------

import type { PublicJourneyDemandSchedule } from '@/features/journey-demand/models';
import { formatDate, formatTime, cn } from '@/foundation';

export interface JourneyDemandScheduleSummaryProps {
  readonly schedule: PublicJourneyDemandSchedule;
  readonly emphasis?: 'compact' | 'default';
  readonly showArrival?: boolean;
  readonly className?: string;
}

export function JourneyDemandScheduleSummary({
  schedule,
  emphasis = 'default',
  showArrival = true,
  className,
}: JourneyDemandScheduleSummaryProps) {
  const isCompact = emphasis === 'compact';

  return (
    <section
      className={cn(
        'min-w-0',
        className,
      )}
      aria-labelledby="journey-demand-schedule-summary-heading"
    >
      <div className="flex min-w-0 items-center justify-between gap-3">
        <h3
          id="journey-demand-schedule-summary-heading"
          className={cn(
            'font-semibold text-foreground',
            isCompact ? 'text-sm' : 'text-base',
          )}
        >
          Travel time
        </h3>

        <span
          className={cn(
            'shrink-0 text-foreground-muted',
            isCompact ? 'text-[11px]' : 'text-xs',
          )}
        >
          {schedule.timezone}
        </span>
      </div>

      <div
        className={cn(
          'mt-4 grid min-w-0 gap-4',
          isCompact
            ? 'grid-cols-1'
            : 'grid-cols-1 sm:grid-cols-2',
        )}
      >
        <ScheduleValue
          label="Departure window"
          value={formatDepartureWindow(schedule)}
          emphasis={emphasis}
        />

        {showArrival && hasArrivalConstraint(schedule) ? (
          <ArrivalSummary
            schedule={schedule}
            emphasis={emphasis}
          />
        ) : null}
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Departure
// -----------------------------------------------------------------------------

function formatDepartureWindow(
  schedule: PublicJourneyDemandSchedule,
): string {
  const earliest = formatTime(schedule.earliestDeparture);
  const latest = formatTime(schedule.latestDeparture);

  return `${earliest} – ${latest}`;
}

// -----------------------------------------------------------------------------
// Arrival
// -----------------------------------------------------------------------------

interface ArrivalSummaryProps {
  readonly schedule: PublicJourneyDemandSchedule;
  readonly emphasis: 'compact' | 'default';
}

function ArrivalSummary({
  schedule,
  emphasis,
}: ArrivalSummaryProps) {
  const targetArrival = schedule.targetArrival;
  const maximumArrival = schedule.maximumArrival;

  return (
    <div className="min-w-0">
      <p
        className={cn(
          'text-foreground-muted',
          emphasis === 'compact' ? 'text-xs' : 'text-sm',
        )}
      >
        Arrival
      </p>

      <div
        className={cn(
          'mt-1 min-w-0',
          emphasis === 'compact'
            ? 'text-sm'
            : 'text-base',
        )}
      >
        {targetArrival ? (
          <p className="font-semibold text-foreground">
            Target {formatDate(targetArrival)} · {formatTime(targetArrival)}
          </p>
        ) : null}

        {maximumArrival ? (
          <p
            className={cn(
              targetArrival
                ? 'mt-1 text-foreground-muted'
                : 'font-semibold text-foreground',
              emphasis === 'compact'
                ? 'text-xs'
                : 'text-sm',
            )}
          >
            Latest {formatDate(maximumArrival)} · {formatTime(maximumArrival)}
          </p>
        ) : null}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Generic schedule value
// -----------------------------------------------------------------------------

interface ScheduleValueProps {
  readonly label: string;
  readonly value: string;
  readonly emphasis: 'compact' | 'default';
}

function ScheduleValue({
  label,
  value,
  emphasis,
}: ScheduleValueProps) {
  return (
    <div className="min-w-0">
      <p
        className={cn(
          'text-foreground-muted',
          emphasis === 'compact' ? 'text-xs' : 'text-sm',
        )}
      >
        {label}
      </p>

      <p
        className={cn(
          'mt-1 font-semibold text-foreground',
          emphasis === 'compact' ? 'text-sm' : 'text-base',
        )}
      >
        {value}
      </p>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Arrival constraint
// -----------------------------------------------------------------------------

function hasArrivalConstraint(
  schedule: PublicJourneyDemandSchedule,
): boolean {
  return (
    schedule.targetArrival !== null ||
    schedule.maximumArrival !== null
  );
}

