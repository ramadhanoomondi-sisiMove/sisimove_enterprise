// -----------------------------------------------------------------------------
// sisiMove — My Journeys Error State
// -----------------------------------------------------------------------------
//
// Recoverable error presentation for the authenticated My Journeys view.
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

export interface MyJourneysErrorStateProps {
  /**
   * Retry the My Journeys request.
   */
  readonly onRetry: () => void | Promise<void>;
}

// -----------------------------------------------------------------------------
// My Journeys Error State
// -----------------------------------------------------------------------------

export function MyJourneysErrorState({
  onRetry,
}: MyJourneysErrorStateProps) {
  return (
    <ErrorState
      title="We couldn't load your journeys"
      description="Something went wrong while loading your journeys. Please try again."
      retryAction={{
        label: 'Try again',
        onClick: onRetry,
      }}
    />
  );
}