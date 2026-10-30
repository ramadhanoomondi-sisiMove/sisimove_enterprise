// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Payment Metadata Panel
// -----------------------------------------------------------------------------

import { Braces } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

import type {
  AdminFinancialPayment,
} from '@/features/admin/finance/payments/models';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface PaymentMetadataPanelProps {
  payment: AdminFinancialPayment;
  metadata?: Record<string, unknown> | null;
  className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatMetadataValue(value: unknown): string {
  if (value === null) {
    return 'null';
  }

  if (value === undefined) {
    return '—';
  }

  if (typeof value === 'string') {
    return value || '—';
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  try {
    return JSON.stringify(value, null, 2) ?? String(value);
  } catch {
    return '[Value could not be displayed]';
  }
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PaymentMetadataPanel({
  payment,
  metadata,
  className,
}: PaymentMetadataPanelProps) {
  const entries = Object.entries(metadata ?? {});

  return (
    <section
      aria-labelledby="payment-metadata-heading"
      className={cn(
        'min-w-0 rounded-[var(--radius-xl)] border border-[var(--border)]',
        'bg-[var(--surface)] p-5',
        className,
      )}
    >
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--background-subtle)] text-[var(--foreground-secondary)]">
          <Braces aria-hidden="true" className="h-5 w-5" />
        </span>

        <div>
          <h2
            id="payment-metadata-heading"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Payment metadata
          </h2>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Additional structured data supplied for this payment.
          </p>
        </div>
      </div>

      {entries.length > 0 ? (
        <dl className="space-y-3">
          {entries.map(([key, value]) => (
            <div
              key={key}
              className="min-w-0 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--background-subtle)] p-3"
            >
              <dt className="mb-2 break-all text-xs font-semibold text-[var(--foreground-secondary)]">
                {key}
              </dt>
              <dd className="min-w-0">
                <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-xs leading-5 text-[var(--foreground)]">
                  {formatMetadataValue(value)}
                </pre>
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--border)] bg-[var(--background-subtle)] px-4 py-6 text-center">
          <p className="text-sm font-medium text-[var(--foreground-secondary)]">
            No metadata available
          </p>
          <p className="mt-1 text-xs text-[var(--foreground-muted)]">
            The current payment model does not provide metadata for this record.
          </p>
          <p className="mt-3 break-all text-xs text-[var(--foreground-muted)]">
            Payment ID: {payment.publicId}
          </p>
        </div>
      )}
    </section>
  );
}

export default PaymentMetadataPanel;