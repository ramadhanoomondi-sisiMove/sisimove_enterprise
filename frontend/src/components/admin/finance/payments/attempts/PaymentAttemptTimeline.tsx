// -----------------------------------------------------------------------------
// sisiMove Admin — Payment Attempt Timeline
// -----------------------------------------------------------------------------

import { GitBranch } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

import { PaymentAttemptTimelineItem } from './PaymentAttemptTimelineItem';

import type {
  AdminFinancialPaymentAttempt,
} from '@/features/admin/finance/payments/models';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface PaymentAttemptTimelineProps {
  attempts: AdminFinancialPaymentAttempt[];
  className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function getAttemptTimestamp(attempt: AdminFinancialPaymentAttempt) {
  return (
    attempt.startedAt ??
    attempt.createdAt
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PaymentAttemptTimeline({
  attempts,
  className,
}: PaymentAttemptTimelineProps) {
  const sortedAttempts = [...attempts].sort((a, b) => {
    const aTime = new Date(getAttemptTimestamp(a)).getTime();
    const bTime = new Date(getAttemptTimestamp(b)).getTime();

    const safeATime = Number.isNaN(aTime) ? 0 : aTime;
    const safeBTime = Number.isNaN(bTime) ? 0 : bTime;

    return safeATime - safeBTime;
  });

  return (
    <section
      aria-labelledby="payment-attempt-timeline-heading"
      className={cn(
        'min-w-0 rounded-[var(--radius-xl)] border border-[var(--border)]',
        'bg-[var(--surface)] p-5',
        className,
      )}
    >
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--background-subtle)] text-[var(--foreground-secondary)]">
          <GitBranch aria-hidden="true" className="h-5 w-5" />
        </span>

        <div>
          <h2
            id="payment-attempt-timeline-heading"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Attempt timeline
          </h2>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Processing attempts in chronological order.
          </p>
        </div>
      </div>

      {sortedAttempts.length > 0 ? (
        <ol aria-label="Payment attempts">
          {sortedAttempts.map((attempt, index) => (
            <PaymentAttemptTimelineItem
              key={attempt.publicId}
              attempt={attempt}
              isLast={index === sortedAttempts.length - 1}
            />
          ))}
        </ol>
      ) : (
        <p className="rounded-[var(--radius-md)] border border-dashed border-[var(--border)] bg-[var(--background-subtle)] px-4 py-8 text-center text-sm text-[var(--foreground-muted)]">
          No payment attempts have been recorded.
        </p>
      )}
    </section>
  );
}

export default PaymentAttemptTimeline;