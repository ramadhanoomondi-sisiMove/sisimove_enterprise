// -----------------------------------------------------------------------------
// sisiMove — Journey Detail Pricing
// -----------------------------------------------------------------------------
//
// Presentation component for Journey pricing.
//
// Architectural boundary:
// - Does NOT fetch pricing.
// - Does NOT modify pricing.
// - Does NOT perform booking/payment operations.
// - Displays the pricing aggregate already composed into the Journey model.
//
// Financial amounts are stored in integer minor units.
// For KES, for example:
//     150000 -> KES 1,500.00
//
// -----------------------------------------------------------------------------

import type { Journey } from '@/features/journey/models/journey';

import { Badge, Card } from '@/components/ui';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDetailPricingProps {
  journey: Journey;
  className?: string;
}

// -----------------------------------------------------------------------------
// Formatting
// -----------------------------------------------------------------------------

function formatAmount(
  amountInMinorUnits: number,
  currency: string,
): string {
  const amount = amountInMinorUnits / 100;

  try {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString('en-KE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDetailPricing({
  journey,
  className,
}: JourneyDetailPricingProps) {
  const pricing = journey.pricing;

  if (!pricing) {
    return (
      <Card
        variant="outlined"
        padding="md"
        className={className}
      >
        <div className="space-y-2">
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            Pricing
          </h2>

          <p className="text-sm leading-6 text-[var(--foreground-muted)]">
            Pricing has not been configured for this Journey yet.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      variant="outlined"
      padding="md"
      className={className}
    >
      <div className="space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              Pricing
            </h2>

            <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
              Cost-sharing amount for a seat on this Journey.
            </p>
          </div>

          <Badge
            variant="brand"
            size="sm"
          >
            Cost sharing
          </Badge>
        </div>

        <div className="rounded-[var(--radius-lg)] bg-[var(--brand-soft)] p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            Price per seat
          </p>

          <p className="mt-1 text-2xl font-bold tracking-tight text-[var(--foreground)]">
            {formatAmount(
              pricing.amount,
              pricing.currency,
            )}
          </p>
        </div>

        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-[var(--radius-md)] bg-[var(--background-subtle)] p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Currency
            </dt>

            <dd className="mt-1 text-sm font-semibold text-[var(--foreground)]">
              {pricing.currency}
            </dd>
          </div>

          <div className="rounded-[var(--radius-md)] bg-[var(--background-subtle)] p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Amount
            </dt>

            <dd className="mt-1 text-sm font-semibold text-[var(--foreground)]">
              {formatAmount(
                pricing.amount,
                pricing.currency,
              )}
            </dd>
          </div>
        </dl>
      </div>
    </Card>
  );
}