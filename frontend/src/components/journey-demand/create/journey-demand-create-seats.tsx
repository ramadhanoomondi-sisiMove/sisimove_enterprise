// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Create Seats
// -----------------------------------------------------------------------------
//
// Controlled "Seats" step for the Journey Demand creation flow.
//
// Architecture:
// - Owns no server state.
// - Performs no API requests.
// - Performs no authorization checks.
// - Performs no persistence.
// - Does not construct JourneyDemandCapacity.
// - Does not expose or modify matchedSeats.
// - Does not derive capacity state such as remaining/full.
// - Parent create form owns workflow state and submission.
//
// The traveller specifies how many seats are needed. Matching information is
// backend-owned and therefore does not belong in this creation step.
// -----------------------------------------------------------------------------

'use client';

import type { ChangeEvent } from 'react';

import { Input } from '@/components/ui';
import { cn } from '@/foundation';

export interface JourneyDemandCreateSeatsValue {
  readonly requestedSeats: number;
}

export interface JourneyDemandCreateSeatsProps {
  readonly value: JourneyDemandCreateSeatsValue;
  readonly onChange: (value: JourneyDemandCreateSeatsValue) => void;
  readonly disabled?: boolean;
  readonly className?: string;
}

export function JourneyDemandCreateSeats({
  value,
  onChange,
  disabled = false,
  className,
}: JourneyDemandCreateSeatsProps) {
  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    const rawValue = event.target.value;

    if (rawValue === '') {
      onChange({
        requestedSeats: 0,
      });

      return;
    }

    const parsedValue = Number(rawValue);

    if (!Number.isFinite(parsedValue)) {
      return;
    }

    onChange({
      requestedSeats: Math.trunc(parsedValue),
    });
  };

  return (
    <section
      className={cn(
        'min-w-0',
        className,
      )}
      aria-labelledby="journey-demand-create-seats-heading"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-[var(--brand)]">
          Step 3
        </p>

        <h2
          id="journey-demand-create-seats-heading"
          className="mt-1 text-lg font-semibold text-foreground sm:text-xl"
        >
          How many seats do you need?
        </h2>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-foreground-muted">
          Tell us how many people need seats for this travel request.
        </p>
      </div>

      <div className="mt-6 max-w-sm">
        <Input
          id="journey-demand-create-requested-seats"
          name="requestedSeats"
          type="number"
          label="Seats needed"
          value={value.requestedSeats === 0 ? '' : value.requestedSeats}
          onChange={handleChange}
          disabled={disabled}
          min={1}
          step={1}
          inputMode="numeric"
          helperText="Enter the total number of seats required."
          fullWidth
        />
      </div>
    </section>
  );
}

