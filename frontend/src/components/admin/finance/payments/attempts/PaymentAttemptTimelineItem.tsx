// -----------------------------------------------------------------------------
// sisiMove Admin — Payment Attempt Timeline Item
// -----------------------------------------------------------------------------

import { CheckCircle2, Circle, Clock3, XCircle } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

import { PaymentDate, PaymentStatusBadge } from '../shared';

import type {
  AdminFinancialPaymentAttempt,
} from '@/features/admin/finance/payments/models';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface PaymentAttemptTimelineItemProps {
  attempt: AdminFinancialPaymentAttempt;
  isLast?: boolean;
  className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function getAttemptIcon(status: AdminFinancialPaymentAttempt['status']) {
  switch (status) {
    case 'succeeded':
      return CheckCircle2;
    case 'failed':
    case 'expired':
    case 'cancelled':
      return XCircle;
    case 'processing':
      return Clock3;
    default:
      return Circle;
  }
}

function getAttemptTimestamp(attempt: AdminFinancialPaymentAttempt) {
  return (
    attempt.completedAt ??
    attempt.failedAt ??
    attempt.cancelledAt ??
    attempt.expiredAt ??
    attempt.startedAt ??
    attempt.createdAt
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PaymentAttemptTimelineItem({
  attempt,
  isLast = false,
  className,
}: PaymentAttemptTimelineItemProps) {
  const StatusIcon = getAttemptIcon(attempt.status);
  const timestamp = getAttemptTimestamp(attempt);

  return (
    <li className={cn('relative flex gap-4', className)}>
      <div className="flex w-9 shrink-0 flex-col items-center">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground-secondary)]">
          <StatusIcon aria-hidden="true" className="h-4 w-4" />
        </span>

        {!isLast ? (
          <span
            aria-hidden="true"
            className="my-2 min-h-8 w-px flex-1 bg-[var(--border)]"
          />
        ) : null}
      </div>

      <div className="min-w-0 flex-1 pb-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="break-all text-sm font-semibold text-[var(--foreground)]">
              Attempt {attempt.publicId}
            </p>

            <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
              Provider: {attempt.provider || '—'}
            </p>
          </div>

          <PaymentStatusBadge status={attempt.status} />
        </div>

        <p className="mt-2 text-xs text-[var(--foreground-muted)]">
          {timestamp ? (
            <PaymentDate value={timestamp} format="datetime" />
          ) : (
            'No timestamp available'
          )}
        </p>

        {attempt.providerReference ? (
          <p
            className="mt-2 max-w-full break-all text-xs text-[var(--foreground-muted)]"
            title={attempt.providerReference}
          >
            Provider reference: {attempt.providerReference}
          </p>
        ) : null}

        {attempt.status === 'failed' && attempt.failureMessage ? (
          <p className="mt-2 text-sm text-[var(--danger)]">
            {attempt.failureMessage}
          </p>
        ) : null}
      </div>
    </li>
  );
}

export default PaymentAttemptTimelineItem;