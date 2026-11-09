import type { ReactNode } from 'react';
import { cn } from '@/foundation/utils/cn';

export type WithdrawalAlertVariant = 'success' | 'error' | 'warning' | 'info';

export interface WithdrawalInlineAlertProps {
  variant?: WithdrawalAlertVariant;
  title?: string;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<WithdrawalAlertVariant, string> = {
  success: 'border-[var(--success)]/30 bg-[var(--success-soft)] text-[var(--success)]',
  error: 'border-[var(--danger)]/30 bg-[var(--danger-soft)] text-[var(--danger)]',
  warning: 'border-[var(--warning)]/30 bg-[var(--warning-soft)] text-[var(--warning)]',
  info: 'border-[var(--brand)]/30 bg-[var(--brand-soft)] text-[var(--brand)]',
};

export function WithdrawalInlineAlert({
  variant = 'info',
  title,
  children,
  className,
}: WithdrawalInlineAlertProps) {
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={cn(
        'rounded-[var(--radius-md)] border px-4 py-3 text-sm',
        variantClasses[variant],
        className,
      )}
    >
      {title && <p className="mb-1 font-semibold">{title}</p>}
      <div className="text-[var(--foreground)]">{children}</div>
    </div>
  );
}

export default WithdrawalInlineAlert;