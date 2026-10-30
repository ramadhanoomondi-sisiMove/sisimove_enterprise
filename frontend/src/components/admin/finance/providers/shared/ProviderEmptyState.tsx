
import { EmptyState } from '@/components/ui';
import type { EmptyStateAction } from '@/components/ui';
import type { ReactNode } from 'react';

export interface ProviderEmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  className?: string;
}

export function ProviderEmptyState({
  title = 'No payment providers found',
  description = 'There are no payment providers to display yet.',
  icon,
  primaryAction,
  secondaryAction,
  className,
}: ProviderEmptyStateProps) {
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
