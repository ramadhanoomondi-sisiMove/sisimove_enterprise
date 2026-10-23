
'use client';

import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
  X,
} from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

export type JourneyOperationFeedbackVariant =
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

export interface JourneyOperationFeedbackProps {
  variant: JourneyOperationFeedbackVariant;
  title: string;
  message?: string;
  onDismiss?: () => void;
  className?: string;
}

const variantClasses: Record<JourneyOperationFeedbackVariant, string> = {
  success:
    'border-[var(--success)]/25 bg-[var(--success-soft)] text-[var(--success)]',
  error:
    'border-[var(--danger)]/25 bg-[var(--danger-soft)] text-[var(--danger)]',
  warning:
    'border-[var(--warning)]/25 bg-[var(--warning-soft)] text-[var(--warning)]',
  info:
    'border-[var(--border-strong)] bg-[var(--background-subtle)] text-[var(--foreground-secondary)]',
};

function FeedbackIcon({
  variant,
}: {
  variant: JourneyOperationFeedbackVariant;
}) {
  if (variant === 'success') {
    return <CheckCircle2 className="h-5 w-5" aria-hidden="true" />;
  }

  if (variant === 'error') {
    return <AlertCircle className="h-5 w-5" aria-hidden="true" />;
  }

  if (variant === 'warning') {
    return <TriangleAlert className="h-5 w-5" aria-hidden="true" />;
  }

  return <Info className="h-5 w-5" aria-hidden="true" />;
}

export function JourneyOperationFeedback({
  variant,
  title,
  message,
  onDismiss,
  className,
}: JourneyOperationFeedbackProps) {
  const isError = variant === 'error';

  return (
    <div
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
      className={cn(
        'flex items-start gap-3 rounded-xl border p-4',
        variantClasses[variant],
        className,
      )}
    >
      <div className="mt-0.5 shrink-0">
        <FeedbackIcon variant={variant} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>

        {message ? (
          <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-5 text-[var(--foreground-secondary)]">
            {message}
          </p>
        ) : null}
      </div>

      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)]"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}

export default JourneyOperationFeedback;
