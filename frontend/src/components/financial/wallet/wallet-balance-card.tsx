// -----------------------------------------------------------------------------
// sisiMove — Wallet Balance Card
// -----------------------------------------------------------------------------
//
// Primary financial balance surface for the wallet.
//
// Responsibility:
// - Present the currently available wallet balance.
// - Format the amount through the shared FinancialAmount component.
// - Optionally expose a caller-provided action.
//
// This component does NOT:
// - fetch wallet data;
// - calculate balances;
// - mutate financial state;
// - interpret transaction state;
// - know about API responses.
//
// The wallet feature owns data retrieval and mapping.
// This component owns presentation only.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import { FinancialAmount } from '../shared/financial-amount';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface WalletBalanceCardProps {
  /**
   * Amount currently available in the wallet.
   *
   * Expressed in integer minor units.
   */
  availableAmount: number;

  /**
   * Currency used by the financial account.
   */
  currency?: string;

  /**
   * Optional action rendered alongside the balance.
   *
   * The caller decides what the action does. This keeps the component
   * independent from payment, withdrawal, or other financial workflows.
   */
  action?: ReactNode;
}

// -----------------------------------------------------------------------------
// Wallet Balance Card
// -----------------------------------------------------------------------------

export function WalletBalanceCard({
  availableAmount,
  currency = 'KES',
  action,
}: WalletBalanceCardProps) {
  return (
    <section
      aria-labelledby="wallet-balance-card-title"
      className={[
        'surface',
        'p-5',
      ].join(' ')}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p
            id="wallet-balance-card-title"
            className="text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]"
          >
            Available balance
          </p>

          <FinancialAmount
            amount={availableAmount}
            currency={currency}
            tone="default"
            className="mt-2 block text-2xl font-semibold tracking-tight sm:text-3xl"
          />
        </div>

        {action ? (
          <div className="w-full shrink-0 sm:w-auto">
            {action}
          </div>
        ) : null}
      </div>
    </section>
  );
}