// -----------------------------------------------------------------------------
// sisiMove Admin — Payment Method Error State
// -----------------------------------------------------------------------------
//
// Wraps the shared ErrorState primitive for payment-method loading failures.
// -----------------------------------------------------------------------------

import { ErrorState } from '@/components/ui';

export interface PaymentMethodErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function PaymentMethodErrorState({
  title = 'Unable to load payment methods',
  description = 'The payment-method information could not be retrieved. Please try again.',
  onRetry,
  className,
}: PaymentMethodErrorStateProps) {
  return (
    <ErrorState
      title={title}
      description={description}
      className={className}
      retryAction={
        onRetry
          ? {
              label: 'Try again',
              onClick: onRetry,
            }
          : undefined
      }
    />
  );
}

export default PaymentMethodErrorState;