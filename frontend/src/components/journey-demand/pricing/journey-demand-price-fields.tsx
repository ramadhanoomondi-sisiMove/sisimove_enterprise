// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Price Fields
// -----------------------------------------------------------------------------
//
// Controlled pricing field for authenticated Journey Demand editing.
//
// Backend write contract
// -----------------------------------------------------------------------------
//
// The Journey Demand pricing mutation accepts:
//
//   maxFare
//   currency
//
// Therefore:
//
// - maximumPricePerSeat is editable;
// - currency is displayed but not edited here;
// - no preferred-price field is assumed;
// - no pricing flags are manufactured or modified.
//
// The frontend consumes the pricing model actually exposed by the feature.
// It must not reference fields that are not present in that model.
//
// -----------------------------------------------------------------------------
//
// Architecture
// -----------------------------------------------------------------------------
//
// This component:
//
// - consumes JourneyDemandPricing;
// - emits controlled pricing changes;
// - does not fetch data;
// - does not call an API;
// - does not construct mutation requests;
// - does not calculate pricing semantics;
// - does not authorize the user.
//
// The parent editor owns:
//
// - validation;
// - mutation request construction;
// - persistence;
// - backend error handling;
// - authorization/capability decisions.
//
// -----------------------------------------------------------------------------

'use client';

import type { ChangeEvent } from 'react';

import type { JourneyDemandPricing } from '@/features/journey-demand/models';
import { cn } from '@/foundation';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDemandPriceFieldsProps {
  readonly pricing: JourneyDemandPricing;
  readonly onChange?: (pricing: JourneyDemandPricing) => void;
  readonly disabled?: boolean;
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandPriceFields({
  pricing,
  onChange,
  disabled = false,
  className,
}: JourneyDemandPriceFieldsProps) {
  const handleMaximumPriceChange = (
    value: number | undefined,
  ): void => {
    onChange?.({
      ...pricing,
      maximumPricePerSeat: value,
    });
  };

  return (
    <section
      className={cn(
        'min-w-0',
        className,
      )}
      aria-labelledby="journey-demand-price-fields-heading"
    >
      <div className="min-w-0">
        <h3
          id="journey-demand-price-fields-heading"
          className="text-sm font-semibold text-foreground"
        >
          Pricing
        </h3>

        <p className="mt-1 text-xs text-foreground-muted">
          Set the maximum amount you are willing to pay per seat.
        </p>
      </div>

      <div className="mt-4 grid min-w-0 gap-4">
        {/* -------------------------------------------------------------------
            Maximum acceptable price

            This maps to the backend pricing command field `maxFare`.
        ------------------------------------------------------------------- */}

        <MaximumPriceField
          id="journey-demand-maximum-price"
          value={pricing.maximumPricePerSeat}
          currency={pricing.currency}
          disabled={disabled}
          onChange={handleMaximumPriceChange}
        />

        {/* -------------------------------------------------------------------
            Currency

            Currency comes from the existing pricing model and is intentionally
            displayed rather than edited by this presentation component.
        ------------------------------------------------------------------- */}

        <div
          className={cn(
            'rounded-[var(--radius-md)]',
            'border border-[var(--border-subtle)]',
            'bg-[var(--background-subtle)]',
            'px-3 py-2.5',
          )}
        >
          <p className="text-xs font-medium text-foreground-muted">
            Currency
          </p>

          <p className="mt-0.5 text-sm font-medium text-foreground">
            {pricing.currency}
          </p>
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Maximum Price Field
// -----------------------------------------------------------------------------

interface MaximumPriceFieldProps {
  readonly id: string;
  readonly value: number | undefined;
  readonly currency: string;
  readonly disabled: boolean;
  readonly onChange: (value: number | undefined) => void;
}

function MaximumPriceField({
  id,
  value,
  currency,
  disabled,
  onChange,
}: MaximumPriceFieldProps) {
  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    onChange(parseOptionalPrice(event.target.value));
  };

  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-foreground"
      >
        Maximum price per seat
      </label>

      <div className="mt-1.5">
        <input
          id={id}
          type="number"
          min="0"
          step="0.01"
          inputMode="decimal"
          value={value ?? ''}
          disabled={disabled}
          onChange={handleChange}
          placeholder="e.g. 1500"
          className={cn(
            'block w-full min-h-10 rounded-[var(--radius-md)]',
            'border border-[var(--border)]',
            'bg-[var(--background)]',
            'px-3 py-2.5',
            'text-sm text-foreground',
            'outline-none',
            'transition-colors',
            'placeholder:text-foreground-subtle',
            'focus:border-[var(--brand)]',
            'focus:ring-2 focus:ring-[var(--brand-soft)]',
            'disabled:cursor-not-allowed',
            'disabled:bg-[var(--background-muted)]',
            'disabled:text-foreground-muted',
          )}
        />
      </div>

      <p className="mt-1.5 text-xs text-foreground-muted">
        Maximum amount accepted per seat ({currency}).
      </p>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Parsing
// -----------------------------------------------------------------------------

function parseOptionalPrice(
  value: string,
): number | undefined {
  const trimmed = value.trim();

  if (trimmed === '') {
    return undefined;
  }

  const parsed = Number(trimmed);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return undefined;
  }

  return parsed;
}