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
// -----------------------------------------------------------------------------

import type { PublicJourneyDemandSchedule } from '@/features/journey-demand/models';

import { formatTime } from '@/foundation';
import { cn } from '@/foundation';

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
    <div className={cn('min-w-0', className)}>
      <dl
        className={cn(
          'flex min-w-0 flex-col',
          isCompact ? 'gap-1' : 'gap-1.5',
        )}
      >
        <div className="min-w-0">
          <dt className="sr-only">
            Departure window
          </dt>

          <dd
            className={cn(
              'text-foreground',
              isCompact
                ? 'text-sm font-medium'
                : 'text-sm font-semibold',
            )}
          >
            {departureWindow}
          </dd>
        </div>

        {showArrival && hasArrivalConstraint && (
          <>
            {hasTargetArrival && (
              <div className="min-w-0">
                <dt className="sr-only">
                  Target arrival
                </dt>

                <dd
                  className={cn(
                    'text-foreground-muted',
                    isCompact ? 'text-xs' : 'text-sm',
                  )}
                >
                  Target arrival {formatTime(targetArrival)}
                </dd>
              </div>
            )}

            {hasMaximumArrival && (
              <div className="min-w-0">
                <dt className="sr-only">
                  Latest acceptable arrival
                </dt>

                <dd
                  className={cn(
                    'text-foreground-muted',
                    isCompact ? 'text-xs' : 'text-sm',
                  )}
                >
                  Latest arrival {formatTime(maximumArrival)}
                </dd>
              </div>
            )}
          </>
        )}
      </dl>
    </div>
  );
}
