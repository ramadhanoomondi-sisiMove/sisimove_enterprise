'use client';

import { EmptyState, type EmptyStateAction } from '@/components/ui';
import { cn } from '@/foundation';

export interface MyJourneyDemandEmptyStateProps {
  readonly title?: string;
  readonly description?: string;
  readonly primaryAction?: EmptyStateAction;
  readonly secondaryAction?: EmptyStateAction;
  readonly className?: string;
}

/**
 * Empty state for the authenticated member's Journey Demand list.
 *
 * This component does not:
 * - fetch Journey Demands;
 * - create a Journey Demand;
 * - determine whether creation is allowed;
 * - perform navigation itself;
 * - inspect authentication or verification state.
 *
 * The parent supplies any actions through the shared EmptyState contract.
 */
export function MyJourneyDemandEmptyState({
  title = 'No travel needs yet',
  description = 'Create a travel need when you are looking for someone to share your journey with.',
  primaryAction,
  secondaryAction,
  className,
}: MyJourneyDemandEmptyStateProps) {
  return (
    <EmptyState
      title={title}
      description={description}
      primaryAction={primaryAction}
      secondaryAction={secondaryAction}
      className={cn('min-w-0', className)}
    />
  );
}
