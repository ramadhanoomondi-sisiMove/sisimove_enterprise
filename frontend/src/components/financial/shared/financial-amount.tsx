// =============================================================================
// sisiMove — Financial Amount
// =============================================================================
//
// Shared financial presentation primitive.
//
// Responsibilities:
// - Render monetary amounts consistently across financial UI.
// - Use the existing foundation currency formatter.
// - Treat incoming financial amounts as integer minor units.
// - Provide consistent financial typography and semantic tone.
//
// Architectural boundary:
//
// This component does NOT:
// - calculate balances;
// - perform currency conversion;
// - determine transaction meaning;
// - apply financial business rules;
// - know about payments, withdrawals, transactions, or accounts.
//
// It is purely a presentation component.
//
// Backend financial amounts are represented as integer minor units.
//
// Example for KES:
//
//   100000 → KES 1,000.00
//
// The conversion from minor units to the displayed monetary value belongs
// to the foundation formatting layer.
// =============================================================================

import type { ComponentPropsWithoutRef } from "react";

import { formatCurrencyMinorUnits } from "@/foundation/formatters/currency";

// =============================================================================
// Types
// =============================================================================

export type FinancialAmountTone =
  | "default"
  | "positive"
  | "negative"
  | "muted";

export interface FinancialAmountProps
  extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  /**
   * Monetary amount expressed in integer minor units.
   *
   * Example:
   *
   *   100000 → KES 1,000.00
   */
  amount: number;

  /**
   * ISO currency code.
   *
   * sisiMove currently operates primarily in KES, but keeping the currency
   * explicit prevents this component from becoming permanently KES-specific.
   */
  currency?: string;

  /**
   * Presentation tone.
   *
   * This controls visual emphasis only.
   * It does not alter the monetary value.
   */
  tone?: FinancialAmountTone;
}

// =============================================================================
// Tone Classes
// =============================================================================

const TONE_CLASS_NAMES: Record<FinancialAmountTone, string> = {
  default: "text-[var(--foreground)]",
  positive: "text-[var(--success)]",
  negative: "text-[var(--danger)]",
  muted: "text-[var(--foreground-muted)]",
};

// =============================================================================
// Component
// =============================================================================

export function FinancialAmount({
  amount,
  currency = "KES",
  tone = "default",
  className,
  ...props
}: FinancialAmountProps) {
  const formattedAmount = formatCurrencyMinorUnits(amount, currency);

  return (
    <span
      className={[
        "tabular-nums",
        TONE_CLASS_NAMES[tone],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {formattedAmount}
    </span>
  );
}