// -----------------------------------------------------------------------------
// sisiMove Admin — Payment Loading State
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Provide an accessible loading state for payment screens.
// - Reuse the shared Spinner primitive.
// - Avoid creating a second spinner or custom animation.
// -----------------------------------------------------------------------------

import { Spinner } from '@/components/ui';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface PaymentLoadingStateProps {
  label?: string;
  className?: string;
}

// -----------------------------------------------------------------------------
// PaymentLoadingState
// -----------------------------------------------------------------------------

export function PaymentLoadingState({
  label = 'Loading payments',
  className,
}: PaymentLoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        'flex',
        'min-h-40',
        'w-full',
        'flex-col',
        'items-center',
        'justify-center',
        'gap-3',
        'text-sm',
        'text-[var(--foreground-muted)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Spinner size="lg" label={label} />
      <span>{label}</span>
    </div>
  );
}