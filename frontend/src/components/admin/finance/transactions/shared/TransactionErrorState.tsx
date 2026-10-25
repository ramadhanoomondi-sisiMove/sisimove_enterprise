
import { ErrorState } from '@/components/ui/error-state';

export interface TransactionErrorStateProps {
  error?: unknown;
  onRetry?: () => void;
  title?: string;
  description?: string;
  className?: string;
}

function getErrorMessage(error: unknown): string | undefined {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  if (typeof error === 'string' && error.trim()) {
    return error;
  }

  return undefined;
}

export function TransactionErrorState({
  error,
  onRetry,
  title = 'Unable to load transactions',
  description,
  className,
}: TransactionErrorStateProps) {
  const errorMessage = getErrorMessage(error);

  return (
    <ErrorState
      title={title}
      description={
        description ??
        errorMessage ??
        'We could not retrieve financial transactions. Please try again.'
      }
      className={className}
      retryAction={
        onRetry
          ? {
              label: 'Try again',
              onClick: onRetry,
              variant: 'primary',
            }
          : undefined
      }
    />
  );
}

export default TransactionErrorState;
