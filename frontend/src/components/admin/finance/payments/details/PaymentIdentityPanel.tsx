// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Payment Identity Panel
// -----------------------------------------------------------------------------

import { Fingerprint } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

import {
  PaymentAmount,
  PaymentPublicId,
  PaymentStatusBadge,
} from '../shared';

import type {
  AdminFinancialPayment,
} from '@/features/admin/finance/payments/models';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface PaymentIdentityPanelProps {
  payment: AdminFinancialPayment;
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PaymentIdentityPanel({
  payment,
  className,
}: PaymentIdentityPanelProps) {
  return (
    <section
      aria-labelledby="payment-identity-heading"
      className={cn(
        'min-w-0 rounded-[var(--radius-xl)] border border-[var(--border)]',
        'bg-[var(--surface)] p-5',
        className,
      )}
    >
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--brand-soft)] text-[var(--brand)]">
          <Fingerprint aria-hidden="true" className="h-5 w-5" />
        </span>

        <div>
          <h2
            id="payment-identity-heading"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Payment identity
          </h2>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Primary identifier and current payment state.
          </p>
        </div>
      </div>

      <div className="border-b border-[var(--border)] pb-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
          Payment public ID
        </p>
        <div className="min-w-0 break-all">
          <PaymentPublicId publicId={payment.publicId} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 pt-4 sm:grid-cols-2">
        <div className="min-w-0">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
            Status
          </p>
          <PaymentStatusBadge status={payment.status} />
        </div>

        <div className="min-w-0">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
            Amount
          </p>
          <div className="break-words text-lg font-semibold tabular-nums text-[var(--foreground)]">
            <PaymentAmount
              amount={payment.amount}
              currency={payment.currency}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default PaymentIdentityPanel;