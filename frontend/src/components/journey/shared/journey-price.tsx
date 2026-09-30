// -----------------------------------------------------------------------------
// Path: src/features/journey/components/shared/JourneyPrice.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Journey Price
// -----------------------------------------------------------------------------
//
// Compact presentation of Journey pricing.
//
// Marketplace presentation:
//
//   [banknote] KES 2,500
//
// Product role:
//
//   Clear price
//        │
//        ▼
//   Fast comparison
//        │
//        ▼
//   Booking confidence
//
// Responsibilities:
// - present the Journey price using the shared currency formatter;
// - preserve the backend-supplied amount;
// - preserve the backend-supplied currency code;
// - provide a compact but visually prominent marketplace price;
// - provide a subtle Lucide visual cue for the price.
//
// This component does NOT:
// - convert minor units;
// - divide or multiply the backend amount;
// - apply pricing rules;
// - calculate fees, commissions, or booking costs;
// - recreate JourneyPricing domain behavior.
//
// The backend Journey pricing projection remains the source of truth.
//
// -----------------------------------------------------------------------------

import { Banknote } from "lucide-react";

import type { JourneyPricing } from "@/features/journey/models";

import { formatCurrency } from "@/foundation/formatters/currency";
import { cn } from "@/foundation/utils/cn";

// =============================================================================
// Props
// =============================================================================

export interface JourneyPriceProps {
  /**
   * Journey pricing projection supplied by the backend.
   */
  readonly pricing: JourneyPricing;

  /**
   * Optional additional CSS classes.
   */
  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function JourneyPrice({
  pricing,
  className,
}: JourneyPriceProps) {
  return (
    <span
      className={cn(
        "inline-flex",
        "min-w-0",
        "items-center",
        "gap-2",
        "whitespace-nowrap",
        className,
      )}
      aria-label={`Journey price ${formatCurrency(
        pricing.amount,
        pricing.currency,
      )}`}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex",
          "size-7",
          "shrink-0",
          "items-center",
          "justify-center",
          "rounded-full",
          "bg-[var(--brand-soft)]",
          "text-[var(--brand)]",
        )}
      >
        <Banknote className="size-3.5" />
      </span>

      <span
        className={cn(
          "min-w-0",
          "text-[clamp(0.95rem,1.6vw,1.2rem)]",
          "font-extrabold",
          "leading-none",
          "tracking-tight",
          "text-[var(--foreground)]",
        )}
      >
        {formatCurrency(
          pricing.amount,
          pricing.currency,
        )}
      </span>
    </span>
  );
}

export default JourneyPrice;