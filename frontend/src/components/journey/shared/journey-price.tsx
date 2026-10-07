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
  const formattedPrice = formatCurrency(
    pricing.amount,
    pricing.currency,
  );

  return (
    <span
      className={cn(
        "inline-flex",
        "min-w-0",
        "max-w-full",
        "items-center",
        "gap-[clamp(0.2rem,0.55vw,0.45rem)]",
        "whitespace-nowrap",
        "overflow-hidden",
        className,
      )}
      aria-label={`Journey price ${formattedPrice}`}
    >
      {/* ---------------------------------------------------------------------
          Price icon
          --------------------------------------------------------------------- */}

      <span
        aria-hidden="true"
        className={cn(
          "flex",
          "shrink-0",
          "items-center",
          "justify-center",
          "rounded-full",
          "bg-[var(--brand-soft)]",
          "text-[var(--brand)]",

          // Uniform scaling:
          "size-[clamp(1rem,2.2vw,1.75rem)]",
        )}
      >
        <Banknote
          aria-hidden="true"
          className="size-[clamp(0.55rem,1vw,0.9rem)]"
        />
      </span>

      {/* ---------------------------------------------------------------------
          Price value
          --------------------------------------------------------------------- */}

      <span
        className={cn(
          "min-w-0",
          "max-w-full",
          "truncate",
          "font-extrabold",
          "leading-none",
          "tracking-tight",
          "text-[var(--foreground)]",

          // Uniform scaling:
          "text-[clamp(0.58rem,1.25vw,1rem)]",
        )}
      >
        {formattedPrice}
      </span>
    </span>
  );
}

export default JourneyPrice;
