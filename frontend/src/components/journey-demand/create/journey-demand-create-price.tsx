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
// Backend pricing contract:
//
//   maxFare
//   currency
//
// Therefore this creation step collects only:
//
//   maximumPricePerSeat
//
// Preferred pricing is intentionally not collected here because the current
// backend creation/update command does not expose a preferred-price mutation.
//
// The backend remains authoritative for pricing validation and interpretation.
//
// -----------------------------------------------------------------------------

'use client';

import type { ChangeEvent } from 'react';

import { Input } from '@/components/ui';
import { cn } from '@/foundation';

// -----------------------------------------------------------------------------
// Value
// -----------------------------------------------------------------------------

export interface JourneyDemandCreatePriceValue {
  /**
   * Maximum amount the traveller is willing to pay per seat.
   *
   * Maps to the backend pricing command field `maxFare`.
   */
  readonly maximumPricePerSeat: number | undefined;
}

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDemandCreatePriceProps {
  readonly value: JourneyDemandCreatePriceValue;

  readonly onChange: (
    value: JourneyDemandCreatePriceValue,
  ) => void;

  /**
   * Validation error supplied by the parent form.
   *
   * Input.error expects string | undefined.
   */
  readonly maximumPriceError?: string;

  readonly currency?: string;
  readonly disabled?: boolean;
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandCreatePrice({
  value,
  onChange,
  maximumPriceError,
  currency = 'KES',
  disabled = false,
  className,
}: JourneyDemandCreatePriceProps) {
  const handleMaximumPriceChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    onChange({
      ...value,
      maximumPricePerSeat: parseOptionalPrice(
        event.target.value,
      ),
    });
  };

  const hasMaximumPrice =
    value.maximumPricePerSeat !== undefined;

  return (
    <section
      className={cn(
        'min-w-0',
        className,
      )}
      aria-labelledby="journey-demand-create-price-heading"
    >
      {/* ---------------------------------------------------------------------
          Header
      --------------------------------------------------------------------- */}

      <div className="min-w-0">
        <div
          className={cn(
            'flex h-8 w-8 items-center justify-center',
            'rounded-full',
            'bg-[var(--brand-soft)]',
            'text-sm font-semibold text-[var(--brand)]',
          )}
          aria-hidden="true"
        >
          4
        </div>

        <h2
          id="journey-demand-create-price-heading"
          className="mt-4 text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl"
        >
          What price works for you?
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--foreground-secondary)]">
          Set the maximum price you are willing to pay for
          this travel need.
        </p>
      </div>

      {/* ---------------------------------------------------------------------
          Pricing field
      --------------------------------------------------------------------- */}

      <div
        className={cn(
          'mt-7 min-w-0',
          'rounded-[var(--radius-lg)]',
          'border border-[var(--border)]',
          'bg-[var(--background-subtle)]',
          'p-5 sm:p-6',
        )}
      >
        <div className="max-w-md">
          <Input
            id="journey-demand-create-maximum-price"
            name="maximumPricePerSeat"
            type="number"
            label={`Maximum price per seat (${currency})`}
            value={value.maximumPricePerSeat ?? ''}
            onChange={handleMaximumPriceChange}
            disabled={disabled}
            min={0}
            step="0.01"
            inputMode="decimal"
            error={maximumPriceError}
            helperText={
              !maximumPriceError
                ? `The highest price per seat you would consider (${currency}).`
                : undefined
            }
            fullWidth
          />
        </div>

        {/* -------------------------------------------------------------------
            Selection summary
        ------------------------------------------------------------------- */}

        {hasMaximumPrice ? (
          <div
            className={cn(
              'mt-5 border-t border-[var(--border-subtle)] pt-4',
              'text-sm',
            )}
          >
            <p className="font-medium text-[var(--foreground)]">
              Your pricing preference
            </p>

            <p className="mt-2 text-[var(--foreground-secondary)]">
              Maximum:{' '}
              <span className="font-medium text-[var(--foreground)]">
                {formatPrice(
                  value.maximumPricePerSeat,
                  currency,
                )}
              </span>
            </p>
          </div>
        ) : null}
      </div>

      {/* ---------------------------------------------------------------------
          Pricing guidance
      --------------------------------------------------------------------- */}

      <div
        className={cn(
          'mt-5 flex items-start gap-3',
          'rounded-[var(--radius-md)]',
          'border border-[var(--border-subtle)]',
          'bg-[var(--surface)]',
          'px-4 py-3',
        )}
      >
        <div
          className={cn(
            'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center',
            'rounded-full',
            'bg-[var(--brand-soft)]',
            'text-xs font-semibold text-[var(--brand)]',
          )}
          aria-hidden="true"
        >
          i
        </div>

        <p className="min-w-0 text-xs leading-5 text-[var(--foreground-muted)]">
          This is your maximum acceptable price per seat,
          not a confirmed fare or booking amount. Final pricing
          remains subject to SisiMove pricing rules and the
          journey offered to you.
        </p>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Parsing
// -----------------------------------------------------------------------------

function parseOptionalPrice(
  rawValue: string,
): number | undefined {
  const trimmedValue = rawValue.trim();

  if (trimmedValue === '') {
    return undefined;
  }

  const parsedValue = Number(trimmedValue);

  if (!Number.isFinite(parsedValue)) {
    return undefined;
  }

  if (parsedValue < 0) {
    return undefined;
  }

  return parsedValue;
}

// -----------------------------------------------------------------------------
// Formatting
// -----------------------------------------------------------------------------

function formatPrice(
  value: number | undefined,
  currency: string,
): string {
  if (value === undefined) {
    return '';
  }

  return `${currency} ${value.toLocaleString('en-KE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export default JourneyDemandCreatePrice;