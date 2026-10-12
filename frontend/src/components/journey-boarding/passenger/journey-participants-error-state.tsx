
'use client';

import { ErrorState } from '@/components/ui';

interface JourneyParticipantsErrorStateProps {
  onRetry: () => void;
  title?: string;
  description?: string;
  className?: string;
}

export function JourneyParticipantsErrorState({
  onRetry,
  title = 'Unable to load passengers',
  description = 'We could not load the passenger list. Please check your connection and try again.',
  className,
}: JourneyParticipantsErrorStateProps) {
  return (
    <ErrorState
      title={title}
      description={description}
      retryAction={{
        label: 'Try again',
        onClick: onRetry,
      }}
      className={className}
    />
  );
}
