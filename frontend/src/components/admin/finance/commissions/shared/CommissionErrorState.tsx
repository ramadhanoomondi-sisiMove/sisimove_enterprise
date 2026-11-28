
// src/components/admin/commissions/shared/CommissionErrorState.tsx

import {
  ErrorState,
  type ErrorStateAction,
} from '@/components/ui';

import type {
  ReactNode,
} from 'react';

export interface CommissionErrorStateProps {
  readonly title?: string;
  readonly description?: string;
  readonly icon?: ReactNode;
  readonly retryAction?: ErrorStateAction;
  readonly secondaryAction?: ErrorStateAction;
  readonly className?: string;
}

export function CommissionErrorState({
  title = 'Unable to load commissions',
  description = 'Something went wrong while retrieving commission data. Please try again.',
  icon,
  retryAction,
  secondaryAction,
  className,
}: CommissionErrorStateProps) {
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
