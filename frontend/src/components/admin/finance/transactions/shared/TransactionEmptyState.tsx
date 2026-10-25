
import { EmptyState } from '@/components/ui/empty-state';

export interface TransactionEmptyStateProps {
  title?: string;
  description?: string;
  onClearFilters?: () => void;
  clearFiltersLabel?: string;
  className?: string;
}

export function TransactionEmptyState({
  title = 'No transactions found',
  description = 'There are no financial transactions matching your current filters.',
  onClearFilters,
  clearFiltersLabel = 'Clear filters',
  className,
}: TransactionEmptyStateProps) {
  return (
    <EmptyState
      title={title}
      description={description}
      className={className}
      primaryAction={
        onClearFilters
          ? {
              label: clearFiltersLabel,
              onClick: onClearFilters,
              variant: 'outline',
            }
          : undefined
      }
    />
  );
}

export default TransactionEmptyState;
