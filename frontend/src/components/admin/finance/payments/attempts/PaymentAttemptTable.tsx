// -----------------------------------------------------------------------------
// sisiMove Admin — Payment Attempt Table
// -----------------------------------------------------------------------------

import { cn } from '@/foundation/utils/cn';

import { PaymentAttemptTableRow } from './PaymentAttemptTableRow';

import type {
  AdminFinancialPaymentAttempt,
} from '@/features/admin/finance/payments/models';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface PaymentAttemptTableProps {
  attempts: AdminFinancialPaymentAttempt[];
  className?: string;
  emptyMessage?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PaymentAttemptTable({
  attempts,
  className,
  emptyMessage = 'No payment attempts have been recorded.',
}: PaymentAttemptTableProps) {
  return (
    <section
      aria-labelledby="payment-attempt-table-heading"
      className={cn(
        'min-w-0 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)]',
        'bg-[var(--surface)]',
        className,
      )}
    >
      <div className="border-b border-[var(--border)] px-5 py-4">
        <h2
          id="payment-attempt-table-heading"
          className="text-base font-semibold text-[var(--foreground)]"
        >
          All attempts
        </h2>
        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          Provider, amount, status, and event timestamps.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead className="bg-[var(--background-subtle)]">
            <tr>
              {[
                'Attempt',
                'Provider',
                'Amount',
                'Status',
                'Started',
                'Finished',
              ].map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className={cn(
                    'px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]',
                    heading === 'Amount' && 'text-right',
                  )}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--border)]">
            {attempts.length > 0 ? (
              attempts.map((attempt) => (
                <PaymentAttemptTableRow
                  key={attempt.publicId}
                  attempt={attempt}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-sm text-[var(--foreground-muted)]"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default PaymentAttemptTable;