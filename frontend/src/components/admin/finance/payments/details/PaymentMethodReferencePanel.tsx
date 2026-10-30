// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Payment Method Reference
// -----------------------------------------------------------------------------

import Link from 'next/link';
import { ArrowUpRight, CreditCard } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

import type {
  AdminFinancialPayment,
} from '@/features/admin/finance/payments/models';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface PaymentMethodReferencePanelProps {
  payment: AdminFinancialPayment;
  methodHref?: (methodId: string) => string;
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PaymentMethodReferencePanel({
  payment,
  methodHref,
  className,
}: PaymentMethodReferencePanelProps) {
  const methodId = payment.methodId;
  const href = methodId && methodHref
    ? methodHref(methodId)
    : undefined;

  return (
    <section
      aria-labelledby="payment-method-reference-heading"
      className={cn(
        'min-w-0 rounded-[var(--radius-xl)] border border-[var(--border)]',
        'bg-[var(--surface)] p-5',
        className,
      )}
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--background-subtle)] text-[var(--foreground-secondary)]">
          <CreditCard aria-hidden="true" className="h-5 w-5" />
        </span>

        <div>
          <h2
            id="payment-method-reference-heading"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Payment method
          </h2>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Method reference recorded on the payment.
          </p>
        </div>
      </div>

      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
        Method ID
      </p>

      {methodId ? (
        href ? (
          <Link
            href={href}
            className="inline-flex max-w-full items-center gap-1 break-all text-sm font-semibold text-[var(--brand)] hover:underline focus-visible:outline-2 focus-visible:outline-[var(--brand)]"
          >
            {methodId}
            <ArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 shrink-0"
            />
          </Link>
        ) : (
          <p className="break-all text-sm font-semibold text-[var(--foreground)]">
            {methodId}
          </p>
        )
      ) : (
        <p className="text-sm text-[var(--foreground-muted)]">
          No payment method ID is available.
        </p>
      )}
    </section>
  );
}

export default PaymentMethodReferencePanel;