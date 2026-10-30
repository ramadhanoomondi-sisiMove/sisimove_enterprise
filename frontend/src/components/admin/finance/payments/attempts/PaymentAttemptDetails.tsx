// -----------------------------------------------------------------------------
// sisiMove Admin — Payment Attempt Details
// -----------------------------------------------------------------------------

import { Activity } from 'lucide-react';

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

export interface PaymentAttemptDetailsProps {
  attempt: AdminFinancialPaymentAttempt;
  className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatDate(value?: string | null) {
  if (!value) return null;

  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp) ? null : value;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PaymentAttemptDetails({
  attempt,
  className,
}: PaymentAttemptDetailsProps) {
  const fields = [
    { label: 'Provider', value: attempt.provider || '—' },
    { label: 'Provider reference', value: attempt.providerReference || '—' },
    { label: 'Failure code', value: attempt.failureCode || '—' },
  ];

  const timestamps = [
    { label: 'Started', value: attempt.startedAt },
    { label: 'Completed', value: attempt.completedAt },
    { label: 'Failed', value: attempt.failedAt },
    { label: 'Cancelled', value: attempt.cancelledAt },
    { label: 'Expired', value: attempt.expiredAt },
    { label: 'Created', value: attempt.createdAt },
    { label: 'Last updated', value: attempt.updatedAt },
  ];

  return (
    <section
      aria-labelledby="payment-attempt-details-heading"
      className={cn(
        'min-w-0 rounded-[var(--radius-xl)] border border-[var(--border)]',
        'bg-[var(--surface)] p-5',
        className,
      )}
    >
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--background-subtle)] text-[var(--foreground-secondary)]">
          <Activity aria-hidden="true" className="h-5 w-5" />
        </span>

        <div className="min-w-0">
          <h2
            id="payment-attempt-details-heading"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Attempt details
          </h2>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Attempt identifiers and processing information.
          </p>
        </div>
      </div>

      <div className="border-b border-[var(--border)] pb-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
          Attempt public ID
        </p>
        <div className="min-w-0 break-all">
          <PaymentPublicId publicId={attempt.publicId} />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] py-4">
        <div>
          <p className="text-xs font-medium text-[var(--foreground-muted)]">
            Status
          </p>
          <div className="mt-2">
            <PaymentStatusBadge status={attempt.status} />
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs font-medium text-[var(--foreground-muted)]">
            Attempt amount
          </p>
          <div className="mt-2 text-sm font-semibold tabular-nums text-[var(--foreground)]">
            <PaymentAmount
              amount={attempt.amount}
              currency={attempt.currency}
            />
          </div>
        </div>
      </div>

      <dl className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.label} className="min-w-0">
            <dt className="mb-1 text-xs font-medium text-[var(--foreground-muted)]">
              {field.label}
            </dt>
            <dd className="break-all text-sm text-[var(--foreground)]">
              {field.value}
            </dd>
          </div>
        ))}

        <div className="min-w-0">
          <dt className="mb-1 text-xs font-medium text-[var(--foreground-muted)]">
            Currency
          </dt>
          <dd className="text-sm text-[var(--foreground)]">
            {attempt.currency || '—'}
          </dd>
        </div>
      </dl>

      <div className="border-t border-[var(--border)] pt-4">
        <h3 className="mb-3 text-sm font-semibold text-[var(--foreground)]">
          Attempt timestamps
        </h3>

        <dl className="space-y-3">
          {timestamps.map((item) => {
            const value = formatDate(item.value);

            return (
              <div
                key={item.label}
                className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
              >
                <dt className="text-sm text-[var(--foreground-secondary)]">
                  {item.label}
                </dt>
                <dd className="text-sm text-[var(--foreground)] sm:text-right">
                  {value ? (
                    <PaymentDate value={value} format="datetime" />
                  ) : (
                    '—'
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}

export default PaymentAttemptDetails;