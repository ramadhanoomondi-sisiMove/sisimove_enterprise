// -----------------------------------------------------------------------------
// sisiMove Admin — Payment Attempt Failure Panel
// -----------------------------------------------------------------------------

import { AlertTriangle } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

import type {
  AdminFinancialPaymentAttempt,
} from '@/features/admin/finance/payments/models';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface PaymentAttemptFailurePanelProps {
  attempt: AdminFinancialPaymentAttempt;
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PaymentAttemptFailurePanel({
  attempt,
  className,
}: PaymentAttemptFailurePanelProps) {
  const hasFailureDetails = Boolean(
    attempt.failureCode || attempt.failureMessage,
  );

  const isFailureStatus =
    attempt.status === 'failed' || attempt.status === 'expired';

  if (!hasFailureDetails && !isFailureStatus) {
    return null;
  }

  return (
    <section
      aria-labelledby="payment-attempt-failure-heading"
      className={cn(
        'min-w-0 rounded-[var(--radius-xl)] border border-[var(--danger)]/25',
        'bg-[var(--danger-soft)] p-5',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-[var(--danger)]/20 bg-[var(--surface)] text-[var(--danger)]">
          <AlertTriangle aria-hidden="true" className="h-5 w-5" />
        </span>

        <div className="min-w-0 flex-1">
          <h2
            id="payment-attempt-failure-heading"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            {attempt.status === 'expired'
              ? 'Attempt expired'
              : 'Attempt failure'}
          </h2>

          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            {hasFailureDetails
              ? 'Failure information recorded for this attempt.'
              : 'This attempt did not complete successfully. No failure details were supplied.'}
          </p>
        </div>
      </div>

      {hasFailureDetails ? (
        <dl className="mt-5 space-y-4">
          {attempt.failureCode ? (
            <div>
              <dt className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
                Failure code
              </dt>
              <dd className="break-all font-mono text-sm font-medium text-[var(--foreground)]">
                {attempt.failureCode}
              </dd>
            </div>
          ) : null}

          {attempt.failureMessage ? (
            <div>
              <dt className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
                Failure message
              </dt>
              <dd className="whitespace-pre-wrap break-words text-sm text-[var(--foreground)]">
                {attempt.failureMessage}
              </dd>
            </div>
          ) : null}
        </dl>
      ) : null}
    </section>
  );
}

export default PaymentAttemptFailurePanel;