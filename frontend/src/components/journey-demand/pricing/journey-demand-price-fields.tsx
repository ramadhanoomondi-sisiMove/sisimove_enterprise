// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Price Fields
// -----------------------------------------------------------------------------
//
// Controlled pricing fields for authenticated Journey Demand editing.
//
// Backend write contract
// -----------------------------------------------------------------------------
//
// The current backend pricing mutation accepts:
//
//   maxFare
//   currency
//
// Therefore:
//
// - maximumPricePerSeat is editable;
// - preferredPricePerSeat is display-only;
// - currency is display-only;
// - backend-derived pricing flags remain untouched.
//
// This distinction is intentional.
//
// The read model can contain preferredPricePerSeat even though the current
// command model does not expose a mutation for changing it.
//
// The frontend must not manufacture a preferred-price mutation merely because
// the read model contains the field.
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
// - does not call an API;
// - does not construct mutation requests;
// - does not calculate pricing flags;
// - does not authorize the user.
//
// The parent editor owns persistence through the appropriate mutation hook.
// -----------------------------------------------------------------------------

'use client';

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
  return (
    <div
      className={cn(
        'grid min-w-0 gap-4',
        'grid-cols-1 sm:grid-cols-2',
        className,
      )}
    >
      {/* ---------------------------------------------------------------------
          Preferred price

          This value exists in the read model but is not currently writable
          through UpdateJourneyDemandPricingDto.

          It is therefore displayed as read-only rather than pretending that
          the edit screen can persist a change.
      --------------------------------------------------------------------- */}

      <PriceDisplayField
        label="Preferred price per seat"
        value={pricing.preferredPricePerSeat}
        currency={pricing.currency}
      />

      {/* ---------------------------------------------------------------------
          Maximum price

          This maps directly to the backend's `maxFare` mutation field.
      --------------------------------------------------------------------- */}

      <PriceField
        id="journey-demand-maximum-price"
        label="Maximum price per seat"
        value={pricing.maximumPricePerSeat}
        currency={pricing.currency}
        disabled={disabled}
        onChange={(value) => {
          if (value === undefined) {
            return;
          }

          onChange?.({
            ...pricing,
            maximumPricePerSeat: value,
          });
        }}
      />

      {/* ---------------------------------------------------------------------
          Currency

          Currency is currently accepted by the backend pricing mutation but
          is not presented as a user-editable field here.

          The current Journey Demand model already supplies the currency.
          Introducing a currency selector would create an additional UX and
          validation decision that is not required by the current design.
      --------------------------------------------------------------------- */}

      <div className="sm:col-span-2">
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
    </div>
  );
}

// -----------------------------------------------------------------------------
// Editable Price Field
// -----------------------------------------------------------------------------

interface PriceFieldProps {
  readonly id: string;
  readonly label: string;
  readonly value: number | undefined;
  readonly currency: string;
  readonly disabled: boolean;
  readonly onChange: (value: number | undefined) => void;
}

function PriceField({
  id,
  label,
  value,
  currency,
  disabled,
  onChange,
}: PriceFieldProps) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-foreground"
      >
        {label}
      </label>

      <div className="relative mt-1.5">
        <input
          id={id}
          type="number"
          min="0"
          step="0.01"
          inputMode="decimal"
          value={value ?? ''}
          disabled={disabled}
          onChange={(event) => {
            onChange(parseOptionalPrice(event.target.value));
          }}
          className={cn(
            'block w-full rounded-[var(--radius-md)]',
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
// Read-only Price Field
// -----------------------------------------------------------------------------

interface PriceDisplayFieldProps {
  readonly label: string;
  readonly value: number | undefined;
  readonly currency: string;
}

function PriceDisplayField({
  label,
  value,
  currency,
}: PriceDisplayFieldProps) {
  return (
    <div className="min-w-0">
      <span className="block text-sm font-medium text-foreground">
        {label}
      </span>

      <div
        className={cn(
          'mt-1.5',
          'rounded-[var(--radius-md)]',
          'border border-[var(--border)]',
          'bg-[var(--background-muted)]',
          'px-3 py-2.5',
        )}
      >
        <span className="text-sm text-foreground">
          {value === undefined
            ? 'Not specified'
            : formatPrice(value, currency)}
        </span>
      </div>

      <p className="mt-1.5 text-xs text-foreground-muted">
        This value is currently managed by the Journey Demand backend
        contract and cannot be edited here.
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

// -----------------------------------------------------------------------------
// Formatting
// -----------------------------------------------------------------------------

function formatPrice(
  value: number,
  currency: string,
): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

