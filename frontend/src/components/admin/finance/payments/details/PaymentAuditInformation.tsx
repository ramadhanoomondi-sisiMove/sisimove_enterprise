// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Payment Audit Information
// -----------------------------------------------------------------------------

import { ClipboardList } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

import { PaymentDate, PaymentPublicId } from '../shared';

import type {
  AdminFinancialPayment,
} from '@/features/admin/finance/payments/models';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface PaymentAuditInformationProps {
  payment: AdminFinancialPayment;
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PaymentAuditInformation({
  payment,
  className,
}: PaymentAuditInformationProps) {
  return (
    <section
      aria-labelledby="payment-audit-information-heading"
      className={cn(
        'min-w-0 rounded-[var(--radius-xl)] border border-[var(--border)]',
        'bg-[var(--surface)] p-5',
        className,
      )}
    >
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--background-subtle)] text-[var(--foreground-secondary)]">
          <ClipboardList aria-hidden="true" className="h-5 w-5" />
        </span>

        <div>
          <h2
            id="payment-audit-information-heading"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Audit information
          </h2>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Identifiers and record timestamps.
          </p>
        </div>
      </div>

      <dl className="space-y-4">
        <div className="min-w-0">
          <dt className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            Payment public ID
          </dt>
          <dd className="min-w-0 break-all">
            <PaymentPublicId publicId={payment.publicId} />
          </dd>
        </div>

        <div>
          <dt className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            Record created
          </dt>
          <dd className="text-sm font-medium text-[var(--foreground)]">
            {payment.createdAt ? (
              <PaymentDate value={payment.createdAt} format="datetime" />
            ) : (
              '—'
            )}
          </dd>
        </div>

        <div>
          <dt className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            Last updated
          </dt>
          <dd className="text-sm font-medium text-[var(--foreground)]">
            {payment.updatedAt ? (
              <PaymentDate value={payment.updatedAt} format="datetime" />
            ) : (
              '—'
            )}
          </dd>
        </div>
      </dl>
    </section>
  );
}

export default PaymentAuditInformation;