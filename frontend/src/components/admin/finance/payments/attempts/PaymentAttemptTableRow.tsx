// -----------------------------------------------------------------------------
// sisiMove Admin — Payment Attempt Table Row
// -----------------------------------------------------------------------------

import { cn } from '@/foundation/utils/cn';

import {
  PaymentAmount,
  PaymentDate,
  PaymentPublicId,
  PaymentStatusBadge,
} from '../shared';

import type {
  AdminFinancialPaymentAttempt,
} from '@/features/admin/finance/payments/models';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface PaymentAttemptTableRowProps {
  attempt: AdminFinancialPaymentAttempt;
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PaymentAttemptTableRow({
  attempt,
  className,
}: PaymentAttemptTableRowProps) {
  return (
    <tr
      className={cn(
        'transition-colors hover:bg-[var(--background-subtle)]',
        className,
      )}
    >
      <td className="px-4 py-4 align-middle">
        <div className="min-w-0 break-all">
          <PaymentPublicId publicId={attempt.publicId} />
        </div>

        {attempt.providerReference ? (
          <p
            className="mt-1 max-w-52 truncate text-xs text-[var(--foreground-muted)]"
            title={attempt.providerReference}
          >
            Provider ref: {attempt.providerReference}
          </p>
        ) : null}
      </td>

      <td className="px-4 py-4 align-middle">
        <span className="break-words text-sm text-[var(--foreground-secondary)]">
          {attempt.provider || '—'}
        </span>
      </td>

      <td className="px-4 py-4 text-right align-middle">
        <PaymentAmount
          amount={attempt.amount}
          currency={attempt.currency}
        />
      </td>

      <td className="px-4 py-4 align-middle">
        <PaymentStatusBadge status={attempt.status} />
      </td>

      <td className="px-4 py-4 align-middle text-sm text-[var(--foreground-secondary)]">
        {attempt.startedAt ? (
          <PaymentDate value={attempt.startedAt} format="datetime" />
        ) : (
          <PaymentDate value={attempt.createdAt} format="datetime" />
        )}
      </td>

      <td className="px-4 py-4 align-middle text-sm text-[var(--foreground-secondary)]">
        {attempt.completedAt ? (
          <PaymentDate value={attempt.completedAt} format="datetime" />
        ) : attempt.failedAt ? (
          <PaymentDate value={attempt.failedAt} format="datetime" />
        ) : attempt.cancelledAt ? (
          <PaymentDate value={attempt.cancelledAt} format="datetime" />
        ) : attempt.expiredAt ? (
          <PaymentDate value={attempt.expiredAt} format="datetime" />
        ) : (
          '—'
        )}
      </td>
    </tr>
  );
}

export default PaymentAttemptTableRow;