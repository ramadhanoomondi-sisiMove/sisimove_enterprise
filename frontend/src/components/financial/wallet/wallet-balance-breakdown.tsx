// -----------------------------------------------------------------------------
// sisiMove — Wallet Balance Breakdown
// -----------------------------------------------------------------------------
//
// Presentation component for the three financial balance buckets exposed by
// the wallet:
//
// - Available
// - Pending
// - Held
//
// Backend source:
//
// FinancialAccountBalance
// ├── availableAmount
// ├── pendingAmount
// └── heldAmount
//
// Architectural boundary:
//
// This component:
// - receives already-resolved financial amounts;
// - presents them consistently;
// - delegates monetary formatting to FinancialAmount.
//
// This component does NOT:
// - fetch the financial account;
// - calculate balances;
// - perform financial operations;
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

export interface WalletBalanceBreakdownProps {
  /**
   * Amount currently available for use.
   *
   * Expressed in integer minor units.
   */
  availableAmount: number;

  /**
   * Amount currently pending.
   *
   * Expressed in integer minor units.
   */
  pendingAmount: number;

  /**
   * Amount currently held.
   *
   * Expressed in integer minor units.
   */
  heldAmount: number;

  /**
   * Currency used by the financial account.
   */
  currency?: string;

  /**
   * Optional additional content rendered below the breakdown.
   *
   * Useful for contextual wallet information without coupling this component
   * to a specific feature.
   */
  footer?: ReactNode;
}

// -----------------------------------------------------------------------------
// Balance Item
// -----------------------------------------------------------------------------

interface BalanceItemProps {
  label: string;
  amount: number;
  currency: string;
  tone?: 'default' | 'positive' | 'warning' | 'muted';
}

// -----------------------------------------------------------------------------
// Tone Mapping
// -----------------------------------------------------------------------------

const amountToneMap: Record<
  NonNullable<BalanceItemProps['tone']>,
  'default' | 'positive' | 'negative' | 'muted'
> = {
  default: 'default',
  positive: 'positive',
  warning: 'default',
  muted: 'muted',
};

// -----------------------------------------------------------------------------
// Balance Item
// -----------------------------------------------------------------------------

function BalanceItem({
  label,
  amount,
  currency,
  tone = 'default',
}: BalanceItemProps) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium text-[var(--foreground-muted)]">
        {label}
      </p>

      <FinancialAmount
        amount={amount}
        currency={currency}
        tone={amountToneMap[tone]}
        className="mt-1 block text-sm font-semibold"
      />
    </div>
  );
}

// -----------------------------------------------------------------------------
// Wallet Balance Breakdown
// -----------------------------------------------------------------------------

export function WalletBalanceBreakdown({
  availableAmount,
  pendingAmount,
  heldAmount,
  currency = 'KES',
  footer,
}: WalletBalanceBreakdownProps) {
  return (
    <section
      aria-labelledby="wallet-balance-breakdown-title"
      className={[
        'rounded-[var(--radius-lg)]',
        'border',
        'border-[var(--border)]',
        'bg-[var(--surface)]',
        'p-4',
      ].join(' ')}
    >
      <div className="mb-4">
        <h2
          id="wallet-balance-breakdown-title"
          className="text-sm font-semibold text-[var(--foreground)]"
        >
          Balance breakdown
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <BalanceItem
          label="Available"
          amount={availableAmount}
          currency={currency}
          tone="positive"
        />

        <BalanceItem
          label="Pending"
          amount={pendingAmount}
          currency={currency}
          tone="default"
        />

        <BalanceItem
          label="Held"
          amount={heldAmount}
          currency={currency}
          tone="muted"
        />
      </div>

      {footer ? (
        <div className="mt-4 border-t border-[var(--border-subtle)] pt-4">
          {footer}
        </div>
      ) : null}
    </section>
  );
}