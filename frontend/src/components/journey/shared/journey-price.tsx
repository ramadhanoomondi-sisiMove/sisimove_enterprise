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
//   💰 KES 2,500
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
// -----------------------------------------------------------------------------

import { Banknote } from "lucide-react";

import type { JourneyPricing } from "@/features/journey/models";

import { formatCurrency } from "@/foundation/formatters/currency";
import { cn } from "@/foundation/utils/cn";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

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
        "gap-[clamp(0.3rem,0.6vw,0.5rem)]",
        "whitespace-nowrap",
        className,
      )}
    >
      <Banknote
        className={cn(
          "size-[clamp(0.7rem,1.25vw,1rem)]",
          "shrink-0",
          "text-[var(--brand)]",
        )}
        aria-hidden="true"
      />

      <span
        className={cn(
          "min-w-0",
          "text-[clamp(0.8rem,1.5vw,1.15rem)]",
          "font-bold",
          "leading-tight",
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