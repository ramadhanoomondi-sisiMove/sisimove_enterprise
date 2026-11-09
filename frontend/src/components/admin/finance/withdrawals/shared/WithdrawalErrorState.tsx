
import {
  ErrorState,
  type ErrorStateAction,
} from '@/components/ui';

import type { ReactNode } from 'react';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface WithdrawalErrorStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
  secondaryAction?: ErrorStateAction;
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function WithdrawalErrorState({
  title = 'Unable to load withdrawals',
  description = 'We could not retrieve financial account withdrawals. Please try again.',
  icon,
  onRetry,
  retryLabel = 'Try again',
  secondaryAction,
  className,
}: WithdrawalErrorStateProps) {
  const retryAction: ErrorStateAction | undefined = onRetry
    ? {
        label: retryLabel,
        onClick: onRetry,
        variant: 'primary',
      }
    : undefined;

  return (
    <ErrorState
      title={title}
      description={description}
      icon={icon}
      retryAction={retryAction}
      secondaryAction={secondaryAction}
      className={className}
    />
  );
}

export default WithdrawalErrorState;
