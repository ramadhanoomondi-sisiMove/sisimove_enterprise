// src/features/journey-demand/components/shared/journey-demand-price.tsx

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Price
// -----------------------------------------------------------------------------
//
// Compact reusable presentation component for Journey Demand pricing.
//
// Responsibilities:
// - Present backend-provided Journey Demand pricing.
// - Respect the backend-provided pricing interpretation flags.
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
// The JourneyDemandPricing model remains the source of truth.
//
// -----------------------------------------------------------------------------

import type { JourneyDemandPricing } from '@/features/journey-demand/models';

import { formatCurrency } from '@/foundation/formatters';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyDemandPriceProps {
  /**
   * Journey Demand pricing supplied by the backend.
   */
  pricing: JourneyDemandPricing;

  /**
   * Optional additional classes for the price presentation.
   */
  className?: string;

  /**
   * Controls the visual emphasis of the price.
   *
   * Compact is appropriate for marketplace cards.
   * Default is appropriate for detail and management surfaces.
   */
  emphasis?: 'compact' | 'default';
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

  if (isUnconstrained) {
    return (
      <div
        className={[
          'min-w-0',
          className ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span
          className={[
            emphasis === 'compact'
              ? 'text-sm'
              : 'text-base',
            'text-[var(--foreground-secondary)]',
          ].join(' ')}
        >
          No price preference
        </span>
      </div>
    );
  }

  if (
    isPreferredPriceOnly &&
    preferredPricePerSeat !== undefined
  ) {
    return (
      <div
        className={[
          'min-w-0',
          className ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div
          className={[
            emphasis === 'compact'
              ? 'text-sm font-medium'
              : 'text-base font-semibold',
            'text-[var(--foreground)]',
          ].join(' ')}
        >
          {formatCurrency(
            preferredPricePerSeat,
            currency,
          )}
        </div>

        <div className="mt-0.5 text-xs text-[var(--foreground-muted)]">
          Preferred per seat
        </div>
      </div>
    );
  }

  if (
    isMaximumPriceOnly &&
    maximumPricePerSeat !== undefined
  ) {
    return (
      <div
        className={[
          'min-w-0',
          className ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div
          className={[
            emphasis === 'compact'
              ? 'text-sm font-medium'
              : 'text-base font-semibold',
            'text-[var(--foreground)]',
          ].join(' ')}
        >
          {formatCurrency(
            maximumPricePerSeat,
            currency,
          )}
        </div>

        <div className="mt-0.5 text-xs text-[var(--foreground-muted)]">
          Maximum per seat
        </div>
      </div>
    );
  }

  if (
    hasPreferredAndMaximumPrice &&
    preferredPricePerSeat !== undefined &&
    maximumPricePerSeat !== undefined
  ) {
    return (
      <div
        className={[
          'min-w-0',
          className ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div
          className={[
            emphasis === 'compact'
              ? 'text-sm font-medium'
              : 'text-base font-semibold',
            'text-[var(--foreground)]',
          ].join(' ')}
        >
          {formatCurrency(
            preferredPricePerSeat,
            currency,
          )}
          {' – '}
          {formatCurrency(
            maximumPricePerSeat,
            currency,
          )}
        </div>

        <div className="mt-0.5 text-xs text-[var(--foreground-muted)]">
          Preferred – maximum per seat
        </div>
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
      <div
        className={[
          'min-w-0',
          className ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div
          className={[
            emphasis === 'compact'
              ? 'text-sm font-medium'
              : 'text-base font-semibold',
            'text-[var(--foreground)]',
          ].join(' ')}
        >
          {formatCurrency(
            preferredPricePerSeat,
            currency,
          )}
        </div>
      </div>
    );
  }

  if (maximumPricePerSeat !== undefined) {
    return (
      <div
        className={[
          'min-w-0',
          className ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div
          className={[
            emphasis === 'compact'
              ? 'text-sm font-medium'
              : 'text-base font-semibold',
            'text-[var(--foreground)]',
          ].join(' ')}
        >
          {formatCurrency(
            maximumPricePerSeat,
            currency,
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={[
        'min-w-0',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span
        className={[
          emphasis === 'compact'
            ? 'text-sm'
            : 'text-base',
          'text-[var(--foreground-secondary)]',
        ].join(' ')}
      >
        No price specified
      </span>
    </div>
  );
}