// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Create Where
// -----------------------------------------------------------------------------
//
// Controlled "Where" configuration for an already-created Journey Demand.
//
// Creation workflow:
//
//   1. User chooses "Create Journey Demand"
//   2. Creation form starts
//   3. Journey Demand aggregate is created
//   4. journeyDemandPublicId is established
//   5. Journey Demand configuration begins
//      ├── Where
//      ├── When
//      ├── Seats
//      ├── Pricing
//      └── other demand details
//   6. Configuration is completed
//   7. Navigate to Edit
//   8. Publish
//
// This component therefore does NOT represent aggregate creation.
//
// Architecture:
// - Owns no server state.
// - Performs no API requests.
// - Performs no authorization checks.
// - Performs no persistence.
// - Does not create the Journey Demand aggregate.
// - Does not establish journeyDemandPublicId.
// - Does not construct the Journey Demand domain object.
// - Does not decide whether the overall demand is valid.
// - Parent create form owns workflow state and submission.
//
// Location architecture:
// - Uses the SisiMove-supported location catalogue.
// - Does not use Mapbox, Google, or any external geocoding service.
// - From and To are selected from SisiMove-supported locations.
// - Selected locations already contain their coordinates.
// - The parent receives the resolved locations through the controlled
//   configuration flow.
//
// Validation:
// - Origin and destination are required before the parent may continue.
// - This component displays validation errors supplied by the parent.
// - Workflow navigation remains owned by the parent create form.
//
// Waypoint management remains a separate concern.
//
// -----------------------------------------------------------------------------

'use client';

import {
  LocationSelector,
  type ResolvedLocation,
} from '@/foundation/location';

import { cn } from '@/foundation';

// -----------------------------------------------------------------------------
// Value
// -----------------------------------------------------------------------------

export interface JourneyDemandCreateWhereValue {
  readonly origin: ResolvedLocation | null;
  readonly destination: ResolvedLocation | null;
}

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDemandCreateWhereProps {
  /**
   * Current Where configuration.
   */
  readonly value: JourneyDemandCreateWhereValue;

  /**
   * Current search text for the origin selector.
   */
  readonly originQuery: string;

  /**
   * Current search text for the destination selector.
   */
  readonly destinationQuery: string;

  /**
   * SisiMove-supported origin locations matching the current query.
   */
  readonly originSuggestions: readonly ResolvedLocation[];

  /**
   * SisiMove-supported destination locations matching the current query.
   */
  readonly destinationSuggestions: readonly ResolvedLocation[];

  /**
   * Parent-provided validation error for the origin.
   */
  readonly originError?: string | null;

  /**
   * Parent-provided validation error for the destination.
   */
  readonly destinationError?: string | null;

  readonly disabled?: boolean;
  readonly className?: string;

  /**
   * Controlled origin search state.
   */
  readonly onOriginQueryChange: (query: string) => void;

  /**
   * Controlled destination search state.
   */
  readonly onDestinationQueryChange: (query: string) => void;

  /**
   * Emits the selected origin.
   */
  readonly onOriginSelect: (location: ResolvedLocation) => void;

  /**
   * Emits the selected destination.
   */
  readonly onDestinationSelect: (location: ResolvedLocation) => void;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

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
  const hasOrigin = value.origin !== null;
  const hasDestination = value.destination !== null;

  return (
    <section
      className={cn(
        'min-w-0',
        className,
      )}
      aria-labelledby="journey-demand-create-where-heading"
    >
      {/* ---------------------------------------------------------------------
          Header

          The Journey Demand already exists at this point. This section is
          therefore a configuration step rather than aggregate creation.
      --------------------------------------------------------------------- */}

      <div className="min-w-0">
        <span className="text-sm font-medium text-[var(--foreground-muted)]">
          Where
        </span>

        <h2
          id="journey-demand-create-where-heading"
          className="mt-2 text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl"
        >
          Where are you travelling?
        </h2>

        <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--foreground-secondary)]">
          Tell travellers where you want to start and where you want to go.
        </p>
      </div>

      {/* ---------------------------------------------------------------------
          Route selection
      --------------------------------------------------------------------- */}

      <div className="relative mt-7 min-w-0">
        <div
          className="pointer-events-none absolute left-[1.125rem] top-10 hidden h-[calc(100%-5rem)] w-px bg-[var(--border)] sm:block"
          aria-hidden="true"
        />

        <div className="grid min-w-0 gap-5 sm:grid-cols-2">
          {/* -----------------------------------------------------------------
              Origin
          ----------------------------------------------------------------- */}

          <div className="relative min-w-0">
            <div
              className={cn(
                'absolute left-2 top-[2.15rem] z-10',
                'hidden h-2.5 w-2.5 rounded-full',
                'border-2 border-[var(--surface)]',
                'bg-[var(--brand)]',
                'shadow-[var(--shadow-sm)]',
                'sm:block',
              )}
              aria-hidden="true"
            />

            <div className="min-w-0 sm:pl-7">
              <LocationSelector
                label="From"
                placeholder="Select starting point"
                value={value.origin}
                query={originQuery}
                suggestions={originSuggestions}
                disabled={disabled}
                error={
                  originError ??
                  (!hasOrigin
                    ? 'Please select a starting point.'
                    : null)
                }
                onQueryChange={onOriginQueryChange}
                onSelect={onOriginSelect}
              />
            </div>
          </div>

          {/* -----------------------------------------------------------------
              Destination
          ----------------------------------------------------------------- */}

          <div className="relative min-w-0">
            <div
              className={cn(
                'absolute left-2 top-[2.15rem] z-10',
                'hidden h-2.5 w-2.5 rounded-full',
                'border-2 border-[var(--surface)]',
                hasDestination
                  ? 'bg-[var(--brand)]'
                  : 'bg-[var(--border-strong)]',
                'shadow-[var(--shadow-sm)]',
                'sm:block',
              )}
              aria-hidden="true"
            />

            <div className="min-w-0 sm:pl-7">
              <LocationSelector
                label="To"
                placeholder={
                  hasOrigin
                    ? 'Select destination'
                    : 'Select starting point first'
                }
                value={value.destination}
                query={destinationQuery}
                suggestions={destinationSuggestions}
                disabled={disabled || !hasOrigin}
                error={
                  destinationError ??
                  (!hasDestination
                    ? 'Please select a destination.'
                    : null)
                }
                onQueryChange={onDestinationQueryChange}
                onSelect={onDestinationSelect}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          Selection state
      --------------------------------------------------------------------- */}

      {hasOrigin && hasDestination ? (
        <div
          className={cn(
            'mt-6 flex min-w-0 items-center gap-3',
            'rounded-[var(--radius-md)]',
            'border border-[var(--border-subtle)]',
            'bg-[var(--background-subtle)]',
            'px-4 py-3',
          )}
          role="status"
          aria-live="polite"
        >
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              className="h-4 w-4"
            >
              <path
                d="M5 10.5 8.25 14 15 6.75"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          <p className="min-w-0 text-sm text-[var(--foreground-secondary)]">
            <span className="font-medium text-[var(--foreground)]">
              Route selected.
            </span>{' '}
            Your travel need will be configured along this route.
          </p>
        </div>
      ) : null}
    </section>
  );
}

export default JourneyDemandCreateWhere;