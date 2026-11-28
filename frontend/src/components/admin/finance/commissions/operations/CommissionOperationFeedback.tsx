
import type { HTMLAttributes } from 'react';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type CommissionOperationFeedbackVariant =
  | 'success'
  | 'error'
  | 'info';

export interface CommissionOperationFeedbackProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  readonly variant: CommissionOperationFeedbackVariant;
  readonly message: string;
  readonly title?: string;
}

// -----------------------------------------------------------------------------
// Styles
// -----------------------------------------------------------------------------

const variantClasses: Record<
  CommissionOperationFeedbackVariant,
  string
> = {
  success: [
    'border-[var(--success)]',
    'bg-[var(--success-soft)]',
    'text-[var(--success)]',
  ].join(' '),

  error: [
    'border-[var(--danger)]',
    'bg-[var(--danger-soft)]',
    'text-[var(--danger)]',
  ].join(' '),

  info: [
    'border-[var(--border-strong)]',
    'bg-[var(--background-muted)]',
    'text-[var(--foreground-secondary)]',
  ].join(' '),
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function CommissionOperationFeedback({
  variant,
  message,
  title,
  className,
  ...props
}: CommissionOperationFeedbackProps) {
  const normalizedMessage = message.trim();

  if (!normalizedMessage) {
    return null;
  }

  const isError = variant === 'error';

  return (
    <div
      {...props}
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
      className={[
        'w-full',
        'rounded-[var(--radius-md)]',
        'border',
        'px-4',
        'py-3',
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {title && (
        <p className="mb-1 text-sm font-semibold">
          {title}
        </p>
      )}

      <p className="text-sm leading-5">
        {normalizedMessage}
      </p>
    </div>
  );
}
