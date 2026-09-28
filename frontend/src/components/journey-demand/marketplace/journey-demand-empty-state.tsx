// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Empty State
// -----------------------------------------------------------------------------
//
// Marketplace-specific empty state for Journey Demand listings.
//
// Responsibilities:
//
// - provide Journey Demand-specific empty-state copy;
// - expose marketplace actions supplied by the parent.
//
// Non-responsibilities:
//
// - no data fetching;
// - no navigation;
// - no query state;
// - no domain logic.
//
// The parent decides which actions are available.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import { EmptyState } from '@/components/ui';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyDemandEmptyStateProps {
  readonly primaryAction?: {
    readonly label: string;
    readonly onClick: () => void;
    readonly leadingContent?: ReactNode;
    readonly disabled?: boolean;
  };

  readonly secondaryAction?: {
    readonly label: string;
    readonly onClick: () => void;
    readonly leadingContent?: ReactNode;
    readonly disabled?: boolean;
  };

  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandEmptyState({
  primaryAction,
  secondaryAction,
  className,
}: JourneyDemandEmptyStateProps) {
  return (
    <EmptyState
      title="No travel needs found"
      description="There are no Journey Demands matching these filters yet."
      primaryAction={
        primaryAction
          ? {
              label: primaryAction.label,
              onClick: primaryAction.onClick,
              leadingContent: primaryAction.leadingContent,
              disabled: primaryAction.disabled,
            }
          : undefined
      }
      secondaryAction={
        secondaryAction
          ? {
              label: secondaryAction.label,
              onClick: secondaryAction.onClick,
              leadingContent: secondaryAction.leadingContent,
              variant: 'outline',
              disabled: secondaryAction.disabled,
            }
          : undefined
      }
      className={className}
    />
  );
}