// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Travel Window
// -----------------------------------------------------------------------------
//
// Detail presentation component for a Journey Demand's requested travel
// window.
//
// Responsibilities:
// - present the public Journey Demand schedule;
// - show the requested departure window;
// - show optional arrival constraints when supplied;
// - preserve the distinction between target and maximum arrival;
// - format API-provided ISO datetime values for presentation.
//
// Non-responsibilities:
// - no data fetching;
// - no mutations;
// - no schedule validation;
// - no inference of missing arrival values;
// - no calculation of scheduling rules;
// - no lifecycle logic.
//
// The backend-provided PublicJourneyDemandSchedule remains authoritative.
// -----------------------------------------------------------------------------

import type { PublicJourneyDemandSchedule } from '@/features/journey-demand/models';

import { cn } from '@/foundation';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDemandTravelWindowProps {
  /**
   * Public Journey Demand schedule.
   */
  readonly schedule: PublicJourneyDemandSchedule;

  /**
   * Controls presentation density.
   */
  readonly emphasis?: 'compact' | 'default';

  /**
   * Optional additional classes.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function parseScheduleDate(value: string): Date {
  return new Date(value);
}

function formatDateTime(
  value: string,
  timezone: string,
): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: timezone,
  }).format(parseScheduleDate(value));
}

function formatTime(
  value: string,
  timezone: string,
): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone,
  }).format(parseScheduleDate(value));
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandTravelWindow({
  schedule,
  emphasis = 'default',
  className,
}: JourneyDemandTravelWindowProps) {
  const {
    earliestDeparture,
    latestDeparture,
    targetArrival,
    maximumArrival,
    timezone,
  } = schedule;

  const isCompact = emphasis === 'compact';

  const earliestDate = parseScheduleDate(
    earliestDeparture,
  );

  const latestDate = parseScheduleDate(
    latestDeparture,
  );

  const isSameDepartureDate =
    earliestDate.toLocaleDateString(undefined, {
      timeZone: timezone,
    }) ===
    latestDate.toLocaleDateString(undefined, {
      timeZone: timezone,
    });

  const departureLabel = isSameDepartureDate
    ? `${formatDateTime(earliestDeparture, timezone)} – ${formatTime(
        latestDeparture,
        timezone,
      )}`
    : `${formatDateTime(earliestDeparture, timezone)} – ${formatDateTime(
        latestDeparture,
        timezone,
      )}`;

  const hasTargetArrival = targetArrival !== null;
  const hasMaximumArrival = maximumArrival !== null;

  return (
    <section
      aria-labelledby="journey-demand-travel-window-heading"
      className={cn('min-w-0', className)}
    >
      <div
        className={cn(
          'mb-3',
          'text-xs',
          'font-medium',
          'uppercase',
          'tracking-wide',
          'text-[var(--foreground-muted)]',
        )}
      >
        <h2 id="journey-demand-travel-window-heading">
          Travel window
        </h2>
      </div>

      <dl
        className={cn(
          'grid',
          'min-w-0',
          'grid-cols-1',
          'gap-3',
          'sm:grid-cols-2',
        )}
      >
        {/* ----------------------------------------------------------------- */}
        {/* Departure                                                         */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={cn(
            'min-w-0',
            'rounded-[var(--radius-lg)]',
            'border',
            'border-[var(--border-subtle)]',
            'bg-[var(--surface)]',
            isCompact ? 'p-3' : 'p-4',
          )}
        >
          <dt
            className={cn(
              'text-xs',
              'text-[var(--foreground-muted)]',
            )}
          >
            Departure
          </dt>

          <dd
            className={cn(
              'mt-1',
              isCompact
                ? 'text-sm font-medium'
                : 'text-base font-semibold',
              'text-[var(--foreground)]',
            )}
          >
            {departureLabel}
          </dd>

          {!isSameDepartureDate && (
            <div
              className={cn(
                'mt-1',
                'text-xs',
                'text-[var(--foreground-muted)]',
              )}
            >
              Flexible departure window
            </div>
          )}
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Arrival                                                           */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={cn(
            'min-w-0',
            'rounded-[var(--radius-lg)]',
            'border',
            'border-[var(--border-subtle)]',
            'bg-[var(--surface)]',
            isCompact ? 'p-3' : 'p-4',
          )}
        >
          <dt
            className={cn(
              'text-xs',
              'text-[var(--foreground-muted)]',
            )}
          >
            Arrival
          </dt>

          {hasTargetArrival && (
            <dd
              className={cn(
                'mt-1',
                isCompact
                  ? 'text-sm font-medium'
                  : 'text-base font-semibold',
                'text-[var(--foreground)]',
              )}
            >
              Target: {formatDateTime(targetArrival, timezone)}
            </dd>
          )}

          {hasTargetArrival && hasMaximumArrival && (
            <div
              className={cn(
                'mt-1',
                'text-xs',
                'text-[var(--foreground-muted)]',
              )}
            >
              Latest acceptable:{' '}
              {formatDateTime(maximumArrival, timezone)}
            </div>
          )}

          {!hasTargetArrival && hasMaximumArrival && (
            <dd
              className={cn(
                'mt-1',
                isCompact
                  ? 'text-sm font-medium'
                  : 'text-base font-semibold',
                'text-[var(--foreground)]',
              )}
            >
              Latest acceptable:{' '}
              {formatDateTime(maximumArrival, timezone)}
            </dd>
          )}

          {!hasTargetArrival && !hasMaximumArrival && (
            <dd
              className={cn(
                'mt-1',
                'text-sm',
                'text-[var(--foreground-muted)]',
              )}
            >
              No arrival constraint specified
            </dd>
          )}
        </div>
      </dl>
    </section>
  );
}