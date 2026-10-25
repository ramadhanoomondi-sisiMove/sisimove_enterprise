
import { ShieldCheck } from 'lucide-react';

import { EmptyState } from '@/components/ui/empty-state';

export interface AccountHoldEmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function AccountHoldEmptyState({
  title = 'No account holds found',
  description = 'There are no holds to display for the current selection.',
  actionLabel,
  onAction,
  className,
}: AccountHoldEmptyStateProps) {
  return (
    <EmptyState
      icon={<ShieldCheck className="h-6 w-6" />}
      title={title}
      description={description}
      className={className}
      primaryAction={
        actionLabel && onAction
          ? {
              label: actionLabel,
              onClick: onAction,
              variant: 'primary',
            }
          : undefined
      }
    />
  );
}
