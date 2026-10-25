'use client';

import { ArrowDown, ArrowDownUp, ArrowUp } from 'lucide-react';

import { Card } from '@/components/ui';
import { TransactionEmptyState } from '../shared/TransactionEmptyState';
import { TransactionErrorState } from '../shared/TransactionErrorState';
import { TransactionLoadingState } from '../shared/TransactionLoadingState';
import { TransactionTableRow } from './TransactionTableRow';

import type { AdminFinancialTransaction } from '@/features/admin/finance/transactions/models';
import type { AdminFinancialTransactionFilters } from '@/features/admin/finance/transactions/models';

export interface TransactionTableProps {
  transactions: AdminFinancialTransaction[];
  filters: AdminFinancialTransactionFilters;
  onSortChange: (sortBy: NonNullable<AdminFinancialTransactionFilters['sortBy']>) => void;
  isLoading?: boolean;
  error?: unknown;
  onRetry?: () => void;
  onClearFilters?: () => void;
  detailHref?: (publicId: string) => string;
  onViewTransaction?: (transaction: AdminFinancialTransaction) => void;
}

type SortableColumn = {
  label: string;
  key: NonNullable<AdminFinancialTransactionFilters['sortBy']>;
  align?: 'left' | 'right';
};

const sortableColumns: SortableColumn[] = [
  { label: 'Amount', key: 'amount', align: 'right' },
  { label: 'Status', key: 'status' },
  { label: 'Created', key: 'createdAt' },
];

export function TransactionTable({
  transactions,
  filters,
  onSortChange,
  isLoading = false,
  error,
  onRetry,
  onClearFilters,
  detailHref,
  onViewTransaction,
}: TransactionTableProps) {
  const sortIcon = (key: SortableColumn['key']) => {
    if (filters.sortBy !== key) return <ArrowDownUp size={14} aria-hidden="true" />;
    return filters.sortDirection === 'asc'
      ? <ArrowUp size={14} aria-hidden="true" />
      : <ArrowDown size={14} aria-hidden="true" />;
  };

  return (
    <Card padding="none" className="min-w-0 overflow-hidden">
      {isLoading ? (
        <div className="p-4 sm:p-6">
          <TransactionTableLoading />
        </div>
      ) : error ? (
        <TransactionErrorState error={error} onRetry={onRetry} />
      ) : transactions.length === 0 ? (
        <TransactionEmptyState
          onClearFilters={onClearFilters}
          className="py-14"
        />
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1050px] border-collapse text-left">
            <caption className="sr-only">Financial transaction directory</caption>
            <thead className="bg-[var(--background-subtle)]">
              <tr className="border-b border-[var(--border)]">
                <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">Transaction</th>
                <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">Type</th>
                {sortableColumns.filter((column) => column.key !== 'createdAt').map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)] ${column.align === 'right' ? 'text-right' : 'text-left'}`}
                  >
                    <button
                      type="button"
                      onClick={() => onSortChange(column.key)}
                      className="inline-flex items-center gap-1.5 rounded-sm hover:text-[var(--foreground)] focus-visible:outline-2 focus-visible:outline-[var(--brand)]"
                      aria-label={`Sort by ${column.label}`}
                    >
                      {column.label}
                      {sortIcon(column.key)}
                    </button>
                  </th>
                ))}
                <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">Accounts</th>
                <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
                  <button
                    type="button"
                    onClick={() => onSortChange('createdAt')}
                    className="inline-flex items-center gap-1.5 rounded-sm hover:text-[var(--foreground)] focus-visible:outline-2 focus-visible:outline-[var(--brand)]"
                    aria-label="Sort by Created"
                  >
                    Created
                    {sortIcon('createdAt')}
                  </button>
                </th>
                <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]"> </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {transactions.map((transaction) => (
                <TransactionTableRow
                  key={transaction.publicId}
                  transaction={transaction}
                  detailHref={detailHref}
                  onViewTransaction={onViewTransaction}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

function TransactionTableLoading() {
  return <TransactionLoadingState rows={6} showHeader />;
}

export default TransactionTable;
