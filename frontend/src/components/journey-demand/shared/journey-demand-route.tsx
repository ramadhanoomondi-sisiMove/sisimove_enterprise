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
  return (
    <div
      className={cn(
        'flex min-w-0 items-center gap-2',
        className,
      )}
    >
      <span className="min-w-0 truncate">
        <span
          className={cn(
            emphasis === 'compact'
              ? 'text-sm font-medium'
              : 'text-base font-semibold',
            'text-foreground',
          )}
        >
          {route.origin.name}
        </span>
      </span>

      <span
        aria-hidden="true"
        className={cn(
          'shrink-0 text-foreground-muted',
          emphasis === 'compact'
            ? 'text-sm'
            : 'text-base',
        )}
      >
        →
      </span>

      <span className="min-w-0 truncate">
        <span
          className={cn(
            emphasis === 'compact'
              ? 'text-sm font-medium'
              : 'text-base font-semibold',
            'text-foreground',
          )}
        >
          {route.destination.name}
        </span>
      </span>
    </div>
  );
}

