
'use client';

import {
  AlertCircle,
  CheckCircle2,
  Info,
  X,
} from 'lucide-react';

export type BoardingFeedbackType = 'success' | 'error' | 'info';

interface BoardingOperationFeedbackProps {
  type: BoardingFeedbackType;
  message: string;
  onDismiss?: () => void;
  title?: string;
}

const FEEDBACK_PRESENTATION = {
  success: {
    Icon: CheckCircle2,
    title: 'Operation completed',
    className:
      'border-[var(--success)]/30 bg-[var(--success)]/10 text-[var(--success)]',
  },
  error: {
    Icon: AlertCircle,
    title: 'Operation failed',
    className:
      'border-[var(--danger)]/30 bg-[var(--danger)]/10 text-[var(--danger)]',
  },
  info: {
    Icon: Info,
    title: 'Information',
    className:
      'border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)]',
  },
} satisfies Record<
  BoardingFeedbackType,
  {
    Icon: typeof CheckCircle2;
    title: string;
    className: string;
  }
>;

export function BoardingOperationFeedback({
  type,
  message,
  onDismiss,
  title,
}: BoardingOperationFeedbackProps) {
  const presentation = FEEDBACK_PRESENTATION[type];
  const Icon = presentation.Icon;

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      className={`flex items-start gap-3 rounded-xl border p-4 ${presentation.className}`}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">
          {title ?? presentation.title}
        </p>
        <p className="mt-1 break-words text-sm opacity-90">{message}</p>
      </div>

      {onDismiss && (
        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={onDismiss}
          className="shrink-0 rounded-md p-1 opacity-75 transition hover:bg-black/5 hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
