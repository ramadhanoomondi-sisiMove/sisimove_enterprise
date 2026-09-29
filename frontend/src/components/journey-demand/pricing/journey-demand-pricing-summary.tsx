// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Pricing Summary
// -----------------------------------------------------------------------------
//
// Read-only presentation of a public Journey Demand pricing projection.
//
// Architecture:
// - Consumes the public pricing contract only.
// - Does not fetch or mutate data.
// - Does not reconstruct pricing state.
// - Does not infer pricing constraints.
// - Does not expose authenticated pricing flags.
//
// Pricing represents the traveller's requested/preferred pricing conditions.
// It is not a confirmed fare, booking amount, commission, settlement amount,
// wallet balance, or accounting value.
//
// Marketplace presentation:
// - Compact by default.
// - Designed to fit inside the Journey Demand marketplace card.
// - Avoids nested card/surface treatment.
// - Keeps the commercial value visually prominent.
// - Uses a single compact pricing row rather than large stacked panels.
// -----------------------------------------------------------------------------

import type { PublicJourneyDemandPricing } from '@/features/journey-demand/models';
import { cn } from '@/foundation';

export interface JourneyDemandPricingSummaryProps {
  readonly pricing: PublicJourneyDemandPricing;
  readonly emphasis?: 'compact' | 'default';
  readonly className?: string;
}

export function JourneyDemandPricingSummary({
  pricing,
  emphasis = 'default',
  className,
}: JourneyDemandPricingSummaryProps) {
  const isCompact = emphasis === 'compact';

  return (
    <section
      className={cn(
        'min-w-0',
        isCompact ? 'px-3 py-2' : 'px-4 py-3',
        className,
      )}
      aria-label="Pricing"
    >
      <div
        className={cn(
          'flex min-w-0 items-center justify-between gap-4',
          isCompact ? 'gap-3' : 'gap-4',
        )}
      >
        <div className="min-w-0">
          <p
            className={cn(
              'font-medium text-[var(--foreground-secondary)]',
              isCompact ? 'text-[11px]' : 'text-xs',
            )}
          >
            Preferred price
          </p>

          <p
            className={cn(
              'truncate font-bold leading-tight text-[var(--foreground)]',
              isCompact ? 'mt-0.5 text-sm' : 'mt-1 text-base',
            )}
          >
            {pricing.preferredPricePerSeat === null
              ? 'Not specified'
              : formatPrice(
                  pricing.preferredPricePerSeat,
                  pricing.currency,
                )}
          </p>
        </div>

        <div
          className={cn(
            'min-w-0 shrink-0 text-right',
            'border-l border-[var(--border-subtle)] pl-3',
          )}
        >
          <p
            className={cn(
              'font-medium text-[var(--foreground-muted)]',
              isCompact ? 'text-[10px]' : 'text-xs',
            )}
          >
            Maximum
          </p>

          <p
            className={cn(
              'truncate font-semibold text-[var(--foreground)]',
              isCompact ? 'mt-0.5 text-xs' : 'mt-1 text-sm',
            )}
          >
            {pricing.maximumPricePerSeat === null
              ? 'Not specified'
              : formatPrice(
                  pricing.maximumPricePerSeat,
                  pricing.currency,
                )}
          </p>
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Formatting
// -----------------------------------------------------------------------------

function formatPrice(
  value: number,
  currency: string,
): string {
  const formattedValue = new Intl.NumberFormat('en-KE', {
    maximumFractionDigits: 2,
  }).format(value);

  return `${currency} ${formattedValue} / seat`;
}