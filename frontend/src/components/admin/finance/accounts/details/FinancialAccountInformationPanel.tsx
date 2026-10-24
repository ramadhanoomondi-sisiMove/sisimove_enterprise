import { CircleDollarSign, ShieldCheck, Wallet } from 'lucide-react';
import type { AdminFinancialAccount } from '@/features/admin/finance/accounts/models';
import { FinancialAccountStatusBadge, FinancialAccountTypeBadge } from '../shared';

export interface FinancialAccountInformationPanelProps {
  account: AdminFinancialAccount;
  formatAmount: (minorUnits: number, currency: string) => string;
}

function InfoItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 rounded-xl border border-[var(--border)] bg-[var(--background-muted)]/50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">{label}</p>
      <div className="mt-2 text-sm text-[var(--foreground)]">{children}</div>
    </div>
  );
}

export function FinancialAccountInformationPanel({ account, formatAmount }: FinancialAccountInformationPanelProps) {
  return (
    <section aria-labelledby="financial-account-information-title" className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]">
          <Wallet size={20} aria-hidden="true" />
        </span>
        <div>
          <h2 id="financial-account-information-title" className="font-semibold text-[var(--foreground)]">Account information</h2>
          <p className="text-sm text-[var(--foreground-secondary)]">Current account classification and balance breakdown</p>
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <InfoItem label="Account type"><FinancialAccountTypeBadge type={account.type} /></InfoItem>
        <InfoItem label="Account status"><FinancialAccountStatusBadge status={account.status} /></InfoItem>
        <InfoItem label="Currency"><span className="font-semibold">{account.currency}</span></InfoItem>
        <InfoItem label="Available balance"><span className="font-semibold tabular-nums">{formatAmount(account.balance.availableAmount, account.currency)}</span></InfoItem>
        <InfoItem label="Pending balance"><span className="font-semibold tabular-nums">{formatAmount(account.balance.pendingAmount, account.currency)}</span></InfoItem>
        <InfoItem label="Held balance"><span className="font-semibold tabular-nums">{formatAmount(account.balance.heldAmount, account.currency)}</span></InfoItem>
        <InfoItem label="Total balance">
          <span className="inline-flex items-center gap-2 font-semibold tabular-nums"><CircleDollarSign size={16} className="text-[var(--brand)]" aria-hidden="true" />{formatAmount(account.balance.totalAmount, account.currency)}</span>
        </InfoItem>
        <InfoItem label="Balance version"><span className="inline-flex items-center gap-2"><ShieldCheck size={15} aria-hidden="true" />{account.balance.version}</span></InfoItem>
      </div>
    </section>
  );
}
