'use client';

import { ErrorState } from '@/components/ui';
import { cn } from '@/foundation';

/**
 * Props for the authenticated Journey Demand error state.
 *
 * The parent/container owns the request and supplies the retry callback.
 */
export interface MyJourneyDemandErrorProps {
  readonly error?: Error | null;
  readonly onRetry?: () => void;
  readonly className?: string;
}

/**
 * Presents an error state for the owner's Journey Demand detail.
 *
 * This component deliberately does not:
 * - perform the request;
 * - own request state;
 * - determine authorization;
 * - interpret backend errors;
 * - perform navigation.
 *
 * Retry behavior is delegated to the parent through onRetry.
 */
export function MyJourneyDemandError({
  error,
  onRetry,
  className,
}: MyJourneyDemandErrorProps) {
  const description =
    error?.message ||
    'We could not load this travel need. Please try again.';

  return (
    <div
      className={cn('min-w-0', className)}
    >
      <ErrorState
        title="Unable to load travel need"
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

