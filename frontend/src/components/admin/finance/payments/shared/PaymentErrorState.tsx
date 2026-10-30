//src/components/admin/finance/payments/shared/paymentErrorState.tsx
// -----------------------------------------------------------------------------
// sisiMove Admin — Payment Error State
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Provide payment-specific error defaults.
// - Reuse the shared ErrorState primitive.
// - Delegate retry behavior to the consuming feature.
// -----------------------------------------------------------------------------

import { ErrorState } from '@/components/ui';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface PaymentErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

// -----------------------------------------------------------------------------
// PaymentErrorState
// -----------------------------------------------------------------------------

export function PaymentErrorState({
  title = 'Unable to load payments',
  description = 'We could not retrieve payment information. Please try again.',
  onRetry,
  retryLabel = 'Try again',
  className,
}: PaymentErrorStateProps) {
  return (
    <ErrorState
      title={title}
      description={description}
      retryAction={
        onRetry
          ? {
              label: retryLabel,
              onClick: onRetry,
              type: 'button',
            }
          : undefined
      }
      className={className}
    />
  );
}