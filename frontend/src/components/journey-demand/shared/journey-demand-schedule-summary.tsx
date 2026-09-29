// src/features/journey-demands/components/shared/journey-demand-schedule-summary.tsx

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Schedule Summary
// -----------------------------------------------------------------------------
//
// Presents public Journey Demand schedule facts.
//
// Departure:
// - earliestDeparture → latestDeparture
//
// Arrival:
// - targetArrival is the preferred/target arrival time;
// - maximumArrival is the latest acceptable arrival constraint.
//
// A null arrival value means that constraint is absent.
// The component preserves that absence rather than substituting or deriving
// another value.
//
// This component does NOT:
// - calculate duration;
// - determine schedule flexibility;
// - infer business state;
// - modify schedule values.
//
// Marketplace presentation:
// - Departure window is the primary schedule fact.
// - Compact enough for the marketplace card.
// - Arrival constraints remain secondary.
// - Does not introduce a nested surface.
// -----------------------------------------------------------------------------

import type { PublicJourneyDemandSchedule } from '@/features/journey-demand/models';

import { cn, formatTime } from '@/foundation';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDemandScheduleSummaryProps {
  readonly schedule: PublicJourneyDemandSchedule;
  readonly emphasis?: 'compact' | 'default';
  readonly showArrival?: boolean;
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandScheduleSummary({
  schedule,
  emphasis = 'default',
  showArrival = false,
  className,
}: JourneyDemandScheduleSummaryProps) {
  const isCompact = emphasis === 'compact';

  const departureWindow = [
    formatTime(schedule.earliestDeparture),
    formatTime(schedule.latestDeparture),
  ].join(' – ');

  const targetArrival = schedule.targetArrival;
  const maximumArrival = schedule.maximumArrival;

  const hasTargetArrival = targetArrival !== null;
  const hasMaximumArrival = maximumArrival !== null;
  const hasArrivalConstraint =
    hasTargetArrival || hasMaximumArrival;

  return (
    <div
      className={cn(
        'min-w-0',
        className,
      )}
    >
      <dl
        className={cn(
          'flex min-w-0 items-center',
          isCompact ? 'gap-2' : 'gap-3',
        )}
      >
        {/* -----------------------------------------------------------------
            Departure
            ----------------------------------------------------------------- */}

        <div className="min-w-0">
          <dt className="sr-only">
            Departure window
          </dt>

          <dd
            className={cn(
              'truncate font-semibold leading-tight',
              'text-[var(--foreground)]',
              isCompact ? 'text-xs' : 'text-sm',
            )}
          >
            {departureWindow}
          </dd>
        </div>

        {/* -----------------------------------------------------------------
            Arrival constraints
            ----------------------------------------------------------------- */}

        {showArrival && hasArrivalConstraint && (
          <>
            <span
              aria-hidden="true"
              className="shrink-0 text-[var(--foreground-subtle)]"
            >
              ·
            </span>

            <div
              className={cn(
                'min-w-0 truncate',
                isCompact ? 'text-[10px]' : 'text-xs',
                'text-[var(--foreground-muted)]',
              )}
            >
              {hasTargetArrival && (
                <span className="mr-2 whitespace-nowrap">
                  Target {formatTime(targetArrival)}
                </span>
              )}

              {hasMaximumArrival && (
                <span className="whitespace-nowrap">
                  Latest {formatTime(maximumArrival)}
                </span>
              )}
            </div>
          </>
        )}
      </dl>
    </div>
  );
}