import type { AdminFinancialTransaction } from '@/features/admin/finance/transactions/models';

export interface TransactionBusinessReferencePanelProps {
  transaction: AdminFinancialTransaction;
}

export function TransactionBusinessReferencePanel({ transaction }: TransactionBusinessReferencePanelProps) {
  const reference = transaction.reference?.trim();

  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <h2 className="text-base font-semibold text-[var(--foreground)]">Business reference</h2>
      <dl className="mt-4">
        <div className="min-w-0">
          <dt className="text-sm text-[var(--foreground-muted)]">Reference</dt>
          <dd className="mt-1 break-all font-mono text-sm text-[var(--foreground)]">
            {reference || 'No business reference provided'}
          </dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-[var(--foreground-muted)]">
        This is the reference recorded on the transaction. No additional business metadata is assumed.
      </p>
    </section>
  );
}
