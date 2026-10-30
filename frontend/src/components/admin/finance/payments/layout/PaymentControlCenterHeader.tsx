// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Payments Control Center Header
// -----------------------------------------------------------------------------
//
// Introductory heading for the payments control center.
// Presentation-only: does not fetch payments or calculate metrics.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';
import { ReceiptText } from 'lucide-react';

export interface PaymentControlCenterHeaderProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PaymentControlCenterHeader({
  eyebrow = 'FINANCE CONTROL CENTER',
  title = 'Financial Payments',
  description = 'Review payment records, inspect payment statuses, and follow individual payment activity.',
  actions,
  className,
}: PaymentControlCenterHeaderProps) {
  return (
    <header
      className={[
        'flex flex-col gap-5 border-b border-[var(--border)] pb-6',
        'sm:flex-row sm:items-start sm:justify-between',
        className ?? '',
      ].join(' ')}
    >
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--brand-soft)] text-[var(--brand)]">
          <ReceiptText aria-hidden="true" className="h-5 w-5" />
        </span>

        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-[0.14em] text-[var(--foreground-muted)]">
            {eyebrow}
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
            {title}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--foreground-secondary)]">
            {description}
          </p>
        </div>
      </div>

      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      ) : null}
    </header>
  );
}

export default PaymentControlCenterHeader;