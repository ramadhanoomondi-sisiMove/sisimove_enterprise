// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Create Price
// -----------------------------------------------------------------------------
//
// Controlled "Price" step for the Journey Demand creation flow.
//
// Architecture:
// - Owns no server state.
// - Performs no API requests.
// - Performs no authorization checks.
// - Performs no persistence.
// - Does not construct JourneyDemandPricing.
// - Does not derive backend pricing convenience flags.
// - Does not calculate a fare, booking amount, commission, or settlement.
// - Parent create form owns workflow state and submission.
//
// Pricing expresses the traveller's requested pricing conditions:
// - preferred price per seat;
// - maximum price per seat.
//
// Both values are optional. The backend remains authoritative for pricing
// validation and interpretation.
// -----------------------------------------------------------------------------

'use client';

import type { ChangeEvent } from 'react';

import { Input } from '@/components/ui';
import { cn } from '@/foundation';

export interface JourneyDemandCreatePriceValue {
  readonly preferredPricePerSeat: number | undefined;
  readonly maximumPricePerSeat: number | undefined;
}

export interface JourneyDemandCreatePriceProps {
  readonly value: JourneyDemandCreatePriceValue;
  readonly onChange: (value: JourneyDemandCreatePriceValue) => void;
  readonly currency?: string;
  readonly disabled?: boolean;
  readonly className?: string;
}

export function JourneyDemandCreatePrice({
  value,
  onChange,
  currency = 'KES',
  disabled = false,
  className,
}: JourneyDemandCreatePriceProps) {
  const handleChange =
    (field: keyof JourneyDemandCreatePriceValue) =>
    (event: ChangeEvent<HTMLInputElement>): void => {
      const rawValue = event.target.value;

      onChange({
        ...value,
        [field]: parseOptionalPrice(rawValue),
      });
    };

  return (
    <section
      className={cn(
        'min-w-0',
        className,
      )}
      aria-labelledby="journey-demand-create-price-heading"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-[var(--brand)]">
          Step 4
        </p>

        <h2
          id="journey-demand-create-price-heading"
          className="mt-1 text-lg font-semibold text-foreground sm:text-xl"
        >
          What price works for you?
        </h2>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-foreground-muted">
          Set the price conditions you would prefer for this travel need.
        </p>
      </div>

      <div className="mt-6 grid min-w-0 gap-4 sm:grid-cols-2">
        <Input
          id="journey-demand-create-preferred-price"
          name="preferredPricePerSeat"
          type="number"
          label={`Preferred price per seat (${currency})`}
          value={value.preferredPricePerSeat ?? ''}
          onChange={handleChange('preferredPricePerSeat')}
          disabled={disabled}
          min={0}
          step="0.01"
          inputMode="decimal"
          helperText="Your preferred price per seat."
          fullWidth
        />

        <Input
          id="journey-demand-create-maximum-price"
          name="maximumPricePerSeat"
          type="number"
          label={`Maximum price per seat (${currency})`}
          value={value.maximumPricePerSeat ?? ''}
          onChange={handleChange('maximumPricePerSeat')}
          disabled={disabled}
          min={0}
          step="0.01"
          inputMode="decimal"
          helperText="The highest price per seat you are willing to consider."
          fullWidth
        />
      </div>

      <p className="mt-4 text-xs leading-5 text-foreground-muted">
        Prices are travel preferences, not a confirmed fare or booking amount.
      </p>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Formatting
// -----------------------------------------------------------------------------

function parseOptionalPrice(
  rawValue: string,
): number | undefined {
  if (rawValue.trim() === '') {
    return undefined;
  }

  const parsedValue = Number(rawValue);

  if (!Number.isFinite(parsedValue)) {
    return undefined;
  }

  return parsedValue;
}

