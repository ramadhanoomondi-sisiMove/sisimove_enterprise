
// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Account Balance Summary
// -----------------------------------------------------------------------------
//
// Displays aggregated balances for one currency across the platform.
//
// Monetary values are supplied as raw integer minor units and formatted
// through the shared currency formatter.
// -----------------------------------------------------------------------------

import { WalletCards } from 'lucide-react';

import { Card } from '@/components/ui';
import { formatCurrencyMinorUnits } from '@/foundation/formatters/currency';

import { FinancialAccountSectionHeader } from '../layout';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface FinancialAccountBalanceSummaryProps {
  currency: string;
  availableAmount: number;
  pendingAmount: number;
  heldAmount: number;
  totalAmount: number;
  accountCount?: number;
  description?: string;
  className?: string;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const BALANCE_ROWS = [
  { key: 'availableAmount', label: 'Available balance' },
  { key: 'pendingAmount', label: 'Pending balance' },
  { key: 'heldAmount', label: 'Held balance' },
] as const;

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function FinancialAccountBalanceSummary({
  currency,
  availableAmount,
  pendingAmount,
  heldAmount,
  totalAmount,
  accountCount,
  description = 'Combined balances for accounts denominated in this currency.',
  className,
}: FinancialAccountBalanceSummaryProps) {
  const values = {
    availableAmount,
    pendingAmount,
    heldAmount,
  };

  return (
    <Card padding="lg" className={className}>
      <FinancialAccountSectionHeader
        title={`${currency} balance summary`}
        description={description}
      />

      {typeof accountCount === 'number' && (
        <div className="mt-4 flex items-center gap-2 text-sm text-[var(--foreground-secondary)]">
          <WalletCards size={16} aria-hidden="true" />
          <span>
            {accountCount} account{accountCount === 1 ? '' : 's'}
          </span>
        </div>
      )}

      <div className="mt-5 rounded-[var(--radius-lg)] bg-[var(--background-subtle)] p-4">
        <p className="text-sm text-[var(--foreground-secondary)]">
          Combined total balance
        </p>

        <p className="mt-2 break-words text-3xl font-semibold tracking-tight text-[var(--foreground)]">
          {formatCurrencyMinorUnits(totalAmount, currency)}
        </p>
      </div>

      <dl className="mt-5 divide-y divide-[var(--border-subtle)]">
        {BALANCE_ROWS.map((row) => (
          <div
            key={row.key}
            className="flex items-center justify-between gap-4 py-3"
          >
            <dt className="text-sm text-[var(--foreground-secondary)]">
              {row.label}
            </dt>

            <dd className="break-words text-right text-sm font-semibold tabular-nums text-[var(--foreground)]">
              {formatCurrencyMinorUnits(values[row.key], currency)}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

export default FinancialAccountBalanceSummary;
