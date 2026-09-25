// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Detail Pricing
// -----------------------------------------------------------------------------
//
// Presents the passenger's requested fare expectations.
//
// Responsibilities:
// - Display preferred price per seat when available.
// - Display maximum acceptable price per seat.
// - Display the pricing currency.
//
// This component is presentation-only. Pricing data is supplied by the parent
// detail container and is not fetched here.
// -----------------------------------------------------------------------------

import { Card } from '@/components/ui';

import type { JourneyDemandPricing } from '@/features/journey-demand/models';

export interface JourneyDemandDetailPricingProps {
  pricing: JourneyDemandPricing | null;
}

function formatAmount(
  amount: number | null | undefined,
  currency: string,
): string | null {
  if (amount == null) {
    return null;
  }

  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function JourneyDemandDetailPricing({
  pricing,
}: JourneyDemandDetailPricingProps) {
  if (!pricing) {
    return (
      <Card padding="lg">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-slate-900">
            Pricing
          </h2>

          <p className="text-sm text-slate-500">
            Pricing preferences have not been provided yet.
          </p>
        </div>
      </Card>
    );
  }

  const currency = pricing.currency || 'KES';

  const preferredPrice = formatAmount(
    pricing.preferredPricePerSeat,
    currency,
  );

  const maximumPrice = formatAmount(
    pricing.maximumPricePerSeat,
    currency,
  );

  return (
    <Card padding="lg">
      <div className="space-y-5">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Pricing
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Fare preferences for matching with available journeys.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <PricingItem
            label="Preferred price per seat"
            value={preferredPrice}
          />

          <PricingItem
            label="Maximum price per seat"
            value={maximumPrice}
          />
        </div>

        <p className="text-xs text-slate-500">
          Currency: {currency}
        </p>
      </div>
    </Card>
  );
}

interface PricingItemProps {
  label: string;
  value: string | null;
}

function PricingItem({
  label,
  value,
}: PricingItemProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-base font-semibold text-slate-900">
        {value ?? 'Not specified'}
      </p>
    </div>
  );
}