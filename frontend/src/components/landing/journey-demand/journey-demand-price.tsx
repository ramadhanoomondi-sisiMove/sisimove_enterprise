// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Price
// -----------------------------------------------------------------------------
//
// Presentation component for the price preference of a public Journey Demand.
//
// This component displays only the traveller's public pricing preference.
//
// It must never expose:
// - booking fees
// - commissions
// - platform revenue
// - wallet balances
// - payment information
// - settlement information
//
// Commercial remains an authenticated/internal capability.
//
// -----------------------------------------------------------------------------

import type { HTMLAttributes } from 'react';

import { cn } from '../../../foundation/utils/cn';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDemandPriceProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  maximumPricePerSeat?: number | null;
  preferredPricePerSeat?: number | null;
  currency?: string | null;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function normalizePrice(
  value: number | null | undefined,
): number | null {
  if (
    typeof value !== 'number' ||
    !Number.isFinite(value) ||
    value < 0
  ) {
    return null;
  }

  return value;
}

function normalizeCurrency(
  value: string | null | undefined,
): string {
  const normalizedValue = value?.trim().toUpperCase();

  return normalizedValue || 'KES';
}

function formatPrice(
  amount: number,
  currency: string,
): string {
  try {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString('en-KE')}`;
  }
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandPrice({
  maximumPricePerSeat,
  preferredPricePerSeat,
  currency,
  className,
  ...props
}: JourneyDemandPriceProps) {
  const preferredPrice =
    normalizePrice(preferredPricePerSeat);

  const maximumPrice =
    normalizePrice(maximumPricePerSeat);

  const normalizedCurrency =
    normalizeCurrency(currency);

  const displayPrice =
    preferredPrice ?? maximumPrice;

  const hasPreferredPrice =
    preferredPrice !== null;

  const hasMaximumPrice =
    maximumPrice !== null;

  let label = 'Price preference';
  let description = 'No price preference specified.';

  if (displayPrice !== null) {
    if (hasPreferredPrice) {
      label = 'Preferred price';
      description = `${formatPrice(
        displayPrice,
        normalizedCurrency,
      )} per seat`;
    } else if (hasMaximumPrice) {
      label = 'Maximum price';
      description = `Up to ${formatPrice(
        displayPrice,
        normalizedCurrency,
      )} per seat`;
    }
  }

  return (
    <div
      className={cn(
        'flex min-w-0 items-start gap-3',
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-600"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v18M16.5 7.5c0-1.66-1.79-3-4-3s-4 1.34-4 3 1.79 3 4 3 4 1.34 4 3-1.79 3-4 3-4-1.34-4-3"
          />
        </svg>
      </span>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          {label}
        </p>

        <p className="mt-1 text-sm font-medium text-neutral-950">
          {description}
        </p>
      </div>
    </div>
  );
}