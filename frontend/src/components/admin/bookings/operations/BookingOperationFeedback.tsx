
'use client';

import {
  AlertCircle,
  CheckCircle2,
  Info,
  X,
} from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

export type BookingOperationFeedbackType = 'success' | 'error' | 'info';

interface BookingOperationFeedbackProps {
  type: BookingOperationFeedbackType;
  message: string;
  onDismiss?: () => void;
  className?: string;
}

const FEEDBACK_STYLES: Record<
  BookingOperationFeedbackType,
  {
    icon: typeof CheckCircle2;
    container: string;
    iconColor: string;
    role: 'status' | 'alert';
  }
> = {
  success: {
    icon: CheckCircle2,
    container:
      'border-[var(--success)]/25 bg-[var(--success-soft)]',
    iconColor: 'text-[var(--success)]',
    role: 'status',
  },
  error: {
    icon: AlertCircle,
    container:
      'border-[var(--danger)]/25 bg-[var(--danger-soft)]',
    iconColor: 'text-[var(--danger)]',
    role: 'alert',
  },
  info: {
    icon: Info,
    container:
      'border-[var(--border)] bg-[var(--background-subtle)]',
    iconColor: 'text-[var(--foreground-secondary)]',
    role: 'status',
  },
};

export function BookingOperationFeedback({
  type,
  message,
  onDismiss,
  className,
}: BookingOperationFeedbackProps) {
  if (!message.trim()) {
    return null;
  }

  const config = FEEDBACK_STYLES[type];
  const Icon = config.icon;

  return (
    <div
      role={config.role}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      className={cn(
        'flex items-start gap-3 rounded-xl border p-4',
        config.container,
        className,
      )}
    >
      <Icon
        className={cn('mt-0.5 size-5 shrink-0', config.iconColor)}
        aria-hidden="true"
      />

      <p className="min-w-0 flex-1 break-words text-sm leading-6 text-[var(--foreground)]">
        {message}
      </p>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg text-[var(--foreground-secondary)] transition hover:bg-black/5 hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export default BookingOperationFeedback;
