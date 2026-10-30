// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Payment Activity Summary
// -----------------------------------------------------------------------------
//
// Displays recent payment records supplied by the parent.
// -----------------------------------------------------------------------------

import Link from 'next/link';
import { ArrowRight, ReceiptText } from 'lucide-react';

import {
  PaymentAmount,
  PaymentDate,
  PaymentPublicId,
  PaymentStatusBadge,
} from '../shared';

import type { AdminFinancialPaymentReference } from '@/features/admin/finance/payments';

export interface PaymentActivitySummaryProps {
  payments: AdminFinancialPaymentReference[];
  viewAllHref?: string;
  title?: string;
  description?: string;
  className?: string;
}

export function PaymentActivitySummary({
  payments,
  viewAllHref = '/admin/finance/payments',
  title = 'Recent payment activity',
  description = 'Payment records provided for this activity view.',
  className,
}: PaymentActivitySummaryProps) {
  return (
    <section
      aria-labelledby="payment-activity-summary-title"
      className={[
        'rounded-[var(--radius-xl)] border border-[var(--border)]',
        'bg-[var(--surface)] p-5 sm:p-6',
        className ?? '',
      ].join(' ')}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2
            id="payment-activity-summary-title"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            {title}
          </h2>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            {description}
          </p>
        </div>

        <Link
          href={viewAllHref}
          className={[
            'inline-flex min-h-9 shrink-0 items-center gap-2 rounded-md',
            'text-sm font-medium text-[var(--brand)] transition-colors',
            'hover:opacity-80 focus-visible:outline-2',
            'focus-visible:outline-[var(--brand)] focus-visible:outline-offset-2',
          ].join(' ')}
        >
          View payments
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>

      {payments.length === 0 ? (
        <div className="mt-5 flex min-h-36 flex-col items-center justify-center rounded-[var(--radius-lg)] bg-[var(--background-subtle)] px-4 text-center">
          <ReceiptText
            aria-hidden="true"
            className="mb-3 h-6 w-6 text-[var(--foreground-muted)]"
          />

          <p className="text-sm font-medium text-[var(--foreground)]">
            No payment activity to display
          </p>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Payment records will appear here when supplied by the parent view.
          </p>
        </div>
      ) : (
        <ul className="mt-5 divide-y divide-[var(--border-subtle)]">
          {payments.map((payment) => (
            <li key={payment.publicId} className="py-4 first:pt-0 last:pb-0">
              <Link
                href={`${viewAllHref}/${encodeURIComponent(payment.publicId)}`}
                className={[
                  'flex flex-col gap-3 rounded-md sm:flex-row sm:items-center',
                  'sm:justify-between',
                  'focus-visible:outline-2 focus-visible:outline-[var(--brand)]',
                  'focus-visible:outline-offset-4',
                ].join(' ')}
              >
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--background-muted)] text-[var(--foreground-secondary)]">
                    <ReceiptText aria-hidden="true" className="h-5 w-5" />
                  </span>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <PaymentPublicId publicId={payment.publicId} />
                      <PaymentStatusBadge status={payment.status} />
                    </div>

                    <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                      Created{' '}
                      <PaymentDate value={payment.createdAt} format="datetime" />
                    </p>
                  </div>
                </div>

                <p className="pl-[3.25rem] text-sm font-semibold tabular-nums text-[var(--foreground)] sm:pl-0 sm:text-right">
                  <PaymentAmount
                    amount={payment.amount}
                    currency={payment.currency}
                  />
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default PaymentActivitySummary;