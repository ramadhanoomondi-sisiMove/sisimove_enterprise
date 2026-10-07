// src/features/journey-demand/components/shared/journey-demand-price.tsx

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Price
// -----------------------------------------------------------------------------
//
// Compact reusable presentation component for Journey Demand pricing.
//
// Responsibilities:
// - Present backend-provided Journey Demand pricing.
// - Respect the backend-provided pricing interpretation.
// - Format monetary values using the shared currency formatter.
// - Clearly distinguish an unconstrained demand from a maximum-price demand.
//
// This component does NOT:
// - perform queries;
// - perform mutations;
// - calculate pricing rules;
// - infer pricing state from nullable values;
// - convert minor units;
// - determine whether a price is acceptable;
// - recreate backend pricing constraints.
//
// Current pricing model:
// - isUnconstrained === true
//      → the traveller has not supplied a maximum price constraint.
//
// - hasMaximumPrice === true
//      → maximumPricePerSeat is the traveller's maximum price per seat.
//
// The component deliberately does not recreate the former preferred-price
// model. The backend JourneyDemandPricing model is the source of truth.
//
// Marketplace presentation:
// - Price is a primary commercial signal.
// - Compact enough for marketplace cards.
// - Maximum price is visually dominant.
// - Does not introduce a nested surface or card.
// -----------------------------------------------------------------------------

import type { JourneyDemandPricing } from '@/features/journey-demand/models';

import { cn } from '@/foundation';
import { formatCurrency } from '@/foundation/formatters';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyDemandPriceProps {
  /**
   * Journey Demand pricing supplied by the backend.
   */
  readonly pricing: JourneyDemandPricing;

  /**
   * Optional additional classes for the price presentation.
   */
  readonly className?: string;

  /**
   * Controls the visual emphasis of the price.
   *
   * Compact is appropriate for marketplace cards.
   * Default is appropriate for detail and management surfaces.
   */
  readonly emphasis?: 'compact' | 'default';
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandPrice({
  pricing,
  className,
  emphasis = 'default',
}: JourneyDemandPriceProps) {
  const {
    maximumPricePerSeat,
    currency,
    isUnconstrained,
    hasMaximumPrice,
  } = pricing;

  const isCompact = emphasis === 'compact';

  const containerClassName = cn(
    'min-w-0',
    className,
  );

  const valueClassName = cn(
    'truncate font-bold leading-tight',
    'text-[var(--foreground)]',
    isCompact ? 'text-base' : 'text-lg',
  );

  const labelClassName = cn(
    'mt-0.5 truncate font-medium',
    'text-[var(--foreground-muted)]',
    isCompact ? 'text-[10px]' : 'text-xs',
  );

  // ---------------------------------------------------------------------------
  // Unconstrained
  // ---------------------------------------------------------------------------
  //
  // The backend explicitly says that this demand has no maximum-price
  // constraint. We present that state directly rather than inferring it from
  // the absence of a numeric value.
  // ---------------------------------------------------------------------------

  if (isUnconstrained) {
    return (
      <div className={containerClassName}>
        <p
          className={cn(
            'font-semibold leading-tight',
            'text-[var(--foreground-secondary)]',
            isCompact ? 'text-sm' : 'text-base',
          )}
        >
          No price limit
        </p>

        <p className={labelClassName}>
          Price preference
        </p>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Maximum price
  // ---------------------------------------------------------------------------
  //
  // hasMaximumPrice is supplied by the backend and therefore remains the
  // authoritative interpretation flag.
  // ---------------------------------------------------------------------------

  if (
    hasMaximumPrice &&
    maximumPricePerSeat !== undefined
  ) {
    return (
      <div className={containerClassName}>
        <p className={valueClassName}>
          {formatCurrency(
            maximumPricePerSeat,
            currency,
          )}
        </p>

        <p className={labelClassName}>
          Maximum / seat
        </p>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Defensive presentation fallback
  // ---------------------------------------------------------------------------
  //
  // A well-formed backend response should normally be handled by one of the
  // explicit branches above.
  //
  // This fallback does not invent another pricing interpretation. If the
  // backend supplied a numeric maximum price but the interpretation flag is
  // unexpectedly inconsistent, we can still present the supplied value
  // without changing the domain model.
  // ---------------------------------------------------------------------------

  if (maximumPricePerSeat !== undefined) {
    return (
      <div className={containerClassName}>
        <p className={valueClassName}>
          {formatCurrency(
            maximumPricePerSeat,
            currency,
          )}
        </p>

        <p className={labelClassName}>
          Maximum / seat
        </p>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // No presentable price
  // ---------------------------------------------------------------------------

  return (
    <div className={containerClassName}>
      <p
        className={cn(
          'font-semibold leading-tight',
          'text-[var(--foreground-secondary)]',
          isCompact ? 'text-sm' : 'text-base',
        )}
      >
        No price specified
      </p>
    </div>
  );
}