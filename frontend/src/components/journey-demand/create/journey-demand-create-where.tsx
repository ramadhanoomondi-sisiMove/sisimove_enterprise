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
// This step captures the route information needed by the creation flow:
// - origin;
// - destination.
//
// Waypoint management is intentionally not embedded here because the existing
// corridor editor owns waypoint editing as a distinct concern. The parent may
// compose that editor when waypoint capture is required.
//
// The values represented here are form values, not backend domain objects.
// -----------------------------------------------------------------------------

'use client';

import { Input } from '@/components/ui';
import { cn } from '@/foundation';

export interface JourneyDemandCreateWhereValue {
  readonly origin: string;
  readonly destination: string;
}

export interface JourneyDemandCreateWhereProps {
  readonly value: JourneyDemandCreateWhereValue;
  readonly onChange: (value: JourneyDemandCreateWhereValue) => void;
  readonly disabled?: boolean;
  readonly className?: string;
}

export function JourneyDemandCreateWhere({
  value,
  onChange,
  disabled = false,
  className,
}: JourneyDemandCreateWhereProps) {
  const handleOriginChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    onChange({
      ...value,
      origin: event.target.value,
    });
  };

  const handleDestinationChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    onChange({
      ...value,
      destination: event.target.value,
    });
  };

  return (
    <section
      className={cn(
        'min-w-0',
        className,
      )}
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
        <Input
          id="journey-demand-create-origin"
          name="origin"
          label="From"
          placeholder="e.g. Nairobi"
          value={value.origin}
          onChange={handleOriginChange}
          disabled={disabled}
          autoComplete="off"
          fullWidth
        />

        <Input
          id="journey-demand-create-destination"
          name="destination"
          label="To"
          placeholder="e.g. Bungoma"
          value={value.destination}
          onChange={handleDestinationChange}
          disabled={disabled}
          autoComplete="off"
          fullWidth
        />
      </div>
    </section>
  );
}

