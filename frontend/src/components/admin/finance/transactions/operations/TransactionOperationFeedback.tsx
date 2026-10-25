'use client';

export type TransactionOperationFeedbackState =
  | { kind: 'success'; message: string }
  | { kind: 'error'; message: string }
  | null;

export interface TransactionOperationFeedbackProps {
  feedback: TransactionOperationFeedbackState;
  onDismiss?: () => void;
}

export function TransactionOperationFeedback({
  feedback,
  onDismiss,
}: TransactionOperationFeedbackProps) {
  if (!feedback) return null;

  const success = feedback.kind === 'success';

  return (
    <div
      role={success ? 'status' : 'alert'}
      className={[
        'flex items-start justify-between gap-3 rounded-lg border p-4 text-sm',
        success
          ? 'border-[var(--success)] bg-[var(--success-soft)] text-[var(--foreground)]'
          : 'border-[var(--danger)] bg-[var(--danger-soft)] text-[var(--foreground)]',
      ].join(' ')}
    >
      <p>{feedback.message}</p>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded px-2 py-1 font-medium underline underline-offset-2"
          aria-label="Dismiss operation message"
        >
          Dismiss
        </button>
      ) : null}
    </div>
  );
}

export default TransactionOperationFeedback;
