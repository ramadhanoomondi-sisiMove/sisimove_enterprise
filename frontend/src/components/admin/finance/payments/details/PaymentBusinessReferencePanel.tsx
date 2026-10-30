// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Payment Business Reference
// -----------------------------------------------------------------------------

import { ArrowUpRight, Building2 } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/foundation/utils/cn';

import type {
  AdminFinancialPayment,
} from '@/features/admin/finance/payments/models';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface PaymentBusinessReferencePanelProps {
  payment: AdminFinancialPayment;
  referenceHref?: (
    referenceType: string,
    referencePublicId: string,
  ) => string;
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PaymentBusinessReferencePanel({
  payment,
  referenceHref,
  className,
}: PaymentBusinessReferencePanelProps) {
  const referenceType = payment.referenceType;
  const referencePublicId = payment.referencePublicId;

  const href =
    referenceType && referencePublicId && referenceHref
      ? referenceHref(referenceType, referencePublicId)
      : undefined;

  const hasReference = Boolean(referenceType || referencePublicId);

  return (
    <section
      aria-labelledby="payment-business-reference-heading"
      className={cn(
        'min-w-0 rounded-[var(--radius-xl)] border border-[var(--border)]',
        'bg-[var(--surface)] p-5',
        className,
      )}
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--background-subtle)] text-[var(--foreground-secondary)]">
          <Building2 aria-hidden="true" className="h-5 w-5" />
        </span>

        <div>
          <h2
            id="payment-business-reference-heading"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Business reference
          </h2>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Business entity linked to this payment.
          </p>
        </div>
      </div>

      {!hasReference ? (
        <p className="text-sm text-[var(--foreground-muted)]">
          No business reference is recorded for this payment.
        </p>
      ) : (
        <dl className="grid grid-cols-1 gap-4">
          <div className="min-w-0">
            <dt className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Reference type
            </dt>
            <dd className="break-all text-sm font-medium text-[var(--foreground)]">
              {referenceType || '—'}
            </dd>
          </div>

          <div className="min-w-0">
            <dt className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Reference public ID
            </dt>
            <dd className="break-all text-sm font-medium text-[var(--foreground)]">
              {referencePublicId ? (
                href ? (
                  <Link
                    href={href}
                    className="inline-flex max-w-full items-center gap-1 text-[var(--brand)] hover:underline focus-visible:outline-2 focus-visible:outline-[var(--brand)]"
                  >
                    <span className="break-all">{referencePublicId}</span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0"
                    />
                  </Link>
                ) : (
                  referencePublicId
                )
              ) : (
                '—'
              )}
            </dd>
          </div>
        </dl>
      )}
    </section>
  );
}

export default PaymentBusinessReferencePanel;