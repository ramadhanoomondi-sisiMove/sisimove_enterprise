// -----------------------------------------------------------------------------
// sisiMove — My Journeys Empty State
// -----------------------------------------------------------------------------
//
// Empty state for the authenticated My Journeys view.
//
// Presentation boundary:
//
//     MyJourneysPage
//          ↓
//     MyJourneysEmptyState
//          ↓
//     EmptyState primitive
//
// This component does not:
// - fetch journey data;
// - inspect authentication;
// - determine verification eligibility;
// - create or publish journeys;
// - contain Journey domain logic.
//
// The parent page owns the navigation/action behavior.
//
// Design intent:
// - Keep the empty state focused and compact.
// - Make publishing a Journey the primary next action.
// - Keep marketplace discovery available as a secondary action.
// - Allow the shared EmptyState primitive to own visual presentation.
//
// -----------------------------------------------------------------------------

import { EmptyState } from '@/components/ui/empty-state';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface MyJourneysEmptyStateProps {
  /**
   * Called when the user chooses to find a journey.
   *
   * Navigation remains outside the presentation component.
   */
  readonly onFindJourney?: () => void;

  /**
   * Called when the user chooses to publish a journey.
   *
   * Navigation and authorization remain outside the presentation component.
   */
  readonly onPublishJourney?: () => void;
}

// -----------------------------------------------------------------------------
// My Journeys Empty State
// -----------------------------------------------------------------------------

export function MyJourneysEmptyState({
  onFindJourney,
  onPublishJourney,
}: MyJourneysEmptyStateProps) {
  return (
    <EmptyState
      title="No journeys yet"
      description="Journeys you publish will appear here. If you're looking for a ride instead, explore available journeys in the marketplace."
      primaryAction={
        onPublishJourney
          ? {
              label: 'Publish a journey',
              onClick: onPublishJourney,
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

export default MyJourneysEmptyState;