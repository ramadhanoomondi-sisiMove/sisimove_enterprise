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
// Current pricing contract:
//
//     maximumPricePerSeat
//
// The Journey Demand currently expresses only the traveller's maximum
// acceptable price per seat.
//
// This is NOT:
// - a confirmed fare;
// - a booking amount;
// - a commission;
// - a settlement amount;
// - a wallet balance;
// - an accounting value.
//
// Marketplace presentation:
// - Compact by default.
// - Designed to fit inside the Journey Demand marketplace card.
// - Avoids nested card/surface treatment.
// - Keeps the maximum acceptable price visually prominent.
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
          'flex min-w-0 items-center justify-between gap-3',
        )}
      >
        <div className="min-w-0">
          <p
            className={cn(
              'font-medium text-[var(--foreground-secondary)]',
              isCompact ? 'text-[11px]' : 'text-xs',
            )}
          >
            Maximum price
          </p>

          <p
            className={cn(
              'truncate font-bold leading-tight text-[var(--foreground)]',
              isCompact ? 'mt-0.5 text-sm' : 'mt-1 text-base',
            )}
          >
            {pricing.maximumPricePerSeat === null ||
            pricing.maximumPricePerSeat === undefined
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