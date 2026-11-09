
import {
  EmptyState,
  type EmptyStateAction,
} from '@/components/ui';

import type { ReactNode } from 'react';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface WithdrawalEmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function WithdrawalEmptyState({
  title = 'No withdrawals found',
  description = 'There are no financial account withdrawals to display.',
  icon,
  primaryAction,
  secondaryAction,
  className,
}: WithdrawalEmptyStateProps) {
  return (
    <EmptyState
      title={title}
      description={description}
      icon={icon}
      primaryAction={primaryAction}
      secondaryAction={secondaryAction}
      className={className}
    />
  );
}

export default WithdrawalEmptyState;
