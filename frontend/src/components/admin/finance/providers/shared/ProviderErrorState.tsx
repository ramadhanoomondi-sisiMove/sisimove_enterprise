
import { ErrorState } from '@/components/ui';
import type {
  ErrorStateAction,
} from '@/components/ui';
import type { ReactNode } from 'react';

export interface ProviderErrorStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  retryAction?: ErrorStateAction;
  secondaryAction?: ErrorStateAction;
  className?: string;
}

export function ProviderErrorState({
  title = 'Unable to load payment providers',
  description = 'Something went wrong while loading payment providers. Please try again.',
  icon,
  retryAction,
  secondaryAction,
  className,
}: ProviderErrorStateProps) {
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
