
'use client';

/**
 * sisiMove — Journey Route Panel
 *
 * Composes the route summary, intermediate waypoints, and endpoint
 * coordinates into one reusable journey-detail panel.
 *
 * Responsibilities:
 * - Present the route overview.
 * - Display waypoints in sequence.
 * - Optionally display waypoint and endpoint coordinates.
 * - Keep route presentation consistent across admin journey views.
 *
 * This component is presentation-only. It does not modify journey data,
 * calculate routes, or fetch external map information.
 */

import { useMemo } from 'react';
import { MapPinned } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';
import type { JourneyCorridor } from '@/features/admin/journeys/models/journey.model';

import JourneyCoordinatesPanel from './JourneyCoordinatesPanel';
import JourneyRouteSummary from './JourneyRouteSummary';
import JourneyWaypointList from './JourneyWaypointList';

export interface JourneyRoutePanelProps {
  corridor: JourneyCorridor;
  className?: string;
  showCoordinates?: boolean;
  showWaypointCoordinates?: boolean;
  showWaypointCount?: boolean;
}

export default function JourneyRoutePanel({
  corridor,
  className,
  showCoordinates = true,
  showWaypointCoordinates = false,
  showWaypointCount = true,
}: JourneyRoutePanelProps) {
  const waypoints = corridor.waypoints ?? [];

  const origin = useMemo(
    () => ({
      latitude: corridor.originLatitude,
      longitude: corridor.originLongitude,
    }),
    [corridor.originLatitude, corridor.originLongitude],
  );

  const destination = useMemo(
    () => ({
      latitude: corridor.destinationLatitude,
      longitude: corridor.destinationLongitude,
    }),
    [corridor.destinationLatitude, corridor.destinationLongitude],
  );

  return (
    <section
      aria-labelledby="journey-route-panel-heading"
      className={cn('min-w-0 space-y-5', className)}
    >
      <header className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]">
          <MapPinned aria-hidden="true" className="size-5" />
        </span>

        <div className="min-w-0">
          <h2
            id="journey-route-panel-heading"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Route details
          </h2>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Origin, destination, and intermediate stops
          </p>
        </div>
      </header>

      <JourneyRouteSummary
        corridor={corridor}
        showWaypointCount={showWaypointCount}
      />

      <JourneyWaypointList
        waypoints={waypoints}
        showCoordinates={showWaypointCoordinates}
      />

      {showCoordinates && (
        <JourneyCoordinatesPanel
          origin={origin}
          destination={destination}
          originLabel={corridor.originName || 'Journey origin'}
          destinationLabel={
            corridor.destinationName || 'Journey destination'
          }
        />
      )}
    </section>
  );
}
