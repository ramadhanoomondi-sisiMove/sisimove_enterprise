// -----------------------------------------------------------------------------
// sisiMove — My Demands Error State
// -----------------------------------------------------------------------------
//
// Recoverable error presentation for the authenticated My Demands view.
//
// This component delegates generic error presentation to the design-system
// ErrorState primitive.
//
// The retry operation is supplied by the parent page. This keeps data-fetching
// and request lifecycle concerns outside the presentation component.
//
// -----------------------------------------------------------------------------

import { ErrorState } from '@/components/ui/error-state';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface MyDemandsErrorStateProps {
  /**
   * Retry the My Demands request.
   */
  readonly onRetry: () => void | Promise<void>;
}

// -----------------------------------------------------------------------------
// My Demands Error State
// -----------------------------------------------------------------------------

export function MyDemandsErrorState({
  onRetry,
}: MyDemandsErrorStateProps) {
  return (
    <ErrorState
      title="We couldn't load your travel demands"
      description="Something went wrong while loading your travel demands. Please try again."
      retryAction={{
        label: 'Try again',
        onClick: onRetry,
      }}
    />
  );
}