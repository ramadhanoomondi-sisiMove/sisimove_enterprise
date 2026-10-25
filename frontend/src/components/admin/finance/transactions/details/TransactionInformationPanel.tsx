
import type { ReactNode } from 'react';

import type { AdminFinancialTransaction } from '@/features/admin/finance/transactions/models';
import { TransactionAmount } from '../shared/TransactionAmount';
import { TransactionDate } from '../shared/TransactionDate';

export interface TransactionInformationPanelProps {
  transaction: AdminFinancialTransaction;
}

function Value({ children }: { children: ReactNode }) {
  return (
    <dd className="mt-1 break-words text-sm font-medium text-[var(--foreground)]">
      {children}
    </dd>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-sm text-[var(--foreground-muted)]">
        {label}
      </dt>
      <Value>{children}</Value>
    </div>
  );
}

export function TransactionInformationPanel({
  transaction,
}: TransactionInformationPanelProps) {
  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <h2 className="text-base font-semibold text-[var(--foreground)]">
        Transaction information
      </h2>

      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Amount">
          <TransactionAmount
            amount={transaction.amount}
            currency={transaction.currency}
          />
        </Field>

        <Field label="Currency">
          {transaction.currency || '—'}
        </Field>

        <Field label="Business reference">
          {transaction.reference || '—'}
        </Field>

        <Field label="Created">
          <TransactionDate value={transaction.createdAt} />
        </Field>

        <Field label="Last updated">
          <TransactionDate value={transaction.updatedAt} />
        </Field>
      </dl>
    </section>
  );
}

export default TransactionInformationPanel;
