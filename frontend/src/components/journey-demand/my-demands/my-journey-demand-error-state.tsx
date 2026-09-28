'use client';

import { ErrorState } from '@/components/ui';
import { cn } from '@/foundation';

export interface MyJourneyDemandErrorStateProps {
  readonly error?: Error | null;
  readonly onRetry?: () => void;
  readonly className?: string;
}

/**
 * Error state for the authenticated member's Journey Demand list.
 *
 * This component is presentation-only.
 *
 * It does not:
 * - fetch Journey Demands;
 * - retry requests itself;
 * - own query state;
 * - interpret API errors;
 * - determine authorization or capability.
 *
 * The parent supplies the current error and optional retry callback.
 */
export function MyJourneyDemandErrorState({
  error,
  onRetry,
  className,
}: MyJourneyDemandErrorStateProps) {
  const description =
    error?.message ||
    'We could not load your travel needs. Please try again.';

  return (
    <div className={cn('min-w-0', className)}>
      <ErrorState
        title="Unable to load your travel needs"
        description={description}
        retryAction={
          onRetry
            ? {
                label: 'Try again',
                onClick: onRetry,
              }
            : undefined
        }
      />
    </div>
  );
}

