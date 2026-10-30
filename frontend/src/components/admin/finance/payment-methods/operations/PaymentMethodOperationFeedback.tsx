/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Payment Method Operation Feedback
 * -----------------------------------------------------------------------------
 *
 * Presents the outcome of an operation. The caller supplies the authoritative
 * status and message after the operation controller/API completes.
 * -----------------------------------------------------------------------------
 */
import { AlertCircle, CheckCircle2, Info, LoaderCircle } from 'lucide-react';

export type PaymentMethodOperationFeedbackStatus =
  | 'idle'
  | 'pending'
  | 'success'
  | 'error';

export interface PaymentMethodOperationFeedbackProps {
  status: PaymentMethodOperationFeedbackStatus;
  message?: string | null;
  title?: string;
  className?: string;
}

const styles: Record<Exclude<PaymentMethodOperationFeedbackStatus, 'idle' | 'pending'>, string> = {
  success: 'border-[var(--success)]/20 bg-[var(--success-soft)] text-[var(--success)]',
  error: 'border-[var(--danger)]/20 bg-[var(--danger-soft)] text-[var(--danger)]',
};

export function PaymentMethodOperationFeedback({
  status,
  message,
  title,
  className,
}: PaymentMethodOperationFeedbackProps) {
  if (status === 'idle') return null;

  const content = message?.trim() ||
    (status === 'pending' ? 'Your request is being processed.' :
      status === 'success' ? 'The operation completed successfully.' :
        'The operation could not be completed.');

  const Icon = status === 'pending'
    ? LoaderCircle
    : status === 'success'
      ? CheckCircle2
      : AlertCircle;

  const classNameForStatus = status === 'pending'
    ? 'border-[var(--border)] bg-[var(--background-subtle)] text-[var(--foreground-secondary)]'
    : styles[status];

  return (
    <div
      role={status === 'error' ? 'alert' : 'status'}
      aria-live={status === 'error' ? 'assertive' : 'polite'}
      aria-busy={status === 'pending' || undefined}
      className={[
        'flex items-start gap-3 rounded-[var(--radius-lg)] border p-4',
        classNameForStatus,
        className,
      ].filter(Boolean).join(' ')}
    >
      <Icon size={18} aria-hidden="true" className={status === 'pending' ? 'mt-0.5 shrink-0 animate-spin' : 'mt-0.5 shrink-0'} />
      <div className="min-w-0">
        {title && <p className="text-sm font-semibold">{title}</p>}
        <p className={title ? 'mt-1 text-sm leading-5' : 'text-sm leading-5'}>{content}</p>
      </div>
    </div>
  );
}

export default PaymentMethodOperationFeedback;
