
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
// - Optionally stack the currency above the amount on narrow screens.
//
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
   */
  amount: number;

  /**
   * ISO currency code.
   */
  currency?: string;

  /**
   * Presentation tone only.
   */
  tone?: FinancialAmountTone;

  /**
   * Stack currency above the numeric amount on narrow screens.
   *
   * The currency and amount remain inline on larger screens.
   */
  stackCurrencyOnNarrowScreens?: boolean;
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
  stackCurrencyOnNarrowScreens = false,
  className,
  ...props
}: FinancialAmountProps) {
  const formattedAmount = formatCurrencyMinorUnits(amount, currency);

  // Preserve the formatter's output. Only separate its currency prefix
  // for optional responsive presentation.
  const formattedParts = formattedAmount.trim().split(/\s+/);

  const currencyLabel = formattedParts[0] ?? "";

  const numericAmount = formattedParts.slice(1).join(" ");

  const canStackCurrency =
    stackCurrencyOnNarrowScreens && numericAmount.length > 0;

  return (
    <span
      className={[
        "tabular-nums",
        TONE_CLASS_NAMES[tone],
        canStackCurrency
          ? "inline-flex min-w-0 items-center gap-1 max-[380px]:flex-col max-[380px]:justify-center max-[380px]:gap-0 max-[380px]:leading-tight"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {canStackCurrency ? (
        <>
          <span className="text-[0.7em] font-medium">
            {currencyLabel}
          </span>

          <span className="whitespace-nowrap">
            {numericAmount}
          </span>
        </>
      ) : (
        formattedAmount
      )}
    </span>
  );
}
