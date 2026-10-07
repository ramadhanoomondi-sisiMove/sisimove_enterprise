// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Corridor Summary
// -----------------------------------------------------------------------------
//
// Read-only presentation of a Journey Demand corridor.
//
// Responsibilities:
// - Render the supplied corridor projection.
// - Present origin and destination.
// - Delegate waypoint collection presentation to JourneyDemandWaypoints.
//
// This component does NOT:
// - fetch data;
// - mutate data;
// - calculate distance, duration, ETA, or route geometry;
// - reconstruct backend domain objects;
// - modify waypoint ordering;
// - edit corridor data;
// - own corridor persistence.
//
// The backend-projected JourneyDemandCorridor is consumed directly.
//
// Presentation hierarchy:
//
//     JourneyDemandCorridor
//            ↓
//     JourneyDemandCorridorSummary
//            ↓
//     JourneyDemandWaypoints
//            ↓
//     JourneyDemandWaypointItem
//
// Editable corridor workflows are separate and use
// JourneyDemandCorridorEditor.
//
// -----------------------------------------------------------------------------

import type { JourneyDemandCorridor } from '@/features/journey-demand/models';
import { cn } from '@/foundation';

import { JourneyDemandWaypoints } from './journey-demand-waypoints';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type JourneyDemandCorridorSummaryEmphasis =
  | 'compact'
  | 'default';

export interface JourneyDemandCorridorSummaryProps {
  /**
   * Backend-projected Journey Demand corridor.
   *
   * The summary consumes this representation directly and does not reconstruct
   * another route model for presentation.
   */
  readonly corridor: JourneyDemandCorridor;

  /**
   * Presentation density.
   */
  readonly emphasis?: JourneyDemandCorridorSummaryEmphasis;

  /**
   * Optional additional class names.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandCorridorSummary({
  corridor,
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
      {/* -----------------------------------------------------------------------
          Route
      ----------------------------------------------------------------------- */}

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
            name={corridor.originName}
            emphasis={emphasis}
          />

          {/* -------------------------------------------------------------------
              Route direction marker
          ------------------------------------------------------------------- */}

          <div
            className={cn(
              'hidden items-center justify-center',
              'text-foreground-subtle',
              !isCompact && 'sm:flex',
            )}
            aria-hidden="true"
          >
            →
          </div>

          <Location
            label="To"
            name={corridor.destinationName}
            emphasis={emphasis}
          />
        </div>
      </div>

      {/* -----------------------------------------------------------------------
          Waypoints
          
          The supplied waypoint collection is already backend ordered.
          JourneyDemandWaypoints preserves that order and delegates individual
          rendering to JourneyDemandWaypointItem.
      ----------------------------------------------------------------------- */}

      {corridor.waypoints.length > 0 ? (
        <div className="mt-5 border-t border-[var(--border-subtle)] pt-4">
          <JourneyDemandWaypoints
            waypoints={corridor.waypoints}
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
  readonly emphasis: JourneyDemandCorridorSummaryEmphasis;
}

function Location({
  label,
  name,
  emphasis,
}: LocationProps) {
  const isCompact = emphasis === 'compact';

  return (
    <div className="min-w-0">
      <p
        className={cn(
          'text-foreground-muted',
          isCompact ? 'text-xs' : 'text-sm',
        )}
      >
        {label}
      </p>

      <p
        className={cn(
          'mt-1 truncate font-semibold text-foreground',
          isCompact ? 'text-sm' : 'text-base',
        )}
      >
        {name}
      </p>
    </div>
  );
}