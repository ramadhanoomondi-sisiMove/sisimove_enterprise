// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Payment Transaction Reference
// -----------------------------------------------------------------------------

import Link from 'next/link';
import { ArrowUpRight, ArrowLeftRight } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

import type {
  AdminFinancialPayment,
} from '@/features/admin/finance/payments/models';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface PaymentTransactionReferencePanelProps {
  payment: AdminFinancialPayment;
  transactionHref?: (transactionPublicId: string) => string;
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PaymentTransactionReferencePanel({
  payment,
  transactionHref,
  className,
}: PaymentTransactionReferencePanelProps) {
  const transactionPublicId = payment.transactionPublicId;
  const href = transactionPublicId && transactionHref
    ? transactionHref(transactionPublicId)
    : undefined;

  return (
    <section
      aria-labelledby="payment-transaction-reference-heading"
      className={cn(
        'min-w-0 rounded-[var(--radius-xl)] border border-[var(--border)]',
        'bg-[var(--surface)] p-5',
        className,
      )}
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--background-subtle)] text-[var(--foreground-secondary)]">
          <ArrowLeftRight aria-hidden="true" className="h-5 w-5" />
        </span>

        <div>
          <h2
            id="payment-transaction-reference-heading"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Transaction reference
          </h2>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Transaction associated with this payment, if available.
          </p>
        </div>
      </div>

      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
        Transaction public ID
      </p>

      {transactionPublicId ? (
        href ? (
          <Link
            href={href}
            className="inline-flex max-w-full items-center gap-1 break-all text-sm font-semibold text-[var(--brand)] hover:underline focus-visible:outline-2 focus-visible:outline-[var(--brand)]"
          >
            {transactionPublicId}
            <ArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 shrink-0"
            />
          </Link>
        ) : (
          <p className="break-all text-sm font-semibold text-[var(--foreground)]">
            {transactionPublicId}
          </p>
        )
      ) : (
        <p className="text-sm text-[var(--foreground-muted)]">
          No transaction is associated with this payment yet.
        </p>
      )}
    </section>
  );
}

export default PaymentTransactionReferencePanel;