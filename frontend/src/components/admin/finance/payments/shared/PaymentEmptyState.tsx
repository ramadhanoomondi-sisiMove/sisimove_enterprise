// -----------------------------------------------------------------------------
// sisiMove Admin — Payment Empty State
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Provide payment-specific empty-state defaults.
// - Reuse the shared EmptyState primitive for presentation and actions.
// - Allow callers to customize the message and available actions.
// -----------------------------------------------------------------------------

import { EmptyState } from '@/components/ui';

import type { EmptyStateAction } from '@/components/ui';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface PaymentEmptyStateProps {
  title?: string;
  description?: string;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  className?: string;
}

// -----------------------------------------------------------------------------
// PaymentEmptyState
// -----------------------------------------------------------------------------

export function PaymentEmptyState({
  title = 'No payments found',
  description = 'Payments will appear here when they become available. Try changing your filters.',
  primaryAction,
  secondaryAction,
  className,
}: PaymentEmptyStateProps) {
  return (
    <EmptyState
      title={title}
      description={description}
      primaryAction={primaryAction}
      secondaryAction={secondaryAction}
      className={className}
    />
  );
}