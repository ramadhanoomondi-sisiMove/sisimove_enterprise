
import type { ReactNode } from 'react';

import { cn } from '@/foundation/utils/cn';

import { ProviderInlineAlert } from '../feedback/ProviderInlineAlert';

// -----------------------------------------------------------------------------
// sisiMove Admin — Provider Operation Feedback
// -----------------------------------------------------------------------------

export interface ProviderOperationFeedbackProps {
  isSuccess?: boolean;
  isError?: boolean;
  successTitle?: string;
  successMessage?: string;
  errorTitle?: string;
  errorMessage?: string;
  error?: unknown;
  action?: ReactNode;
  onDismiss?: () => void;
  className?: string;
}

// -----------------------------------------------------------------------------
// Error Message
// -----------------------------------------------------------------------------

function getErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  if (
    typeof error === 'string' &&
    error.trim().length > 0
  ) {
    return error;
  }

  return fallback;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function ProviderOperationFeedback({
  isSuccess = false,
  isError = false,
  successTitle = 'Operation completed',
  successMessage = 'The provider operation was completed successfully.',
  errorTitle = 'Operation failed',
  errorMessage = 'The provider operation could not be completed.',
  error,
  action,
  onDismiss,
  className,
}: ProviderOperationFeedbackProps) {
  if (isError) {
    return (
      <ProviderInlineAlert
        variant="error"
        title={errorTitle}
        description={getErrorMessage(error, errorMessage)}
        action={action}
        onDismiss={onDismiss}
        className={cn(className)}
      />
    );
  }

  if (isSuccess) {
    return (
      <ProviderInlineAlert
        variant="success"
        title={successTitle}
        description={successMessage}
        action={action}
        onDismiss={onDismiss}
        className={cn(className)}
      />
    );
  }

  return null;
}
