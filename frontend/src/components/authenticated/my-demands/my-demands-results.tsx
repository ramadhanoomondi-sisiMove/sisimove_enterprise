// -----------------------------------------------------------------------------
// sisiMove — My Demands Results
// -----------------------------------------------------------------------------
//
// Results presentation for the authenticated My Demands view.
//
// Responsibility:
// - Render the authenticated user's Journey Demand collection.
// - Delegate individual Demand presentation to MyDemandCard.
//
// This component intentionally does NOT:
// - fetch Journey Demands;
// - determine ownership;
// - perform authorization;
// - transform API responses;
// - apply business rules;
// - mutate Journey Demands.
//
// Data fetching belongs to the Journey Demand feature hook/API layer.
// Page-level state selection belongs to MyDemandsPage.
// Individual Demand presentation belongs to MyDemandCard.
// -----------------------------------------------------------------------------

import type {
  MyJourneyDemand,
} from '@/features/journey-demands/models';

import { MyDemandCard } from './my-demand-card';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface MyDemandsResultsProps {
  /**
   * Journey Demands belonging to the authenticated identity.
   *
   * Ownership has already been established by the backend.
   */
  readonly demands: readonly MyJourneyDemand[];

  /**
   * Optional action invoked when the user wants to open a Demand.
   *
   * Navigation remains outside this component.
   */
  readonly onViewDemand?: (
    demand: MyJourneyDemand,
  ) => void;
}

// -----------------------------------------------------------------------------
// My Demands Results
// -----------------------------------------------------------------------------

export function MyDemandsResults({
  demands,
  onViewDemand,
}: MyDemandsResultsProps) {
  return (
    <section
      aria-label="Your travel demands"
      className="grid gap-4"
    >
      {demands.map((demand) => (
        <MyDemandCard
          key={demand.publicId}
          demand={demand}
          onView={onViewDemand}
        />
      ))}
    </section>
  );
}