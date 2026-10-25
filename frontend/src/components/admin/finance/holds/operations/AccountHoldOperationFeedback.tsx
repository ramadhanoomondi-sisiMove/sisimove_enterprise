import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

export type AccountHoldOperationFeedbackStatus =
  | 'success'
  | 'error'
  | 'info';

export interface AccountHoldOperationFeedbackProps {
  status: AccountHoldOperationFeedbackStatus;
  title: string;
  message: string;
  onDismiss?: () => void;
  className?: string;
}

const STATUS_STYLES = {
  success: {
    container: 'border-[var(--success)] bg-[var(--success-soft)]',
    icon: CheckCircle2,
    iconClass: 'text-[var(--success)]',
  },
  error: {
    container: 'border-[var(--danger)] bg-[var(--danger-soft)]',
    icon: AlertCircle,
    iconClass: 'text-[var(--danger)]',
  },
  info: {
    container: 'border-[var(--border)] bg-[var(--background-subtle)]',
    icon: Info,
    iconClass: 'text-[var(--foreground-secondary)]',
  },
} as const;

export function AccountHoldOperationFeedback({
  status,
  title,
  message,
  onDismiss,
  className,
}: AccountHoldOperationFeedbackProps) {
  const config = STATUS_STYLES[status];
  const Icon = config.icon;

  return (
    <div
      role={status === 'error' ? 'alert' : 'status'}
      className={cn(
        'flex items-start gap-3 rounded-xl border p-4',
        config.container,
        className,
      )}
    >
      <Icon className={cn('mt-0.5 size-5 shrink-0', config.iconClass)} />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[var(--foreground)]">
          {title}
        </p>
        <p className="mt-1 break-words text-sm text-[var(--foreground-secondary)]">
          {message}
        </p>
      </div>

      {onDismiss ? (
        <button
          type="button"
          aria-label="Dismiss message"
          onClick={onDismiss}
          className="rounded-md p-1 text-[var(--foreground-muted)] hover:bg-[var(--background-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  );
}