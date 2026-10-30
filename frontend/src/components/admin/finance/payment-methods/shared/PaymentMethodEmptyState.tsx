// -----------------------------------------------------------------------------
// sisiMove Admin — Payment Method Empty State
// -----------------------------------------------------------------------------
//
// Wraps the shared EmptyState primitive with payment-method directory defaults.
// -----------------------------------------------------------------------------

import { EmptyState } from '@/components/ui';

export interface PaymentMethodEmptyStateProps {
  title?: string;
  description?: string;
  onClearFilters?: () => void;
  clearFiltersLabel?: string;
  className?: string;
}

export function PaymentMethodEmptyState({
  title = 'No payment methods found',
  description = 'Payment methods matching your current filters will appear here.',
  onClearFilters,
  clearFiltersLabel = 'Clear filters',
  className,
}: PaymentMethodEmptyStateProps) {
  return (
    <EmptyState
      title={title}
      description={description}
      className={className}
      secondaryAction={
        onClearFilters
          ? {
              label: clearFiltersLabel,
              variant: 'outline',
              onClick: onClearFilters,
            }
          : undefined
      }
    />
  );
}

export default PaymentMethodEmptyState;