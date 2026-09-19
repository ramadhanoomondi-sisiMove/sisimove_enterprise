// -----------------------------------------------------------------------------
// sisiMove — My Demands Empty State
// -----------------------------------------------------------------------------
//
// Empty state for the authenticated My Demands view.
//
// Presentation boundary:
//
//     MyDemandsPage
//          ↓
//     MyDemandsEmptyState
//          ↓
//     EmptyState primitive
//
// This component does not:
// - fetch Journey Demands;
// - inspect authentication;
// - determine verification eligibility;
// - create a Journey Demand;
// - contain Journey Demand domain logic.
//
// The parent page owns navigation and action behavior.
//
// Design intent:
// - Keep the empty state focused and compact.
// - Present one clear primary action.
// - Keep marketplace discovery available as a secondary action.
// - Allow the shared EmptyState primitive to own visual presentation.
//
// -----------------------------------------------------------------------------

import { EmptyState } from '@/components/ui/empty-state';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface MyDemandsEmptyStateProps {
  /**
   * Called when the user chooses to find a Journey.
   *
   * Navigation remains outside the presentation component.
   */
  readonly onFindJourney?: () => void;

  /**
   * Called when the user chooses to create a Journey Demand.
   *
   * Navigation and authorization remain outside the presentation component.
   */
  readonly onCreateDemand?: () => void;
}

// -----------------------------------------------------------------------------
// My Demands Empty State
// -----------------------------------------------------------------------------

export function MyDemandsEmptyState({
  onFindJourney,
  onCreateDemand,
}: MyDemandsEmptyStateProps) {
  return (
    <EmptyState
      title="No travel demands yet"
      description="Create a demand when you need a journey and want other travellers to see where you are looking to go."
      primaryAction={
        onCreateDemand
          ? {
              label: 'Create a travel demand',
              onClick: onCreateDemand,
            }
          : undefined
      }
      secondaryAction={
        onFindJourney
          ? {
              label: 'Find a journey',
              onClick: onFindJourney,
              variant: 'outline',
            }
          : undefined
      }
    />
  );
}

export default MyDemandsEmptyState;