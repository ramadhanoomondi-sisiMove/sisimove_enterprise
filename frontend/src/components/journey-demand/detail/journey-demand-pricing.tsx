// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Pricing
// -----------------------------------------------------------------------------
//
// Detail presentation component for a public Journey Demand's price
// requirements.
//
// A Demand does not contain a confirmed Journey fare. The values shown here
// describe the requester's preferred and/or maximum acceptable price.
//
// Responsibilities:
// - present the preferred price when supplied;
// - present the maximum acceptable price when supplied;
// - preserve explicit absence of either value;
// - present the backend-provided currency.
//
// Non-responsibilities:
// - no data fetching;
// - no mutations;
// - no fare calculation;
// - no price comparison;
// - no booking amount;
// - no provider income;
// - no platform fee;
// - no commission;
// - no settlement or wallet information.
//
// The PublicJourneyDemandPricing projection remains authoritative.
// -----------------------------------------------------------------------------

import type { PublicJourneyDemandPricing } from '@/features/journey-demand/models';

import { cn } from '@/foundation';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDemandPricingProps {
  /**
   * Public Journey Demand pricing projection.
   */
  readonly pricing: PublicJourneyDemandPricing;

  /**
   * Controls presentation density.
   */
  readonly emphasis?: 'compact' | 'default';

  /**
   * Optional additional classes.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatPrice(
  amount: number,
  currency: string,
): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandPricing({
  pricing,
  emphasis = 'default',
  className,
}: JourneyDemandPricingProps) {
  const isCompact = emphasis === 'compact';

  const hasPreferredPrice =
    pricing.preferredPricePerSeat !== null;

  const hasMaximumPrice =
    pricing.maximumPricePerSeat !== null;

  return (
    <section
      aria-labelledby="journey-demand-pricing-heading"
      className={cn('min-w-0', className)}
    >
      <div
        className={cn(
          'mb-3',
          'text-xs',
          'font-medium',
          'uppercase',
          'tracking-wide',
          'text-[var(--foreground-muted)]',
        )}
      >
        <h2 id="journey-demand-pricing-heading">
          Price requirements
        </h2>
      </div>

      <dl
        className={cn(
          'grid',
          'min-w-0',
          'grid-cols-1',
          'gap-3',
          'sm:grid-cols-2',
        )}
      >
        {/* ----------------------------------------------------------------- */}
        {/* Preferred price                                                   */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={cn(
            'min-w-0',
            'rounded-[var(--radius-lg)]',
            'border',
            'border-[var(--border-subtle)]',
            'bg-[var(--surface)]',
            isCompact ? 'p-3' : 'p-4',
          )}
        >
          <dt
            className={cn(
              'text-xs',
              'text-[var(--foreground-muted)]',
            )}
          >
            Preferred price / seat
          </dt>

          {hasPreferredPrice ? (
            <dd
              className={cn(
                'mt-1',
                isCompact
                  ? 'text-sm font-medium'
                  : 'text-base font-semibold',
                'text-[var(--foreground)]',
              )}
            >
              {formatPrice(
                pricing.preferredPricePerSeat,
                pricing.currency,
              )}
            </dd>
          ) : (
            <dd
              className={cn(
                'mt-1',
                'text-sm',
                'text-[var(--foreground-muted)]',
              )}
            >
              Not specified
            </dd>
          )}
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Maximum price                                                     */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={cn(
            'min-w-0',
            'rounded-[var(--radius-lg)]',
            'border',
            'border-[var(--border-subtle)]',
            'bg-[var(--surface)]',
            isCompact ? 'p-3' : 'p-4',
          )}
        >
          <dt
            className={cn(
              'text-xs',
              'text-[var(--foreground-muted)]',
            )}
          >
            Maximum price / seat
          </dt>

          {hasMaximumPrice ? (
            <dd
              className={cn(
                'mt-1',
                isCompact
                  ? 'text-sm font-medium'
                  : 'text-base font-semibold',
                'text-[var(--foreground)]',
              )}
            >
              {formatPrice(
                pricing.maximumPricePerSeat,
                pricing.currency,
              )}
            </dd>
          ) : (
            <dd
              className={cn(
                'mt-1',
                'text-sm',
                'text-[var(--foreground-muted)]',
              )}
            >
              No maximum specified
            </dd>
          )}
        </div>
      </dl>
    </section>
  );
}