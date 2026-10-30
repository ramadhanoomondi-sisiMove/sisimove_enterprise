/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Payment Method Operation Confirmation
 * -----------------------------------------------------------------------------
 *
 * Reusable confirmation content for sensitive payment-method operations.
 * This component presents the impact and intent; the containing Dialog owns
 * modal behavior and submission lifecycle.
 * -----------------------------------------------------------------------------
 */
import type { ReactNode } from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export type PaymentMethodConfirmationTone = 'warning' | 'danger';

export interface PaymentMethodOperationConfirmationProps {
  title: string;
  description: string;
  impact?: string;
  confirmLabel: string;
  tone?: PaymentMethodConfirmationTone;
  isPending?: boolean;
  children?: ReactNode;
  className?: string;
}

export function PaymentMethodOperationConfirmation({
  title,
  description,
  impact,
  confirmLabel,
  tone = 'warning',
  isPending = false,
  children,
  className,
}: PaymentMethodOperationConfirmationProps) {
  const isDanger = tone === 'danger';

  return (
    <div className={['space-y-4', className].filter(Boolean).join(' ')}>
      <div className="flex items-start gap-3">
        <span
          className={[
            'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
            isDanger
              ? 'bg-[var(--danger-soft)] text-[var(--danger)]'
              : 'bg-[var(--warning-soft)] text-[var(--warning)]',
          ].join(' ')}
          aria-hidden="true"
        >
          {isDanger ? <AlertTriangle size={20} /> : <ShieldCheck size={20} />}
        </span>
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-[var(--foreground)]">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">{description}</p>
        </div>
      </div>

      {impact && (
        <div
          className={[
            'rounded-[var(--radius-md)] border p-3 text-sm leading-6',
            isDanger
              ? 'border-[var(--danger)]/20 bg-[var(--danger-soft)] text-[var(--danger)]'
              : 'border-[var(--warning)]/20 bg-[var(--warning-soft)] text-[var(--foreground-secondary)]',
          ].join(' ')}
        >
          {impact}
        </div>
      )}

      {children}

      {isPending && (
        <p className="text-sm text-[var(--foreground-muted)]" role="status">
          Processing: {confirmLabel}. Please wait…
        </p>
      )}
    </div>
  );
}

export default PaymentMethodOperationConfirmation;
