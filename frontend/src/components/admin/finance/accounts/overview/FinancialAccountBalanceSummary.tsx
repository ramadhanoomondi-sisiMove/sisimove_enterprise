// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Account Balance Summary
// -----------------------------------------------------------------------------
//
// Displays one account's available, pending, held, and total balance.
// Monetary amounts are integer minor units as defined by the supplied account
// response contract. This component expects already formatted display strings
// so currency precision rules remain in the formatting layer.
// -----------------------------------------------------------------------------

import { Card } from '@/components/ui';
import { FinancialAccountSectionHeader } from '../layout';

export interface FinancialAccountBalanceSummaryProps {
  currency: string;
  availableAmount: string;
  pendingAmount: string;
  heldAmount: string;
  totalAmount: string;
  description?: string;
  className?: string;
}

const balanceRows = [
  { key: 'availableAmount', label: 'Available balance' },
  { key: 'pendingAmount', label: 'Pending balance' },
  { key: 'heldAmount', label: 'Held balance' },
] as const;

export function FinancialAccountBalanceSummary({
  currency,
  availableAmount,
  pendingAmount,
  heldAmount,
  totalAmount,
  description = 'Amounts are shown in the account currency.',
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
        title="Balance summary"
        description={description}
      />

      <div className="mt-6 rounded-[var(--radius-lg)] bg-[var(--background-subtle)] p-4">
        <p className="text-sm text-[var(--foreground-secondary)]">
          Total balance <span className="text-[var(--foreground-muted)]">({currency})</span>
        </p>
        <p className="mt-2 break-words text-3xl font-semibold tracking-tight text-[var(--foreground)]">
          {totalAmount}
        </p>
      </div>

      <dl className="mt-5 divide-y divide-[var(--border-subtle)]">
        {balanceRows.map((row) => (
          <div
            key={row.key}
            className="flex items-center justify-between gap-4 py-3"
          >
            <dt className="text-sm text-[var(--foreground-secondary)]">
              {row.label}
            </dt>
            <dd className="break-words text-right text-sm font-semibold tabular-nums text-[var(--foreground)]">
              {values[row.key]}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

export default FinancialAccountBalanceSummary;
