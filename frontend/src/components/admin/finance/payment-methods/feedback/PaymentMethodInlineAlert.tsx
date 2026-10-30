/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Payment Method Inline Alert
 * -----------------------------------------------------------------------------
 *
 * Small reusable inline alert for validation, operation, and informational
 * messages. This component does not own dismissal state or API behavior.
 * -----------------------------------------------------------------------------
 */
import type { ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';
import { Button } from '@/components/ui';

export type PaymentMethodInlineAlertVariant =
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

export interface PaymentMethodInlineAlertProps {
  variant?: PaymentMethodInlineAlertVariant;
  title?: string;
  children: ReactNode;
  onDismiss?: () => void;
  className?: string;
  role?: 'alert' | 'status';
}

const variantClasses: Record<PaymentMethodInlineAlertVariant, string> = {
  info: 'border-[var(--brand)]/20 bg-[var(--brand-soft)] text-[var(--foreground)]',
  success: 'border-[var(--success)]/20 bg-[var(--success-soft)] text-[var(--success)]',
  warning: 'border-[var(--warning)]/20 bg-[var(--warning-soft)] text-[var(--foreground)]',
  error: 'border-[var(--danger)]/20 bg-[var(--danger-soft)] text-[var(--danger)]',
};

const iconByVariant = {
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  error: AlertCircle,
} as const;

export function PaymentMethodInlineAlert({
  variant = 'info',
  title,
  children,
  onDismiss,
  className,
  role = variant === 'error' ? 'alert' : 'status',
}: PaymentMethodInlineAlertProps) {
  const Icon = iconByVariant[variant];

  return (
    <div
      role={role}
      aria-live={role === 'alert' ? 'assertive' : 'polite'}
      className={[
        'flex items-start gap-3 rounded-[var(--radius-lg)] border p-3.5',
        variantClasses[variant],
        className,
      ].filter(Boolean).join(' ')}
    >
      <Icon size={18} aria-hidden="true" className="mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1">
        {title && <p className="text-sm font-semibold">{title}</p>}
        <div className={title ? 'mt-1 text-sm leading-5' : 'text-sm leading-5'}>{children}</div>
      </div>
      {onDismiss && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label="Dismiss message"
          className="min-h-7 h-7 shrink-0 px-1.5"
          onClick={onDismiss}
          leadingIcon={<X size={15} aria-hidden="true" />}
        >
          <span className="sr-only">Dismiss</span>
        </Button>
      )}
    </div>
  );
}

export default PaymentMethodInlineAlert;
