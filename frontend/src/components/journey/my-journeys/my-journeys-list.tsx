// -----------------------------------------------------------------------------
// sisiMove — My Journeys List
// -----------------------------------------------------------------------------
//
// Authenticated collection presentation of the member's Journeys.
//
// Responsibilities:
// - render the supplied MyJourney collection;
// - compose one MyJourneyCard per Journey;
// - preserve the ordering supplied by the query projection.
//
// Non-responsibilities:
// - no Journey fetching;
// - no loading state;
// - no error handling;
// - no empty-state handling;
// - no Journey mutations;
// - no Journey lifecycle logic;
// - no Journey filtering or sorting.
//
// Collection state belongs to MyJourneys. Individual Journey presentation
// belongs to MyJourneyCard.
//
// -----------------------------------------------------------------------------

import { MyJourneyCard } from "./my-journey-card";

import type { MyJourney } from "@/features/journey/models/my-journey";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface MyJourneysListProps {
  /**
   * Authenticated Journey projections supplied by the My Journeys query.
   */
  readonly journeys: readonly MyJourney[];

  /**
   * Optional additional CSS classes for the collection.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function MyJourneysList({
  journeys,
  className,
}: MyJourneysListProps) {
  return (
    <div
      className={[
        "grid",
        "grid-cols-1",
        "gap-4",
        className ?? "",
      ].join(" ")}
    >
      {journeys.map((journey) => (
        <MyJourneyCard
          key={journey.publicId}
          journey={journey}
        />
      ))}
    </div>
  );
}

