import { ArrowDownToLine, Clock3, LockKeyhole } from 'lucide-react';
import type { AdminFinancialAccountBalanceOnly } from '@/features/admin/finance/accounts/models';

export interface FinancialAccountBalanceBreakdownProps {
  balance: AdminFinancialAccountBalanceOnly;
  formatAmount: (minorUnits: number, currency: string) => string;
}

export function FinancialAccountBalanceBreakdown({ balance, formatAmount }: FinancialAccountBalanceBreakdownProps) {
  const buckets = [
    {
      key: 'available',
      label: 'Available',
      description: 'Funds classified as available in the API response.',
      amount: balance.availableAmount,
      icon: ArrowDownToLine,
      barClass: 'bg-[var(--success)]',
    },
    {
      key: 'pending',
      label: 'Pending',
      description: 'Funds classified as pending in the API response.',
      amount: balance.pendingAmount,
      icon: Clock3,
      barClass: 'bg-[var(--warning)]',
    },
    {
      key: 'held',
      label: 'Held',
      description: 'Funds classified as held in the API response.',
      amount: balance.heldAmount,
      icon: LockKeyhole,
      barClass: 'bg-[var(--foreground-muted)]',
    },
  ] as const;

  const totalBuckets = balance.availableAmount + balance.pendingAmount + balance.heldAmount;

  return (
    <div className="rounded-xl border border-[var(--border)] p-4 sm:p-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">Balance breakdown</h3>
        <p className="text-xs text-[var(--foreground-muted)]">Share of the three reported balance buckets</p>
      </div>
      <div className="mt-5 space-y-5">
        {buckets.map((bucket) => {
          const Icon = bucket.icon;
          const percentage = totalBuckets > 0 ? (bucket.amount / totalBuckets) * 100 : 0;
          return (
            <div key={bucket.key}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Icon size={16} className="text-[var(--foreground-muted)]" aria-hidden="true" />
                  <span className="text-sm font-medium text-[var(--foreground)]">{bucket.label}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold tabular-nums text-[var(--foreground)]">{formatAmount(bucket.amount, balance.currency)}</span>
                  <span className="ml-2 text-xs tabular-nums text-[var(--foreground-muted)]">{percentage.toFixed(1)}%</span>
                </div>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--background-muted)]">
                <div className={`h-full rounded-full transition-[width] ${bucket.barClass}`} style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }} />
              </div>
              <p className="mt-1 text-xs text-[var(--foreground-muted)]">{bucket.description}</p>
            </div>
          );
        })}
      </div>
      {totalBuckets !== balance.totalAmount && (
        <p role="alert" className="mt-4 rounded-lg border border-[var(--danger)]/30 px-3 py-2 text-xs text-[var(--danger)]">
          Balance consistency check failed: the three buckets do not add up to the reported total. Verify the API response before relying on this breakdown.
        </p>
      )}
    </div>
  );
}

export default FinancialAccountBalanceBreakdown;
