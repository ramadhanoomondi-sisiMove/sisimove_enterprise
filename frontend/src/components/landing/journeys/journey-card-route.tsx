// -----------------------------------------------------------------------------
// sisiMove — Journey Marketplace Card Route
// -----------------------------------------------------------------------------
//
// Presentation component for the route portion of a public Journey
// marketplace card.
//
// The route establishes where the provider is travelling:
//
//     Origin → Destination
//
// A Journey may also contain intermediate waypoints. The marketplace card
// keeps those locations compact so the route remains easy to scan without
// turning the card into a full route-detail view.
//
// This component deliberately does not:
// - fetch route data;
// - resolve location references;
// - calculate distances;
// - determine travel duration;
// - format departure or arrival times;
// - display vehicle information;
// - display seat availability;
// - display pricing;
// - contain booking logic.
//
// Those responsibilities belong to the appropriate Journey card components
// or to the domain/application layer.
//
// -----------------------------------------------------------------------------

import type { PublicJourneyRoute } from '@/features/journeys/models/public-journey-route';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyCardRouteProps {
  /**
   * Public Journey route representation.
   *
   * The route already contains resolved public location information. The
   * presentation component therefore only renders the supplied values.
   */
  route: PublicJourneyRoute;

  /**
   * Optional additional styling supplied by the parent marketplace card.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

/**
 * Returns only genuine intermediate waypoints.
 *
 * The public route model already exposes origin and destination separately.
 * Some API representations may also include ORIGIN and DESTINATION entries
 * inside the waypoint collection, so those entries must not be presented as
 * additional stops on the marketplace card.
 */
function getIntermediateWaypoints(
  route: PublicJourneyRoute,
) {
  return route.waypoints.filter(
    (waypoint) =>
      waypoint.type !== 'ORIGIN' &&
      waypoint.type !== 'DESTINATION',
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyCardRoute({
  route,
  className,
}: JourneyCardRouteProps) {
  const intermediateWaypoints = getIntermediateWaypoints(route);

  return (
    <div
      className={[
        'min-w-0',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={`Route from ${route.origin.name} to ${route.destination.name}`}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Origin → Destination                                                */}
      {/* ------------------------------------------------------------------- */}
      {/*
        Origin and destination are the primary route information and are
        therefore always visible.
      */}

      <div className="flex min-w-0 items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-[var(--foreground-secondary)]">
            From
          </p>

          <p className="truncate text-base font-semibold text-[var(--foreground)]">
            {route.origin.name}
          </p>
        </div>

        <span
          aria-hidden="true"
          className="shrink-0 text-lg text-[var(--foreground-subtle)]"
        >
          →
        </span>

        <div className="min-w-0 flex-1 text-right">
          <p className="text-xs font-medium text-[var(--foreground-secondary)]">
            To
          </p>

          <p className="truncate text-base font-semibold text-[var(--foreground)]">
            {route.destination.name}
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Intermediate Waypoints                                              */}
      {/* ------------------------------------------------------------------- */}
      {/*
        Intermediate locations are secondary route context. Keep them compact
        rather than rendering a second full route structure inside the card.
      */}

      {intermediateWaypoints.length > 0 && (
        <p className="mt-2 truncate text-sm text-[var(--foreground-secondary)]">
          Via{' '}
          {intermediateWaypoints
            .map((waypoint) => waypoint.name)
            .join(' · ')}
        </p>
      )}
    </div>
  );
}