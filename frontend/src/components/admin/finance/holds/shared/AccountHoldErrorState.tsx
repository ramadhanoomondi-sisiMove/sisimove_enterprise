
import { AlertTriangle } from 'lucide-react';

import { ErrorState } from '@/components/ui/error-state';

export interface AccountHoldErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  className?: string;
}

export function AccountHoldErrorState({
  title = 'Unable to load account holds',
  description = 'We could not retrieve the account-hold information. Please try again.',
  onRetry,
  isRetrying = false,
  className,
}: AccountHoldErrorStateProps) {
  return (
    <ErrorState
      icon={<AlertTriangle className="h-6 w-6" />}
      title={title}
      description={description}
      className={className}
      retryAction={
        onRetry
          ? {
              label: isRetrying ? 'Retrying…' : 'Try again',
              onClick: onRetry,
              disabled: isRetrying,
              variant: 'primary',
            }
          : undefined
      }
    />
  );
}
