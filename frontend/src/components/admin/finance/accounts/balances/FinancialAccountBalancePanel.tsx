import { Activity, CircleDollarSign, Wallet } from 'lucide-react';
import type { AdminFinancialAccountBalanceOnly } from '@/features/admin/finance/accounts/models';
import { FinancialAccountBalanceBreakdown } from './FinancialAccountBalanceBreakdown';
import { FinancialAccountBalanceMetadata } from './FinancialAccountBalanceMetadata';

export interface FinancialAccountBalancePanelProps {
  balance: AdminFinancialAccountBalanceOnly;
  formatAmount: (minorUnits: number, currency: string) => string;
}

export function FinancialAccountBalancePanel({ balance, formatAmount }: FinancialAccountBalancePanelProps) {
  return (
    <section aria-labelledby="financial-account-balance-title" className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]">
            <Wallet size={20} aria-hidden="true" />
          </span>
          <div>
            <h2 id="financial-account-balance-title" className="font-semibold text-[var(--foreground)]">Balance overview</h2>
            <p className="text-sm text-[var(--foreground-secondary)]">Current balance buckets returned by the financial account API</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--foreground-secondary)]">
          <CircleDollarSign size={15} aria-hidden="true" /> {balance.currency}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Total balance" amount={balance.totalAmount} currency={balance.currency} formatAmount={formatAmount} emphasis />
        <Metric label="Available" amount={balance.availableAmount} currency={balance.currency} formatAmount={formatAmount} />
        <Metric label="Pending" amount={balance.pendingAmount} currency={balance.currency} formatAmount={formatAmount} />
        <Metric label="Held" amount={balance.heldAmount} currency={balance.currency} formatAmount={formatAmount} />
      </div>

      <div className="mt-6">
        <FinancialAccountBalanceBreakdown balance={balance} formatAmount={formatAmount} />
      </div>
      <div className="mt-4">
        <FinancialAccountBalanceMetadata balance={balance} />
      </div>
      <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-[var(--foreground-muted)]">
        <Activity size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
        Total balance is expected to equal available + pending + held. These values are reported in the balance currency and are not combined with other currencies.
      </p>
    </section>
  );
}

function Metric({
  label, amount, currency, formatAmount, emphasis = false,
}: {
  label: string;
  amount: number;
  currency: string;
  formatAmount: (minorUnits: number, currency: string) => string;
  emphasis?: boolean;
}) {
  return (
    <div className={`rounded-xl border p-4 ${emphasis ? 'border-[var(--brand)]/30 bg-[var(--brand-soft)]' : 'border-[var(--border)] bg-[var(--background-muted)]/40'}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">{label}</p>
      <p className={`mt-2 break-words text-lg font-semibold tabular-nums ${emphasis ? 'text-[var(--brand)]' : 'text-[var(--foreground)]'}`}>
        {formatAmount(amount, currency)}
      </p>
    </div>
  );
}

export default FinancialAccountBalancePanel;
