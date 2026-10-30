// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Payment Lifecycle Panel
// -----------------------------------------------------------------------------

import { Clock3 } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

import { PaymentDate } from '../shared';

import type {
  AdminFinancialPayment,
} from '@/features/admin/finance/payments/models';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface PaymentLifecyclePanelProps {
  payment: AdminFinancialPayment;
  className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function LifecycleDate({
  value,
}: {
  value?: string | null;
}) {
  if (!value) {
    return <span className="text-[var(--foreground-muted)]">—</span>;
  }

  return <PaymentDate value={value} format="datetime" />;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PaymentLifecyclePanel({
  payment,
  className,
}: PaymentLifecyclePanelProps) {
  const events = [
    { label: 'Initiated', value: payment.initiatedAt },
    { label: 'Completed', value: payment.completedAt },
    { label: 'Failed', value: payment.failedAt },
    { label: 'Cancelled', value: payment.cancelledAt },
    { label: 'Created', value: payment.createdAt },
    { label: 'Last updated', value: payment.updatedAt },
  ];

  return (
    <section
      aria-labelledby="payment-lifecycle-heading"
      className={cn(
        'min-w-0 rounded-[var(--radius-xl)] border border-[var(--border)]',
        'bg-[var(--surface)] p-5',
        className,
      )}
    >
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--background-subtle)] text-[var(--foreground-secondary)]">
          <Clock3 aria-hidden="true" className="h-5 w-5" />
        </span>

        <div>
          <h2
            id="payment-lifecycle-heading"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Payment lifecycle
          </h2>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Recorded payment timestamps.
          </p>
        </div>
      </div>

      <dl className="divide-y divide-[var(--border)]">
        {events.map((event) => (
          <div
            key={event.label}
            className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
          >
            <dt className="text-sm text-[var(--foreground-secondary)]">
              {event.label}
            </dt>
            <dd className="min-w-0 text-sm font-medium text-[var(--foreground)] sm:text-right">
              <LifecycleDate value={event.value} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default PaymentLifecyclePanel;