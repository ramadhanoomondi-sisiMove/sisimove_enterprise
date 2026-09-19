// -----------------------------------------------------------------------------
// sisiMove — My Journeys Results
// -----------------------------------------------------------------------------
//
// Results presentation for the authenticated My Journeys view.
//
// Responsibility:
// - Render the authenticated user's journey collection.
// - Delegate individual journey presentation to MyJourneyCard.
//
// This component intentionally does NOT:
// - fetch journeys;
// - determine ownership;
// - perform authorization;
// - transform API responses;
// - apply business rules;
// - mutate journeys.
//
// Data fetching belongs to the Journey feature hook/API layer.
// Page-level state selection belongs to MyJourneysPage.
// Individual journey presentation belongs to MyJourneyCard.
// -----------------------------------------------------------------------------

import type { MyJourney } from '@/features/journeys/models';

import { MyJourneyCard } from './my-journey-card';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface MyJourneysResultsProps {
  /**
   * Journeys belonging to the authenticated journey provider.
   *
   * Ownership has already been established by the backend.
   */
  readonly journeys: readonly MyJourney[];

  /**
   * Optional action invoked when the user wants to open a journey.
   *
   * Navigation remains outside this component.
   */
  readonly onViewJourney?: (journey: MyJourney) => void;
}

// -----------------------------------------------------------------------------
// My Journeys Results
// -----------------------------------------------------------------------------

export function MyJourneysResults({
  journeys,
  onViewJourney,
}: MyJourneysResultsProps) {
  return (
    <section
      aria-label="Your journeys"
      className="grid gap-4"
    >
      {journeys.map((journey) => (
        <MyJourneyCard
          key={journey.publicId}
          journey={journey}
          onView={onViewJourney}
        />
      ))}
    </section>
  );
}