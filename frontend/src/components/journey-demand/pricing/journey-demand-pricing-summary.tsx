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
        'surface',
        isCompact ? 'p-4' : 'p-5',
        className,
      )}
      aria-labelledby="journey-demand-pricing-summary-heading"
    >
      <div className="min-w-0">
        <h2
          id="journey-demand-pricing-summary-heading"
          className={cn(
            'font-semibold text-foreground',
            isCompact ? 'text-sm' : 'text-base',
          )}
        >
          Pricing
        </h2>

        <div
          className={cn(
            'mt-4 grid min-w-0 gap-3',
            isCompact
              ? 'grid-cols-1'
              : 'grid-cols-1 sm:grid-cols-2',
          )}
        >
          <PricingValue
            label="Preferred price"
            value={pricing.preferredPricePerSeat}
            currency={pricing.currency}
            emphasis={emphasis}
          />

          <PricingValue
            label="Maximum price"
            value={pricing.maximumPricePerSeat}
            currency={pricing.currency}
            emphasis={emphasis}
          />
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Pricing Value
// -----------------------------------------------------------------------------

interface PricingValueProps {
  readonly label: string;
  readonly value: number | null;
  readonly currency: string;
  readonly emphasis: 'compact' | 'default';
}

function PricingValue({
  label,
  value,
  currency,
  emphasis,
}: PricingValueProps) {
  return (
    <div
      className={cn(
        'min-w-0 rounded-[var(--radius-md)]',
        'bg-[var(--background-subtle)]',
        emphasis === 'compact' ? 'p-3' : 'p-4',
      )}
    >
      <p
        className={cn(
          'text-foreground-muted',
          emphasis === 'compact' ? 'text-xs' : 'text-sm',
        )}
      >
        {label}
      </p>

      <p
        className={cn(
          'mt-1 font-semibold text-foreground',
          emphasis === 'compact' ? 'text-sm' : 'text-base',
        )}
      >
        {value === null
          ? 'Not specified'
          : formatPrice(value, currency)}
      </p>
    </div>
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

