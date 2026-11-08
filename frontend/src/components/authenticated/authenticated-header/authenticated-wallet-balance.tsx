
"use client";

// -----------------------------------------------------------------------------
// sisiMove — Authenticated Wallet Balance
// -----------------------------------------------------------------------------
//
// Compact responsive available-wallet-balance indicator.
//
// -----------------------------------------------------------------------------

import Link from "next/link";

import {
  FinancialAmount,
} from "@/components/financial/shared/financial-amount";

import {
  AUTHENTICATED_ROUTES,
} from "@/foundation/routing";

// =============================================================================
// Props
// =============================================================================

export interface AuthenticatedWalletBalanceProps {
  /**
   * Available wallet balance in integer minor units.
   *
   * Null means loading or unavailable.
   */
  readonly availableAmount: number | null;
}

// =============================================================================
// Component
// =============================================================================

export function AuthenticatedWalletBalance({
  availableAmount,
}: AuthenticatedWalletBalanceProps) {
  const isUnavailable = availableAmount === null;

  const needsTopUp =
    availableAmount !== null && availableAmount <= 0;

  return (
    <Link
      href={AUTHENTICATED_ROUTES.WALLET}
      aria-label={
        isUnavailable
          ? "Open wallet. Balance currently unavailable."
          : needsTopUp
            ? "Wallet balance is zero or below. Open wallet to top up."
            : "View wallet balance and wallet"
      }
      title={
        isUnavailable
          ? "Wallet balance unavailable"
          : needsTopUp
            ? "Wallet needs topping up"
            : "Open wallet"
      }
      className={[
        "inline-flex",
        "min-h-9",
        "min-w-0",
        "max-w-full",
        "shrink",
        "items-center",
        "justify-center",
        "gap-1",
        "whitespace-nowrap",
        "rounded-[var(--radius-md)]",
        "px-[clamp(0.375rem,1.5vw,0.75rem)]",
        "py-1.5",
        "text-[clamp(0.7rem,2.5vw,0.875rem)]",
        "font-semibold",
        "transition-colors",
        "duration-150",
        "ease-out",

        isUnavailable
          ? [
              "bg-[var(--background-muted)]",
              "text-[var(--foreground-muted)]",
            ].join(" ")
          : needsTopUp
            ? [
                "border",
                "border-[var(--danger)]",
                "bg-[var(--danger-soft)]",
                "text-[var(--danger)]",
                "hover:bg-red-100",
              ].join(" ")
            : [
                "bg-[var(--brand-soft)]",
                "text-[var(--brand)]",
                "hover:bg-[var(--brand)]",
                "hover:!text-white",
              ].join(" "),

        "focus-visible:outline-none",
        "focus-visible:ring-2",

        needsTopUp
          ? "focus-visible:ring-[var(--danger)]"
          : "focus-visible:ring-[var(--brand)]",

        "focus-visible:ring-offset-2",
        "focus-visible:ring-offset-[var(--surface)]",
      ].join(" ")}
    >
      {needsTopUp && (
        <span
          aria-hidden="true"
          className="shrink-0 font-bold"
        >
          !
        </span>
      )}

      {isUnavailable ? (
        <span className="text-xs sm:text-sm">
          Wallet
        </span>
      ) : (
        <FinancialAmount
          amount={availableAmount}
          currency="KES"
          tone={needsTopUp ? "negative" : "default"}
          stackCurrencyOnNarrowScreens
        />
      )}

      {needsTopUp && (
        <span className="shrink-0 text-[0.7rem] font-bold">
          Top up
        </span>
      )}
    </Link>
  );
}

export default AuthenticatedWalletBalance;
