// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Payment Information Panel
// -----------------------------------------------------------------------------

import { FileText } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

import type {
  AdminFinancialPayment,
} from '@/features/admin/finance/payments/models';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface PaymentInformationPanelProps {
  payment: AdminFinancialPayment;
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PaymentInformationPanel({
  payment,
  className,
}: PaymentInformationPanelProps) {
  const fields = [
    {
      label: 'Currency',
      value: payment.currency || '—',
    },
    {
      label: 'Recorded attempts',
      value: String(payment.attempts?.length ?? 0),
    },
    {
      label: 'Reference type',
      value: payment.referenceType || '—',
    },
    {
      label: 'Reference public ID',
      value: payment.referencePublicId || '—',
    },
  ];

  return (
    <section
      aria-labelledby="payment-information-heading"
      className={cn(
        'min-w-0 rounded-[var(--radius-xl)] border border-[var(--border)]',
        'bg-[var(--surface)] p-5',
        className,
      )}
    >
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--background-subtle)] text-[var(--foreground-secondary)]">
          <FileText aria-hidden="true" className="h-5 w-5" />
        </span>

        <div>
          <h2
            id="payment-information-heading"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Payment information
          </h2>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Additional fields recorded for this payment.
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div
            key={field.label}
            className="min-w-0 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--background-subtle)] p-3"
          >
            <dt className="text-xs font-medium text-[var(--foreground-muted)]">
              {field.label}
            </dt>
            <dd className="mt-1 break-all text-sm font-medium text-[var(--foreground)]">
              {field.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default PaymentInformationPanel;