
'use client';

import {
  ErrorState,
  type ErrorStateProps,
} from '@/components/ui';

export interface JourneyCompletionErrorStateProps
  extends Omit<ErrorStateProps, 'retryAction'> {
  onRetry?: () => void;
  retryLabel?: string;
  isRetrying?: boolean;
}

export function JourneyCompletionErrorState({
  title = 'Unable to load journey completions',
  description = 'Something went wrong while retrieving the journey completion records. Please try again.',
  onRetry,
  retryLabel = 'Try again',
  isRetrying = false,
  ...props
}: JourneyCompletionErrorStateProps) {
  return (
    <ErrorState
      {...props}
      title={title}
      description={description}
      retryAction={
        onRetry
          ? {
              label: retryLabel,
              onClick: onRetry,
              disabled: isRetrying,
              variant: 'primary',
            }
          : undefined
      }
    />
  );
}

export default function JourneyCompletionError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <JourneyCompletionErrorState
      title="Unable to load journey completions"
      description={
        error.message ||
        'Something went wrong while retrieving the journey completion records. Please try again.'
      }
      onRetry={reset}
    />
  );
}
