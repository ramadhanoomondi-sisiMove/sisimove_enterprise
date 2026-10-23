// src/features/admin/boardings/shared/BoardingErrorState.tsx

import { AlertTriangle, RefreshCw } from 'lucide-react';

import { ErrorState } from '@/components/ui/error-state';

import type { ErrorStateProps } from '@/components/ui/error-state';

export interface BoardingErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  className?: string;
}

export function BoardingErrorState({
  title = 'Unable to load boarding records',
  description = 'Something went wrong while retrieving the boarding information. Please try again.',
  onRetry,
  isRetrying = false,
  className,
}: BoardingErrorStateProps) {
  const retryAction: ErrorStateProps['retryAction'] =
    onRetry
      ? {
          label: isRetrying ? 'Retrying…' : 'Try again',
          leadingContent: (
            <RefreshCw
              className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`}
            />
          ),
          onClick: onRetry,
          disabled: isRetrying,
        }
      : undefined;

  return (
    <ErrorState
      icon={<AlertTriangle className="h-6 w-6" />}
      title={title}
      description={description}
      retryAction={retryAction}
      className={className}
    />
  );
}
