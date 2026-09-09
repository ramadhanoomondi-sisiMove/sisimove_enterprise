// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Route
// -----------------------------------------------------------------------------
//
// Presentation component for the route portion of a public Journey Demand.
//
// This component is intentionally independent from:
// - Journey Demand API calls
// - Journey Demand feature hooks
// - Prisma models
// - domain entities
// - matching logic
// - private pickup/drop-off locations
//
// It displays only public route information suitable for discovery.
//
// -----------------------------------------------------------------------------

import type { HTMLAttributes } from 'react';

import { cn } from '../../../foundation/utils/cn';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDemandRouteProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  origin: string;
  destination: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandRoute({
  origin,
  destination,
  className,
  ...props
}: JourneyDemandRouteProps) {
  const normalizedOrigin = origin.trim();
  const normalizedDestination = destination.trim();

  return (
    <div
      className={cn('min-w-0', className)}
      {...props}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div
          aria-hidden="true"
          className="flex shrink-0 flex-col items-center"
        >
          <span className="h-2.5 w-2.5 rounded-full border-2 border-neutral-700 bg-white" />
          <span className="my-1 h-5 w-px bg-neutral-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
        </div>

        <div className="min-w-0 space-y-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-neutral-950">
              {normalizedOrigin || 'Origin not specified'}
            </p>
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-neutral-950">
              {normalizedDestination || 'Destination not specified'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}