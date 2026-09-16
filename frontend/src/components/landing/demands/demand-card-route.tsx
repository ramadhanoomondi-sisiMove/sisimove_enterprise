// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Route
// -----------------------------------------------------------------------------
//
// Compact route column for a public Journey Demand.
//
// A Demand route is a REQUESTED route.
//
// It is therefore important that this component does not accidentally adopt
// Journey-side semantics such as:
//
//     pickupAllowed
//     dropoffAllowed
//
// Demand waypoints instead expose:
//
//     pickupRequired
//     dropoffRequired
//
// The primary marketplace route remains:
//
//     origin
//        ↓
//     destination
//
// Genuine intermediate waypoints are shown as additional requested locations.
//
// PRESENTATION BOUNDARY
// ---------------------
//
// This component:
//
// - renders the supplied public route;
// - displays origin and destination;
// - displays genuine intermediate waypoints;
// - preserves waypoint sequence.
//
// This component does NOT:
//
// - geocode locations;
// - calculate distance;
// - calculate a route;
// - perform schedule logic;
// - perform matching logic;
// - determine pickup/drop-off eligibility;
// - mutate the route.
//
// RESPONSIVE MARKETPLACE RULE
// ---------------------------
//
// The marketplace card remains a horizontal row at every viewport size.
//
// The parent DemandMarketplaceCard owns the route column allocation:
//
//     flex-[1.6]
//
// This component therefore does NOT define:
//
// - a fixed width;
// - a minimum desktop width;
// - flex-1 sizing;
// - shrink behavior;
// - marketplace-level padding.
//
// Its responsibility is the content inside that allocated column.
//
// -----------------------------------------------------------------------------

import type { PublicJourneyDemandRoute } from '@/features/journey-demands/models';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface DemandCardRouteProps {
  /**
   * Public requested route.
   */
  readonly route: PublicJourneyDemandRoute;

  /**
   * Optional presentation class.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function DemandCardRoute({
  route,
  className,
}: DemandCardRouteProps) {
  // ---------------------------------------------------------------------------
  // Genuine intermediate waypoints
  // ---------------------------------------------------------------------------
  //
  // ORIGIN and DESTINATION are already represented by the primary route
  // fields. They should therefore not be duplicated in the "Via" line.
  //
  // The public Demand model owns waypoint sequence, so presentation preserves
  // that sequence rather than attempting to derive or recalculate it.
  // ---------------------------------------------------------------------------

  const intermediateWaypoints = route.waypoints
    .filter(
      (waypoint) =>
        waypoint.type !== 'ORIGIN' &&
        waypoint.type !== 'DESTINATION',
    )
    .sort((a, b) => a.sequence - b.sequence);

  return (
    <div
      className={[
        // -------------------------------------------------------------------
        // Route content boundary
        // -------------------------------------------------------------------
        //
        // The parent marketplace card controls the horizontal column width
        // and outer responsive padding.
        //
        'flex',
        'min-w-0',
        'flex-col',
        'justify-center',
        'overflow-hidden',

        // -------------------------------------------------------------------
        // Internal route density
        // -------------------------------------------------------------------
        //
        // Keep the route compact while allowing the visual spacing to grow
        // gradually on larger viewports.
        //
        'gap-0',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Origin                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="min-w-0">
        <p
          className={[
            'text-[9px]',
            'sm:text-[10px]',
            'md:text-xs',
            'font-medium',
            'uppercase',
            'tracking-wide',
            'leading-tight',
            'text-[var(--foreground-muted)]',
          ].join(' ')}
        >
          From
        </p>

        <p
          className={[
            'truncate',
            'text-[11px]',
            'sm:text-xs',
            'md:text-sm',
            'font-semibold',
            'leading-tight',
            'text-[var(--foreground)]',
          ].join(' ')}
        >
          {route.origin.name}
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Direction                                                          */}
      {/* ------------------------------------------------------------------ */}

      <div
        aria-hidden="true"
        className={[
          'my-0.5',
          'sm:my-1',
          'text-[11px]',
          'sm:text-xs',
          'md:text-sm',
          'leading-none',
          'text-[var(--brand)]',
        ].join(' ')}
      >
        ↓
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Destination                                                        */}
      {/* ------------------------------------------------------------------ */}

      <div className="min-w-0">
        <p
          className={[
            'text-[9px]',
            'sm:text-[10px]',
            'md:text-xs',
            'font-medium',
            'uppercase',
            'tracking-wide',
            'leading-tight',
            'text-[var(--foreground-muted)]',
          ].join(' ')}
        >
          To
        </p>

        <p
          className={[
            'truncate',
            'text-[11px]',
            'sm:text-xs',
            'md:text-sm',
            'font-semibold',
            'leading-tight',
            'text-[var(--foreground)]',
          ].join(' ')}
        >
          {route.destination.name}
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Intermediate requested locations                                   */}
      {/* ------------------------------------------------------------------ */}
      {intermediateWaypoints.length > 0 && (
        <div
          className={[
            'mt-1',
            'sm:mt-1.5',
            'md:mt-2',
            'min-w-0',
          ].join(' ')}
        >
          <p
            className={[
              'truncate',
              'text-[9px]',
              'sm:text-[10px]',
              'md:text-xs',
              'leading-tight',
              'text-[var(--foreground-muted)]',
            ].join(' ')}
            title={intermediateWaypoints
              .map((waypoint) => waypoint.name)
              .join(' · ')}
          >
            Via{' '}
            {intermediateWaypoints
              .map((waypoint) => waypoint.name)
              .join(' · ')}
          </p>
        </div>
      )}
    </div>
  );
}