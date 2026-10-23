
import type { ReactNode } from 'react';

import {
  ErrorState,
  type ErrorStateAction,
} from '@/components/ui/error-state';

export interface JourneyErrorStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  retryAction?: ErrorStateAction;
  secondaryAction?: ErrorStateAction;
  className?: string;
}

export function JourneyErrorState({
  title = 'Unable to load journeys',
  description = 'We could not retrieve the journey information. Please try again.',
  icon,
  retryAction,
  secondaryAction,
  className,
}: JourneyErrorStateProps) {
  return (
    <ErrorState
      icon={icon}
      title={title}
      description={description}
      retryAction={retryAction}
      secondaryAction={secondaryAction}
      className={className}
    />
  );
}

export default JourneyErrorState;
