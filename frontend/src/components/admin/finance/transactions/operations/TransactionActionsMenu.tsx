
'use client';

import type { AdminFinancialTransaction } from '@/features/admin/finance/transactions/models';

import {
  AdminFinancialTransactionOperation,
} from '@/features/admin/finance/transactions/models';

export type TransactionOperation = AdminFinancialTransactionOperation;

export interface TransactionActionsMenuProps {
  transaction: AdminFinancialTransaction;
  busy?: boolean;
  onSelectOperation: (operation: TransactionOperation) => void;
}

export function TransactionActionsMenu({
  transaction,
  busy = false,
  onSelectOperation,
}: TransactionActionsMenuProps) {
  const status = String(transaction.status).toUpperCase();

  const actions: Array<{
    operation: TransactionOperation;
    label: string;
  }> = [];

  if (status === 'PENDING') {
    actions.push(
      {
        operation: AdminFinancialTransactionOperation.COMPLETE,
        label: 'Complete transaction',
      },
      {
        operation: AdminFinancialTransactionOperation.FAIL,
        label: 'Mark transaction failed',
      },
      {
        operation: AdminFinancialTransactionOperation.CANCEL,
        label: 'Cancel transaction',
      },
    );
  }

  if (status === 'COMPLETED') {
    actions.push({
      operation: AdminFinancialTransactionOperation.REVERSE,
      label: 'Reverse transaction',
    });
  }

  if (actions.length === 0) {
    return (
      <p className="text-sm text-[var(--foreground-muted)]">
        No operations available for this transaction status.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2" aria-label="Transaction operations">
      {actions.map(({ operation, label }) => (
        <button
          key={operation}
          type="button"
          disabled={busy}
          onClick={() => onSelectOperation(operation)}
          className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--background-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default TransactionActionsMenu;
