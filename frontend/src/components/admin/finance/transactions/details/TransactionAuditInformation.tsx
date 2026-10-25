
import type { AdminFinancialTransaction } from '@/features/admin/finance/transactions/models';
import { TransactionDate } from '../shared/TransactionDate';

export interface TransactionAuditInformationProps {
  transaction: AdminFinancialTransaction;
}

function AuditField({
  label,
  value,
}: {
  label: string;
  value?: string | Date | null;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-sm text-[var(--foreground-muted)]">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-[var(--foreground)]">
        <TransactionDate
          value={value}
          fallback="Not recorded"
        />
      </dd>
    </div>
  );
}

export function TransactionAuditInformation({
  transaction,
}: TransactionAuditInformationProps) {
  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <h2 className="text-base font-semibold text-[var(--foreground)]">
        Audit information
      </h2>

      <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AuditField label="Created at" value={transaction.createdAt} />
        <AuditField label="Last updated at" value={transaction.updatedAt} />
        <AuditField label="Completed at" value={transaction.completedAt} />
        <AuditField label="Failed at" value={transaction.failedAt} />
        <AuditField label="Reversed at" value={transaction.reversedAt} />
        <AuditField label="Cancelled at" value={transaction.cancelledAt} />
      </dl>
    </section>
  );
}

export default TransactionAuditInformation;
