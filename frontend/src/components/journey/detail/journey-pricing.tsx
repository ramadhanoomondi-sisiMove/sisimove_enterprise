// -----------------------------------------------------------------------------
// sisiMove — Journey Pricing
// -----------------------------------------------------------------------------
//
// Presents the Journey's published price.
//
// Responsibilities:
// - present the amount;
// - present the currency.
//
// Non-responsibilities:
// - no API calls;
// - no data fetching;
// - no booking logic;
// - no fee calculation;
// - no currency conversion;
// - no payment logic;
// - no mutation.
//
// The pricing projection is authoritative. The frontend presents the supplied
// amount and currency without interpreting the amount as minor currency units.
//
// -----------------------------------------------------------------------------

import { cn } from "@/foundation";

import type { JourneyPricing as JourneyPricingModel } from "@/features/journey/models";

import { JourneyPrice } from "../shared";

export interface JourneyPricingProps {
  readonly pricing: JourneyPricingModel;
  readonly className?: string;
}

export function JourneyPricing({
  pricing,
  className,
}: JourneyPricingProps) {
  return (
    <section
      className={cn(
        "w-full",
        "rounded-[var(--radius-lg)]",
        "border border-[var(--border)]",
        "bg-[var(--surface)]",
        "p-4",
        className,
      )}
      aria-labelledby="journey-pricing-heading"
    >
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">
          Cost sharing
        </p>

        <h2
          id="journey-pricing-heading"
          className="mt-1 text-lg font-semibold text-[var(--foreground)]"
        >
          Journey price
        </h2>

        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          The cost-sharing amount for a seat on this Journey.
        </p>
      </div>

      <div
        className={cn(
          "rounded-[var(--radius-md)]",
          "bg-[var(--background-subtle)]",
          "p-4",
        )}
      >
        <JourneyPrice pricing={pricing} />
      </div>
    </section>
  );
}