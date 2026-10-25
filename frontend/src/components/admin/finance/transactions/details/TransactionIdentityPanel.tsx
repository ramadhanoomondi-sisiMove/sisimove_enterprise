import type { AdminFinancialTransaction } from '@/features/admin/finance/transactions/models';
import { TransactionPublicId } from '../shared/TransactionPublicId';
import { TransactionStatusBadge } from '../shared/TransactionStatusBadge';
import { TransactionTypeBadge } from '../shared/TransactionTypeBadge';

export interface TransactionIdentityPanelProps {
  transaction: AdminFinancialTransaction;
}

export function TransactionIdentityPanel({ transaction }: TransactionIdentityPanelProps) {
  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <h2 className="text-base font-semibold text-[var(--foreground)]">Transaction identity</h2>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="min-w-0">
          <dt className="text-sm text-[var(--foreground-muted)]">Transaction ID</dt>
          <dd className="mt-1 break-words font-medium text-[var(--foreground)]">
            <TransactionPublicId publicId={transaction.publicId} />
          </dd>
        </div>
        <div>
          <dt className="text-sm text-[var(--foreground-muted)]">Type</dt>
          <dd className="mt-1"><TransactionTypeBadge type={transaction.type} /></dd>
        </div>
        <div>
          <dt className="text-sm text-[var(--foreground-muted)]">Status</dt>
          <dd className="mt-1"><TransactionStatusBadge status={transaction.status} /></dd>
        </div>
      </dl>
    </section>
  );
}
