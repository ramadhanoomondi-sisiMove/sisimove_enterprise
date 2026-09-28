// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Error State
// -----------------------------------------------------------------------------
//
// Marketplace-specific error state for Journey Demand listings.
//
// Responsibilities:
//
// - provide Journey Demand-specific error copy;
// - expose retry and secondary actions supplied by the parent.
//
// Non-responsibilities:
//
// - no data fetching;
// - no retry implementation;
// - no navigation;
// - no error interpretation;
// - no domain logic.
//
// The parent owns the request lifecycle and supplies the retry callback.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import { ErrorState } from '@/components/ui';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyDemandErrorStateProps {
  /**
   * Callback supplied by the parent to retry loading marketplace data.
   */
  readonly onRetry: () => void;

  /**
   * Optional secondary marketplace action.
   */
  readonly secondaryAction?: {
    readonly label: string;
    readonly onClick: () => void;
    readonly leadingContent?: ReactNode;
    readonly disabled?: boolean;
  };

  /**
   * Prevents the retry action while the parent is busy.
   */
  readonly retryDisabled?: boolean;

  /**
   * Optional additional classes.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandErrorState({
  onRetry,
  secondaryAction,
  retryDisabled = false,
  className,
}: JourneyDemandErrorStateProps) {
  return (
    <ErrorState
      title="Unable to load travel needs"
      description="We could not load Journey Demands right now. Please try again."
      retryAction={{
        label: 'Try again',
        onClick: onRetry,
        disabled: retryDisabled,
      }}
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