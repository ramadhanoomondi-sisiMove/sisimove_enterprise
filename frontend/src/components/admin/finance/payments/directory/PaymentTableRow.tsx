// ============================================================
// Financial Payments — Table Row
// ============================================================

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

import { PaymentAmount } from '../shared/PaymentAmount';
import { PaymentDate } from '../shared/PaymentDate';
import { PaymentPublicId } from '../shared/PaymentPublicId';
import { PaymentStatusBadge } from '../shared/PaymentStatusBadge';

import type {
  AdminFinancialPayment,
} from '@/features/admin/finance/payments/models';

// ============================================================
// Types
// ============================================================

export interface PaymentTableRowProps {
  payment: AdminFinancialPayment;
  href: string;
  className?: string;
}

// ============================================================
// Component
// ============================================================

export function PaymentTableRow({
  payment,
  href,
  className,
}: PaymentTableRowProps) {
  const viewActionClassName =
    'inline-flex min-h-9 items-center gap-1 rounded-[var(--radius-md)] px-2 text-sm font-medium text-[var(--brand)] hover:bg-[var(--brand-soft)] focus-visible:outline-2 focus-visible:outline-[var(--brand)]';

  return (
    <tr
      className={cn(
        'transition-colors hover:bg-[var(--background-subtle)]',
        className,
      )}
    >
      {/* Payment identifier and linked transaction */}
      <td className="px-4 py-4 align-middle">
        <div className="flex min-w-0 flex-col gap-1">
          <div className="w-fit max-w-full text-left">
            <Link
              href={href}
              className="block w-fit max-w-full rounded-sm focus-visible:outline-2 focus-visible:outline-[var(--brand)]"
            >
              <PaymentPublicId
                publicId={payment.publicId}
              />
            </Link>
          </div>

          {payment.transactionPublicId ? (
            <span
              className="max-w-56 truncate text-xs text-[var(--foreground-muted)]"
              title={payment.transactionPublicId}
            >
              Transaction: {payment.transactionPublicId}
            </span>
          ) : null}
        </div>
      </td>

      {/* Account */}
      <td className="px-4 py-4 align-middle">
        <span
          className="block max-w-48 truncate text-sm text-[var(--foreground-secondary)]"
          title={payment.accountId}
        >
          {payment.accountId || '—'}
        </span>
      </td>

      {/* Amount */}
      <td className="px-4 py-4 text-right align-middle">
        <PaymentAmount
          amount={payment.amount}
          currency={payment.currency}
        />
      </td>

      {/* Payment status */}
      <td className="px-4 py-4 align-middle">
        <PaymentStatusBadge status={payment.status} />
      </td>

      {/* Created date */}
      <td className="px-4 py-4 align-middle">
        <PaymentDate value={payment.createdAt} />
      </td>

      {/* View action */}
      <td className="px-4 py-4 text-right align-middle">
        <Link href={href} className={viewActionClassName}>
          View
          <ArrowUpRight size={15} aria-hidden="true" />
          <span className="sr-only">
            {' '}payment {payment.publicId}
          </span>
        </Link>
      </td>
    </tr>
  );
}

export default PaymentTableRow;
