
'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';

import { ErrorState } from '@/components/ui/error-state';

interface BookingErrorStateProps {
  /** Optional description of the loading or booking retrieval error. */
  description?: string;

  /** Retry the failed booking request. */
  onRetry?: () => void;

  /** Whether a retry is currently in progress. */
  isRetrying?: boolean;

  /** Optional additional CSS classes. */
  className?: string;
}

export function BookingErrorState({
  description = 'We could not load the bookings. Please try again.',
  onRetry,
  isRetrying = false,
  className,
}: BookingErrorStateProps) {
  return (
    <ErrorState
      icon={<AlertCircle size={24} strokeWidth={1.75} />}
      title="Unable to load bookings"
      description={description}
      retryAction={
        onRetry
          ? {
              label: isRetrying ? 'Retrying…' : 'Try again',
              leadingContent: (
                <RefreshCw
                  size={16}
                  className={isRetrying ? 'animate-spin' : undefined}
                />
              ),
              onClick: onRetry,
              disabled: isRetrying,
            }
          : undefined
      }
      className={className}
    />
  );
}
