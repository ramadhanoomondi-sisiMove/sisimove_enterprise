// -----------------------------------------------------------------------------
// sisiMove Admin — Payment Attempts Panel
// -----------------------------------------------------------------------------

import { Activity } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

import { PaymentAttemptTimeline } from './PaymentAttemptTimeline';
import { PaymentAttemptTable } from './PaymentAttemptTable';

import type {
  AdminFinancialPaymentAttempt,
} from '@/features/admin/finance/payments/models';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type PaymentAttemptsView = 'timeline' | 'table' | 'both';

export interface PaymentAttemptsPanelProps {
  attempts: AdminFinancialPaymentAttempt[];
  view?: PaymentAttemptsView;
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PaymentAttemptsPanel({
  attempts,
  view = 'both',
  className,
}: PaymentAttemptsPanelProps) {
  const attemptCount = attempts.length;

  return (
    <section
      aria-labelledby="payment-attempts-heading"
      className={cn('flex min-w-0 flex-col gap-5', className)}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--brand-soft)] text-[var(--brand)]">
            <Activity aria-hidden="true" className="h-5 w-5" />
          </span>

          <div className="min-w-0">
            <h2
              id="payment-attempts-heading"
              className="text-lg font-semibold text-[var(--foreground)]"
            >
              Payment attempts
            </h2>
            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              Processing history and provider outcomes.
            </p>
          </div>
        </div>

        <span className="inline-flex shrink-0 items-center rounded-full border border-[var(--border)] bg-[var(--background-subtle)] px-3 py-1 text-sm font-medium tabular-nums text-[var(--foreground-secondary)]">
          {attemptCount} {attemptCount === 1 ? 'attempt' : 'attempts'}
        </span>
      </div>

      {attemptCount === 0 ? (
        <div className="rounded-[var(--radius-xl)] border border-dashed border-[var(--border)] bg-[var(--surface)] px-5 py-10 text-center">
          <p className="text-sm font-medium text-[var(--foreground-secondary)]">
            No payment attempts recorded
          </p>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Attempts will appear here when they are included in the payment data.
          </p>
        </div>
      ) : (
        <div className="flex min-w-0 flex-col gap-5">
          {view === 'timeline' || view === 'both' ? (
            <PaymentAttemptTimeline attempts={attempts} />
          ) : null}

          {view === 'table' || view === 'both' ? (
            <PaymentAttemptTable attempts={attempts} />
          ) : null}
        </div>
      )}
    </section>
  );
}

export default PaymentAttemptsPanel;