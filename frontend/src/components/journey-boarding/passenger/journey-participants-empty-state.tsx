
'use client';

import { EmptyState } from '@/components/ui';

interface JourneyParticipantsEmptyStateProps {
  title?: string;
  description?: string;
  className?: string;
  onRetry?: () => void;
}

export function JourneyParticipantsEmptyState({
  title = 'No passengers found',
  description = 'There are no passenger participants to display for this journey yet.',
  className,
  onRetry,
}: JourneyParticipantsEmptyStateProps) {
  return (
    <EmptyState
      title={title}
      description={description}
      className={className}
      {...(onRetry
        ? {
            secondaryAction: {
              label: 'Refresh',
              onClick: onRetry,
            },
          }
        : {})}
    />
  );
}
