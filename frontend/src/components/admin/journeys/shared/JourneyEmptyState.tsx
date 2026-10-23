
import type { ReactNode } from 'react';

import {
  EmptyState,
  type EmptyStateAction,
} from '@/components/ui/empty-state';

export interface JourneyEmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  className?: string;
}

export function JourneyEmptyState({
  title = 'No journeys found',
  description = 'There are no journeys to display right now. Try adjusting your filters or check back later.',
  icon,
  primaryAction,
  secondaryAction,
  className,
}: JourneyEmptyStateProps) {
  return (
    <EmptyState
      icon={icon}
      title={title}
      description={description}
      primaryAction={primaryAction}
      secondaryAction={secondaryAction}
      className={className}
    />
  );
}

export default JourneyEmptyState;
