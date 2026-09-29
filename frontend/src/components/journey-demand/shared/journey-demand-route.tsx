// src/features/journey-demands/components/shared/journey-demand-route.tsx

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Route
// -----------------------------------------------------------------------------
//
// Compact reusable presentation component for a Journey Demand's public route.
//
// Responsibilities:
// - Present the Journey Demand origin and destination.
// - Provide a consistent origin → destination visual treatment.
// - Support reuse across marketplace cards, detail surfaces, and management
//   views where the public Journey Demand route projection is available.
//
// This component does NOT:
// - perform queries;
// - perform mutations;
// - resolve locations;
// - calculate routes or distances;
// - perform geocoding;
// - navigate to another route;
// - recreate Journey Demand domain logic.
//
// The public Journey Demand route supplied by the backend/frontend model
// remains the source of truth.
//
// Marketplace presentation:
// - Route is the primary visual anchor.
// - Origin and destination are visually distinct.
// - Origin uses the brand color.
// - Destination uses the danger color.
// - Route remains compact and does not introduce a nested surface.
// - The route can remain horizontally composed inside the marketplace card.
// -----------------------------------------------------------------------------

import type { PublicJourneyDemandRoute } from '@/features/journey-demand/models';

import { cn } from '@/foundation';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyDemandRouteProps {
  /**
   * Public Journey Demand route containing the projected origin and
   * destination.
   */
  readonly route: PublicJourneyDemandRoute;

  /**
   * Optional additional classes for the route container.
   */
  readonly className?: string;

  /**
   * Controls the amount of visual emphasis given to the route names.
   *
   * Compact is appropriate for marketplace cards.
   * Default is appropriate for detail/management surfaces.
   */
  readonly emphasis?: 'compact' | 'default';
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandRoute({
  route,
  className,
  emphasis = 'default',
}: JourneyDemandRouteProps) {
  const isCompact = emphasis === 'compact';

  return (
    <div
      className={cn(
        'flex min-w-0 items-center justify-center',
        isCompact ? 'gap-2' : 'gap-3',
        className,
      )}
    >
      {/* -----------------------------------------------------------------
          Origin
          ----------------------------------------------------------------- */}

      <span
        className={cn(
          'min-w-0 truncate text-right font-semibold leading-tight',
          'text-[var(--brand)]',
          isCompact ? 'text-sm' : 'text-base',
        )}
        title={route.origin.name}
      >
        {route.origin.name}
      </span>

      {/* -----------------------------------------------------------------
          Direction
          ----------------------------------------------------------------- */}

      <span
        aria-hidden="true"
        className={cn(
          'shrink-0 font-medium',
          'text-[var(--foreground-muted)]',
          isCompact ? 'text-sm' : 'text-base',
        )}
      >
        →
      </span>

      {/* -----------------------------------------------------------------
          Destination
          ----------------------------------------------------------------- */}

      <span
        className={cn(
          'min-w-0 truncate font-semibold leading-tight',
          'text-[var(--danger)]',
          isCompact ? 'text-sm' : 'text-base',
        )}
        title={route.destination.name}
      >
        {route.destination.name}
      </span>
    </div>
  );
}