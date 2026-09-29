// src/features/journey-demand/components/shared/journey-demand-price.tsx

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Price
// -----------------------------------------------------------------------------
//
// Compact reusable presentation component for Journey Demand pricing.
//
// Responsibilities:
// - Present backend-provided Journey Demand pricing.
// - Respect backend-provided pricing interpretation flags.
// - Format monetary values using the shared currency formatter.
// - Clearly distinguish preferred and maximum prices when both are supplied.
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
// Marketplace presentation:
// - Price is a primary commercial signal.
// - Compact enough for the marketplace card.
// - Preferred price is visually dominant.
// - Secondary pricing interpretation remains readable.
// - Does not introduce a nested surface or card.
//
// The JourneyDemandPricing model remains the source of truth.
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
    preferredPricePerSeat,
    currency,
    isUnconstrained,
    isPreferredPriceOnly,
    isMaximumPriceOnly,
    hasPreferredAndMaximumPrice,
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
          No price preference
        </p>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Preferred price only
  // ---------------------------------------------------------------------------

  if (
    isPreferredPriceOnly &&
    preferredPricePerSeat !== undefined
  ) {
    return (
      <div className={containerClassName}>
        <p className={valueClassName}>
          {formatCurrency(
            preferredPricePerSeat,
            currency,
          )}
        </p>

        <p className={labelClassName}>
          Preferred / seat
        </p>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Maximum price only
  // ---------------------------------------------------------------------------

  if (
    isMaximumPriceOnly &&
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
  // Preferred + maximum
  // ---------------------------------------------------------------------------

  if (
    hasPreferredAndMaximumPrice &&
    preferredPricePerSeat !== undefined &&
    maximumPricePerSeat !== undefined
  ) {
    return (
      <div className={containerClassName}>
        <p
          className={cn(
            valueClassName,
            'whitespace-nowrap',
          )}
        >
          {formatCurrency(
            preferredPricePerSeat,
            currency,
          )}
          <span className="px-1 font-normal text-[var(--foreground-muted)]">
            –
          </span>
          {formatCurrency(
            maximumPricePerSeat,
            currency,
          )}
        </p>

        <p className={labelClassName}>
          Preferred – maximum / seat
        </p>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Defensive presentation fallback
  // ---------------------------------------------------------------------------
  //
  // The backend-provided interpretation flags should normally make one of the
  // branches above applicable.
  //
  // This fallback deliberately does not infer a new pricing state. It only
  // presents whichever explicitly supplied value is available.
  //
  // ---------------------------------------------------------------------------

  if (preferredPricePerSeat !== undefined) {
    return (
      <div className={containerClassName}>
        <p className={valueClassName}>
          {formatCurrency(
            preferredPricePerSeat,
            currency,
          )}
        </p>
      </div>
    );
  }

  if (maximumPricePerSeat !== undefined) {
    return (
      <div className={containerClassName}>
        <p className={valueClassName}>
          {formatCurrency(
            maximumPricePerSeat,
            currency,
          )}
        </p>
      </div>
    );
  }

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