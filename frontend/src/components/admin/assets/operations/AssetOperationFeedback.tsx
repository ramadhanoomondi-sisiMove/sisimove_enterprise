
'use client';

import {
  AlertCircle,
  CheckCircle2,
  Info,
  LoaderCircle,
  X,
} from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

export type AssetOperationFeedbackType =
  | 'success'
  | 'error'
  | 'info'
  | 'loading';

export interface AssetOperationFeedbackProps {
  type: AssetOperationFeedbackType;
  message: string;
  title?: string;
  onDismiss?: () => void;
  className?: string;
}

const FEEDBACK_STYLES: Record<
  AssetOperationFeedbackType,
  {
    container: string;
    icon: typeof CheckCircle2;
  }
> = {
  success: {
    container:
      'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200',
    icon: CheckCircle2,
  },
  error: {
    container:
      'border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200',
    icon: AlertCircle,
  },
  info: {
    container:
      'border-[var(--border)] bg-[var(--background-muted)] text-[var(--foreground)]',
    icon: Info,
  },
  loading: {
    container:
      'border-[var(--border)] bg-[var(--background-muted)] text-[var(--foreground)]',
    icon: LoaderCircle,
  },
};

export function AssetOperationFeedback({
  type,
  message,
  title,
  onDismiss,
  className,
}: AssetOperationFeedbackProps) {
  const style = FEEDBACK_STYLES[type];
  const Icon = style.icon;
  const isLoading = type === 'loading';

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      className={cn(
        'flex items-start gap-3 rounded-lg border px-4 py-3',
        style.container,
        className,
      )}
    >
      <Icon
        aria-hidden="true"
        className={cn(
          'mt-0.5 h-5 w-5 shrink-0',
          isLoading && 'animate-spin',
        )}
      />

      <div className="min-w-0 flex-1">
        {title ? (
          <p className="text-sm font-semibold">{title}</p>
        ) : null}

        <p className="text-sm leading-5">{message}</p>
      </div>

      {onDismiss && !isLoading ? (
        <button
          type="button"
          aria-label="Dismiss message"
          onClick={onDismiss}
          className="shrink-0 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}

export default AssetOperationFeedback;
