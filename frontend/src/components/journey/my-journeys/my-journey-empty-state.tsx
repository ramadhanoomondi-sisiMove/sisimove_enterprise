// -----------------------------------------------------------------------------
// sisiMove — My Journey Empty State
// -----------------------------------------------------------------------------
//
// Empty state for the authenticated My Journeys collection.
//
// Responsibilities:
// - communicate that the member has no Journeys yet;
// - expose the Journey creation action;
// - remain independent of Journey data fetching;
// - remain independent of Journey mutations.
//
// Non-responsibilities:
// - no Journey fetching;
// - no Journey lifecycle logic;
// - no Journey creation mutation;
// - no collection state management.
//
// The navigation callback is supplied by the consuming surface because the
// shared EmptyState primitive intentionally exposes button actions rather than
// navigation-specific href contracts.
//
// -----------------------------------------------------------------------------

import { EmptyState } from "@/components/ui";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface MyJourneyEmptyStateProps {
  /**
   * Called when the member chooses to start creating a Journey.
   *
   * Navigation remains owned by the consuming surface rather than by the
   * domain-specific empty-state presentation component.
   */
  readonly onCreateJourney: () => void;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function MyJourneyEmptyState({
  onCreateJourney,
}: MyJourneyEmptyStateProps) {
  return (
    <EmptyState
      title="You have no Journeys yet"
      description="Create a Journey when you have available seats to share with travellers."
      primaryAction={{
        label: "Create a Journey",
        onClick: onCreateJourney,
      }}
      className="py-16"
    />
  );
}

