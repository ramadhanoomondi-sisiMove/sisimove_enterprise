// -----------------------------------------------------------------------------
// sisiMove — Journey Marketplace Card Route
// -----------------------------------------------------------------------------
//
// Compact presentation component for the route section of a public Journey
// marketplace listing.
//
// MARKETPLACE ROLE
// ----------------
//
// The Journey marketplace row communicates:
//
//   WHEN → WHO → WHERE → VEHICLE → PRICE/SEATS → ACTIONS
//                       ↑
//                    this block
//
// This component owns the `WHERE` portion:
//
//   From
//   Nairobi
//      ↓
//   To
//   Mombasa
//
// If the Journey contains intermediate waypoints, they are presented as
// secondary route context:
//
//   Via Voi · Mtito Andei
//
// The route remains intentionally compact. It is not a complete Journey
// itinerary or route-detail component.
//
// PRESENTATION BOUNDARY
// ---------------------
//
// This component:
//
// - renders the already-resolved public route;
// - displays origin and destination;
// - displays genuine intermediate waypoints;
// - keeps route information compact and scannable.
//
// It deliberately does not:
//
// - fetch route data;
// - resolve location IDs;
// - calculate distances;
// - calculate duration;
// - determine departure or arrival times;
// - render vehicle information;
// - render pricing;
// - render seat availability;
// - determine booking eligibility;
// - contain Journey business logic.
//
// WAYPOINT BOUNDARY
// -----------------
//
// The public route representation already exposes origin and destination.
//
// Some API representations may additionally contain ORIGIN and DESTINATION
// entries inside `waypoints`.
//
// Those entries are filtered out here so the marketplace never renders:
//
//   Nairobi → Mombasa
//   Via Nairobi · Voi
//
// Instead, only genuine intermediate locations are displayed.
//
// The supplied waypoint sequence is used to keep the Via presentation
// deterministic.
//
// RESPONSIVE MARKETPLACE DENSITY
// ------------------------------
//
// The parent JourneyMarketplaceCard owns:
//
// - the route column width;
// - the route column position;
// - the marketplace column padding;
// - the column separator.
//
// This component therefore deliberately does NOT:
//
// - define a fixed width;
// - define a minimum desktop width;
// - use horizontal scrolling;
// - add marketplace-level horizontal padding;
// - add marketplace-level vertical padding.
//
// The marketplace row remains horizontal at every breakpoint.
//
// The route content itself remains vertically composed:
//
//   From
//   Nairobi
//     ↓
//   To
//   Mombasa
//   Via Voi
//
// Internal typography and spacing progressively contract on smaller screens.
//
// DESIGN-SYSTEM BOUNDARY
// ----------------------
//
// Uses only sisiMove global design tokens:
//
//   --foreground
//   --foreground-secondary
//   --foreground-muted
//   --foreground-subtle
//
// No generic or nonexistent tokens are introduced.
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
   * Location information is expected to already be resolved by the public
   * Journey read model.
   */
  readonly route: PublicJourneyRoute;

  /**
   * Optional additional styling supplied by the parent marketplace card.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

/**
 * Returns only genuine intermediate waypoints.
 *
 * Origin and destination are already represented by `route.origin` and
 * `route.destination`, so they should not be repeated in the Via line.
 *
 * Sorting by sequence keeps the presentation deterministic if the public API
 * does not return the waypoint collection in sequence order.
 */
function getIntermediateWaypoints(route: PublicJourneyRoute) {
  return route.waypoints
    .filter(
      (waypoint) =>
        waypoint.type !== 'ORIGIN' &&
        waypoint.type !== 'DESTINATION',
    )
    .sort((a, b) => a.sequence - b.sequence);
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyCardRoute({
  route,
  className,
}: JourneyCardRouteProps) {
  const intermediateWaypoints = getIntermediateWaypoints(route);

  const viaLabel = intermediateWaypoints
    .map((waypoint) => waypoint.name)
    .filter(Boolean)
    .join(' · ');

  return (
    <div
      className={[
        // -------------------------------------------------------------------
        // Route content boundary
        // -------------------------------------------------------------------
        //
        // The parent marketplace column owns width, separator, and outer
        // padding. This component only establishes the internal route
        // composition.
        //
        'flex',
        'min-w-0',
        'flex-col',
        'justify-center',

        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={`Route from ${route.origin.name} to ${route.destination.name}`}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Origin                                                              */}
      {/* ------------------------------------------------------------------- */}

      <div className="min-w-0">
        <p
          className={[
            'text-[9px]',
            'sm:text-[10px]',
            'md:text-xs',
            'font-medium',
            'uppercase',
            'tracking-[0.05em]',
            'sm:tracking-[0.06em]',
            'leading-none',
            'text-[var(--foreground-muted)]',
          ].join(' ')}
        >
          From
        </p>

        <p
          className={[
            'mt-0.5',
            'min-w-0',
            'truncate',
            'text-[11px]',
            'sm:text-xs',
            'md:text-sm',
            'font-semibold',
            'leading-tight',
            'text-[var(--foreground)]',
          ].join(' ')}
          title={route.origin.name}
        >
          {route.origin.name}
        </p>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Direction                                                           */}
      {/* ------------------------------------------------------------------- */}
      {/*
        The route is intentionally vertically composed. The arrow therefore
        communicates direction without consuming meaningful horizontal space.
      */}
      <div
        aria-hidden="true"
        className={[
          'my-0.5',
          'sm:my-1',
          'text-[11px]',
          'sm:text-xs',
          'md:text-sm',
          'font-medium',
          'leading-none',
          'text-[var(--foreground-subtle)]',
        ].join(' ')}
      >
        ↓
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Destination                                                         */}
      {/* ------------------------------------------------------------------- */}

      <div className="min-w-0">
        <p
          className={[
            'text-[9px]',
            'sm:text-[10px]',
            'md:text-xs',
            'font-medium',
            'uppercase',
            'tracking-[0.05em]',
            'sm:tracking-[0.06em]',
            'leading-none',
            'text-[var(--foreground-muted)]',
          ].join(' ')}
        >
          To
        </p>

        <p
          className={[
            'mt-0.5',
            'min-w-0',
            'truncate',
            'text-[11px]',
            'sm:text-xs',
            'md:text-sm',
            'font-semibold',
            'leading-tight',
            'text-[var(--foreground)]',
          ].join(' ')}
          title={route.destination.name}
        >
          {route.destination.name}
        </p>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Intermediate Waypoints                                              */}
      {/* ------------------------------------------------------------------- */}
      {viaLabel && (
        <p
          className={[
            'mt-1',
            'sm:mt-1.5',
            'md:mt-2',
            'min-w-0',
            'truncate',
            'text-[9px]',
            'sm:text-[10px]',
            'md:text-xs',
            'leading-tight',
            'text-[var(--foreground-muted)]',
          ].join(' ')}
          title={`Via ${viaLabel}`}
        >
          <span className="font-medium text-[var(--foreground-secondary)]">
            Via
          </span>{' '}
          {viaLabel}
        </p>
      )}
    </div>
  );
}