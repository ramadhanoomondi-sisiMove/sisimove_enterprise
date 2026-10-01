// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Create Where
// -----------------------------------------------------------------------------
//
// Controlled "Where" step for the Journey Demand creation flow.
//
// Architecture:
// - Owns no server state.
// - Performs no API requests.
// - Performs no authorization checks.
// - Performs no persistence.
// - Does not construct a JourneyDemand aggregate.
// - Does not determine whether the overall demand is valid.
// - Parent create form owns workflow state and submission.
//
// Location architecture:
// - Uses the SisiMove-supported location catalogue.
// - Does not use Mapbox, Google, or any external geocoding service.
// - From and To are selected from SisiMove-supported locations.
// - The selected locations already contain their coordinates.
// - The parent receives the resolved locations and corridor information
//   through the normal controlled-form flow.
//
// Waypoint management remains a separate concern.
// -----------------------------------------------------------------------------
//
// Path:
// src/features/journey-demand/components/create/JourneyDemandCreateWhere.tsx
// -----------------------------------------------------------------------------

'use client';

import {
  LocationSelector,
  type ResolvedLocation,
} from '@/foundation/location';

import { cn } from '@/foundation';

export interface JourneyDemandCreateWhereValue {
  readonly origin: ResolvedLocation | null;
  readonly destination: ResolvedLocation | null;
}

export interface JourneyDemandCreateWhereProps {
  readonly value: JourneyDemandCreateWhereValue;

  readonly originQuery: string;
  readonly destinationQuery: string;

  readonly originSuggestions: readonly ResolvedLocation[];
  readonly destinationSuggestions: readonly ResolvedLocation[];

  readonly originError?: string | null;
  readonly destinationError?: string | null;

  readonly disabled?: boolean;
  readonly className?: string;

  readonly onOriginQueryChange: (query: string) => void;
  readonly onDestinationQueryChange: (query: string) => void;

  readonly onOriginSelect: (location: ResolvedLocation) => void;
  readonly onDestinationSelect: (location: ResolvedLocation) => void;
}

export function JourneyDemandCreateWhere({
  value,
  originQuery,
  destinationQuery,
  originSuggestions,
  destinationSuggestions,
  originError = null,
  destinationError = null,
  disabled = false,
  className,
  onOriginQueryChange,
  onDestinationQueryChange,
  onOriginSelect,
  onDestinationSelect,
}: JourneyDemandCreateWhereProps) {
  return (
    <section
      className={cn('min-w-0', className)}
      aria-labelledby="journey-demand-create-where-heading"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-[var(--brand)]">
          Step 1
        </p>

        <h2
          id="journey-demand-create-where-heading"
          className="mt-1 text-lg font-semibold text-foreground sm:text-xl"
        >
          Where are you travelling?
        </h2>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-foreground-muted">
          Tell travellers where you want to start and where you want to go.
        </p>
      </div>

      <div className="mt-6 grid min-w-0 gap-4 sm:grid-cols-2">
        <LocationSelector
          label="From"
          placeholder="Select starting point"
          value={value.origin}
          query={originQuery}
          suggestions={originSuggestions}
          disabled={disabled}
          error={originError}
          onQueryChange={onOriginQueryChange}
          onSelect={onOriginSelect}
        />

        <LocationSelector
          label="To"
          placeholder={
            value.origin
              ? 'Select destination'
              : 'Select starting point first'
          }
          value={value.destination}
          query={destinationQuery}
          suggestions={destinationSuggestions}
          disabled={disabled || value.origin === null}
          error={destinationError}
          onQueryChange={onDestinationQueryChange}
          onSelect={onDestinationSelect}
        />
      </div>
    </section>
  );
}

export default JourneyDemandCreateWhere;