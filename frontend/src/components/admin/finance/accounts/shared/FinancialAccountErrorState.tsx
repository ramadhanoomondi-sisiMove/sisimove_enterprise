// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Account Error State
// -----------------------------------------------------------------------------
//
// Reuses the shared ErrorState primitive. The displayed message is deliberately
// user-safe; detailed exceptions should be logged by the calling layer.
// -----------------------------------------------------------------------------

import { AlertCircle } from 'lucide-react';
import { ErrorState } from '@/components/ui';

export interface FinancialAccountErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  onBack?: () => void;
  backLabel?: string;
  className?: string;
}

export function FinancialAccountErrorState({
  title = 'Unable to load financial account',
  description = 'Something prevented this information from loading. Please try again.',
  onRetry,
  retryLabel = 'Try again',
  onBack,
  backLabel = 'Go back',
  className,
}: FinancialAccountErrorStateProps) {
  return (
    <ErrorState
      icon={<AlertCircle className="h-5 w-5" />}
      title={title}
      description={description}
      className={className}
      retryAction={
        onRetry
          ? {
              label: retryLabel,
              onClick: onRetry,
            }
          : undefined
      }
      secondaryAction={
        onBack
          ? {
              label: backLabel,
              onClick: onBack,
              variant: 'outline',
            }
          : undefined
      }
    />
  );
}

export default FinancialAccountErrorState;
