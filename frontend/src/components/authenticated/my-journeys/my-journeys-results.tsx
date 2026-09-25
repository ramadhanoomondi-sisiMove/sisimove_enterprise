// -----------------------------------------------------------------------------
// sisiMove — My Journeys Results
// -----------------------------------------------------------------------------
//
// Results presentation for the authenticated My Journeys view.
//
// Responsibility:
// - Render the authenticated user's Journey collection.
// - Delegate individual Journey presentation to MyJourneyCard.
//
// This component intentionally does NOT:
// - fetch Journeys;
// - determine ownership;
// - perform authorization;
// - transform API responses;
// - apply business rules;
// - mutate Journeys.
//
// Data fetching belongs to the Journey feature hook/API layer.
// Page-level state selection belongs to MyJourneysPage.
// Individual Journey presentation belongs to MyJourneyCard.
//
// -----------------------------------------------------------------------------
//
// Read-model boundary
// -----------------------------------------------------------------------------
//
// This component intentionally consumes:
//
//     MyJourney[]
//
// rather than the general:
//
//     Journey[]
//
// `MyJourney` is the authenticated management projection returned by
// `useMyJourneys()`.
//
// -----------------------------------------------------------------------------

import type {
  MyJourney,
} from '@/features/journeys/models';

import {
  MyJourneyCard,
} from './my-journey-card';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface MyJourneysResultsProps {
  /**
   * Journeys belonging to the authenticated Journey provider.
   *
   * Ownership has already been established by the backend.
   *
   * The collection uses the authenticated management read model rather than
   * the general Journey discovery model.
   */
  readonly journeys: readonly MyJourney[];

  /**
   * Optional action invoked when the user wants to open a Journey.
   *
   * Navigation remains outside this component.
   */
  readonly onViewJourney?: (
    journey: MyJourney,
  ) => void;
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