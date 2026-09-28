// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Corridor Summary
// -----------------------------------------------------------------------------
//
// Read-only presentation of a Journey Demand's public corridor.
//
// Architecture:
// - Consumes the public Journey Demand route projection.
// - Does not fetch data.
// - Does not mutate data.
// - Does not calculate distance, duration, ETA, or route geometry.
// - Does not reconstruct backend corridor/domain objects.
// - Origin and destination are rendered here.
// - Waypoint presentation is delegated to JourneyDemandWaypoints (098).
//
// The corridor feature is intentionally split:
//
//   096 — corridor summary/composition
//   097 — individual waypoint presentation
//   098 — waypoint collection
//   099 — corridor editor
//   100 — waypoint editor
//
// Public detail boundary:
// - 096/097/098 consume public Journey Demand projections.
// - Editor components 099/100 consume the authenticated Journey Demand models.
//
// This distinction prevents public presentation components from requiring
// internal fields such as createdAt, updatedAt, or backend persistence IDs.
//
// -----------------------------------------------------------------------------

import type { PublicJourneyDemandRoute } from '@/features/journey-demand/models';
import { cn } from '@/foundation';

import { JourneyDemandWaypoints } from './journey-demand-waypoints';

export interface JourneyDemandCorridorSummaryProps {
  readonly route: PublicJourneyDemandRoute;
  readonly emphasis?: 'compact' | 'default';
  readonly className?: string;
}

export function JourneyDemandCorridorSummary({
  route,
  emphasis = 'default',
  className,
}: JourneyDemandCorridorSummaryProps) {
  const isCompact = emphasis === 'compact';

  return (
    <section
      className={cn(
        'surface',
        isCompact ? 'p-4' : 'p-5',
        className,
      )}
      aria-labelledby="journey-demand-corridor-summary-heading"
    >
      <div className="min-w-0">
        <h2
          id="journey-demand-corridor-summary-heading"
          className={cn(
            'font-semibold text-foreground',
            isCompact ? 'text-sm' : 'text-base',
          )}
        >
          Travel route
        </h2>

        <div
          className={cn(
            'mt-4 grid min-w-0 items-center gap-4',
            isCompact
              ? 'grid-cols-1 sm:grid-cols-2'
              : 'grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]',
          )}
        >
          <Location
            label="From"
            name={route.origin.name}
            emphasis={emphasis}
          />

          <div
            className={cn(
              'hidden items-center justify-center text-foreground-subtle',
              !isCompact && 'sm:flex',
            )}
            aria-hidden="true"
          >
            →
          </div>

          <Location
            label="To"
            name={route.destination.name}
            emphasis={emphasis}
          />
        </div>
      </div>

      {route.waypoints.length > 0 ? (
        <div className="mt-5 border-t border-[var(--border-subtle)] pt-4">
          <JourneyDemandWaypoints
            waypoints={route.waypoints}
            emphasis={emphasis}
          />
        </div>
      ) : null}
    </section>
  );
}

// -----------------------------------------------------------------------------
// Location
// -----------------------------------------------------------------------------

interface LocationProps {
  readonly label: string;
  readonly name: string;
  readonly emphasis: 'compact' | 'default';
}

function Location({
  label,
  name,
  emphasis,
}: LocationProps) {
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
          'mt-1 truncate font-semibold text-foreground',
          emphasis === 'compact' ? 'text-sm' : 'text-base',
        )}
      >
        {name}
      </p>
    </div>
  );
}

