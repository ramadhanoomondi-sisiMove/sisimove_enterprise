
// src/components/admin/commissions/shared/CommissionEmptyState.tsx

import {
  EmptyState,
  type EmptyStateAction,
} from '@/components/ui';

import type {
  ReactNode,
} from 'react';

export interface CommissionEmptyStateProps {
  readonly title?: string;
  readonly description?: string;
  readonly icon?: ReactNode;
  readonly primaryAction?: EmptyStateAction;
  readonly secondaryAction?: EmptyStateAction;
  readonly className?: string;
}

export function CommissionEmptyState({
  title = 'No commissions found',
  description = 'There are no commissions to display.',
  icon,
  primaryAction,
  secondaryAction,
  className,
}: CommissionEmptyStateProps) {
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
