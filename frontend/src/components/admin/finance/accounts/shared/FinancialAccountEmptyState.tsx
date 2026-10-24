// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Account Empty State
// -----------------------------------------------------------------------------
//
// Reuses the shared EmptyState primitive for account-related empty results.
// Does not imply that the backend supports account listing.
// -----------------------------------------------------------------------------

import { Wallet } from 'lucide-react';
import { EmptyState } from '@/components/ui';

export interface FinancialAccountEmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function FinancialAccountEmptyState({
  title = 'No financial account to display',
  description = 'There is no financial account available for this view yet.',
  actionLabel,
  onAction,
  className,
}: FinancialAccountEmptyStateProps) {
  return (
    <EmptyState
      icon={<Wallet className="h-5 w-5" />}
      title={title}
      description={description}
      className={className}
      primaryAction={
        actionLabel && onAction
          ? {
              label: actionLabel,
              onClick: onAction,
            }
          : undefined
      }
    />
  );
}

export default FinancialAccountEmptyState;
