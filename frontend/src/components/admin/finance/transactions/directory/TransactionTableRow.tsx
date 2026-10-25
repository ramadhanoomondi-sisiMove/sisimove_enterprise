
'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { TransactionAmount } from '../shared/TransactionAmount';
import { TransactionDate } from '../shared/TransactionDate';
import { TransactionPublicId } from '../shared/TransactionPublicId';
import { TransactionStatusBadge } from '../shared/TransactionStatusBadge';
import { TransactionTypeBadge } from '../shared/TransactionTypeBadge';

import type {
  AdminFinancialTransaction,
} from '@/features/admin/finance/transactions/models';

export interface TransactionTableRowProps {
  transaction: AdminFinancialTransaction;
  detailHref?: (publicId: string) => string;
  onViewTransaction?: (transaction: AdminFinancialTransaction) => void;
}

export function TransactionTableRow({
  transaction,
  detailHref = (publicId) =>
    `/admin/finance/transactions/${encodeURIComponent(publicId)}`,
  onViewTransaction,
}: TransactionTableRowProps) {
  const href = detailHref(transaction.publicId);

  const viewActionClassName =
    'inline-flex min-h-9 items-center gap-1 rounded-[var(--radius-md)] px-2 text-sm font-medium text-[var(--brand)] hover:bg-[var(--brand-soft)] focus-visible:outline-2 focus-visible:outline-[var(--brand)]';

  return (
    <tr className="transition-colors hover:bg-[var(--background-subtle)]">
      <td className="px-4 py-4 align-middle">
        <div className="flex min-w-0 flex-col gap-1">
          <div className="w-fit max-w-full text-left">
            {onViewTransaction ? (
              <TransactionPublicId
                publicId={transaction.publicId}
                copyable
              />
            ) : (
              <Link
                href={href}
                className="block w-fit max-w-full rounded-sm focus-visible:outline-2 focus-visible:outline-[var(--brand)]"
              >
                <TransactionPublicId
                  publicId={transaction.publicId}
                  copyable
                />
              </Link>
            )}
          </div>

          {transaction.reference ? (
            <span
              className="max-w-56 truncate text-xs text-[var(--foreground-muted)]"
              title={transaction.reference}
            >
              Ref: {transaction.reference}
            </span>
          ) : null}
        </div>
      </td>

      <td className="px-4 py-4 align-middle">
        <TransactionTypeBadge type={transaction.type} />
      </td>

      <td className="px-4 py-4 text-right align-middle">
        <TransactionAmount
          amount={transaction.amount}
          currency={transaction.currency}
        />
      </td>

      <td className="px-4 py-4 align-middle">
        <TransactionStatusBadge status={transaction.status} />
      </td>

      <td className="px-4 py-4 align-middle">
        <div className="flex min-w-0 flex-col gap-1 text-xs">
          <span
            className="max-w-44 truncate text-[var(--foreground-secondary)]"
            title={transaction.sourceAccountPublicId ?? ''}
          >
            <span className="text-[var(--foreground-muted)]">From </span>
            {transaction.sourceAccountPublicId || '—'}
          </span>

          <span
            className="max-w-44 truncate text-[var(--foreground-secondary)]"
            title={transaction.destinationAccountPublicId ?? ''}
          >
            <span className="text-[var(--foreground-muted)]">To </span>
            {transaction.destinationAccountPublicId || '—'}
          </span>
        </div>
      </td>

      <td className="px-4 py-4 align-middle">
        <TransactionDate value={transaction.createdAt} />
      </td>

      <td className="px-4 py-4 text-right align-middle">
        {onViewTransaction ? (
          <button
            type="button"
            onClick={() => onViewTransaction(transaction)}
            className={viewActionClassName}
          >
            View <ArrowUpRight size={15} aria-hidden="true" />
          </button>
        ) : (
          <Link href={href} className={viewActionClassName}>
            View <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        )}
      </td>
    </tr>
  );
}

export default TransactionTableRow;
