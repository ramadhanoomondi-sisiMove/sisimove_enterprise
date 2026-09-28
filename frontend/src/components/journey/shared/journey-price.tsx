// -----------------------------------------------------------------------------
// sisiMove — Journey Price
// -----------------------------------------------------------------------------
//
// Reusable presentation of Journey pricing.
//
// Responsibilities:
// - Present the Journey price using the shared currency formatter.
// - Preserve the backend-supplied amount without reinterpretation.
// - Preserve the backend-supplied currency code.
// - Provide a compact pricing presentation for Journey marketplace and detail
//   surfaces.
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
        "text-sm",
        "font-semibold",
        "text-[var(--foreground)]",
        className,
      )}
    >
      {formatCurrency(pricing.amount, pricing.currency)}
    </span>
  );
}