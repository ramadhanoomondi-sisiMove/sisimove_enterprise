// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Create When
// -----------------------------------------------------------------------------
//
// Controlled "When" step for the Journey Demand creation flow.
//
// Architecture:
// - Owns no server state.
// - Performs no API requests.
// - Performs no authorization checks.
// - Performs no persistence.
// - Does not construct JourneyDemandSchedule.
// - Does not derive backend schedule convenience flags.
// - Parent create form owns workflow state and submission.
//
// This component captures the traveller's requested departure and optional
// arrival constraints as creation-form values.
//
// Native datetime-local controls intentionally represent local date/time input.
// The parent/application layer is responsible for converting these values to
// the backend's authoritative ISO-8601 schedule representation and timezone.
// -----------------------------------------------------------------------------

'use client';

import type { ChangeEvent } from 'react';

import { Input } from '@/components/ui';
import { cn } from '@/foundation';

export interface JourneyDemandCreateWhenValue {
  /**
   * Local datetime value used by the browser form control.
   *
   * Example:
   * "2026-10-15T06:00"
   */
  readonly earliestDeparture: string;

  /**
   * Local datetime value used by the browser form control.
   *
   * Example:
   * "2026-10-15T09:00"
   */
  readonly latestDeparture: string;

  /**
   * Optional preferred arrival datetime.
   */
  readonly targetArrival: string;

  /**
   * Optional latest acceptable arrival datetime.
   */
  readonly maximumArrival: string;
}

export interface JourneyDemandCreateWhenProps {
  readonly value: JourneyDemandCreateWhenValue;
  readonly onChange: (value: JourneyDemandCreateWhenValue) => void;
  readonly disabled?: boolean;
  readonly className?: string;
}

export function JourneyDemandCreateWhen({
  value,
  onChange,
  disabled = false,
  className,
}: JourneyDemandCreateWhenProps) {
  const handleChange =
    (field: keyof JourneyDemandCreateWhenValue) =>
    (event: ChangeEvent<HTMLInputElement>): void => {
      onChange({
        ...value,
        [field]: event.target.value,
      });
    };

  return (
    <section
      className={cn(
        'min-w-0',
        className,
      )}
      aria-labelledby="journey-demand-create-when-heading"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-[var(--brand)]">
          Step 2
        </p>

        <h2
          id="journey-demand-create-when-heading"
          className="mt-1 text-lg font-semibold text-foreground sm:text-xl"
        >
          When do you want to travel?
        </h2>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-foreground-muted">
          Give a departure window and, if needed, tell us when you would like
          to arrive.
        </p>
      </div>

      <div className="mt-6 min-w-0">
        <div className="grid min-w-0 gap-4 sm:grid-cols-2">
          <Input
            id="journey-demand-create-earliest-departure"
            name="earliestDeparture"
            type="datetime-local"
            label="Earliest departure"
            value={value.earliestDeparture}
            onChange={handleChange('earliestDeparture')}
            disabled={disabled}
            fullWidth
          />

          <Input
            id="journey-demand-create-latest-departure"
            name="latestDeparture"
            type="datetime-local"
            label="Latest departure"
            value={value.latestDeparture}
            onChange={handleChange('latestDeparture')}
            disabled={disabled}
            fullWidth
          />
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-foreground">
            Arrival preference
          </h3>

          <p className="mt-1 text-sm text-foreground-muted">
            These fields are optional. Leave them empty if your arrival time
            is not constrained.
          </p>
        </div>

        <div className="mt-4 grid min-w-0 gap-4 sm:grid-cols-2">
          <Input
            id="journey-demand-create-target-arrival"
            name="targetArrival"
            type="datetime-local"
            label="Target arrival"
            value={value.targetArrival}
            onChange={handleChange('targetArrival')}
            disabled={disabled}
            fullWidth
          />

          <Input
            id="journey-demand-create-maximum-arrival"
            name="maximumArrival"
            type="datetime-local"
            label="Latest acceptable arrival"
            value={value.maximumArrival}
            onChange={handleChange('maximumArrival')}
            disabled={disabled}
            fullWidth
          />
        </div>
      </div>
    </section>
  );
}

