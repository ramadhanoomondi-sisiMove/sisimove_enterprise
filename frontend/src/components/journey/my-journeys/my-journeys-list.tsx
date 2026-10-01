// -----------------------------------------------------------------------------
// Path: src/features/journey/components/my-journeys-list.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — My Journeys List
//
// Authenticated collection presentation of the member's Journeys.
//
// Design contract:
// - Render the supplied MyJourney collection.
// - Compose one MyJourneyCard per Journey.
// - Preserve the ordering supplied by the query projection.
// - Keep Journey cards stacked vertically.
// - Maintain consistent SisiMove marketplace spacing.
// - Give each card the full available collection width.
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
// Collection state belongs to MyJourneys.
// Individual Journey presentation belongs to MyJourneyCard.
//
// -----------------------------------------------------------------------------

import { cn } from "@/foundation/utils/cn";

import type { MyJourney } from "@/features/journey/models/my-journey";

import { MyJourneyCard } from "./my-journey-card";

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
      className={cn(
        "flex",
        "w-full",
        "min-w-0",
        "flex-col",
        "gap-4",
        "sm:gap-5",
        "lg:gap-6",
        className,
      )}
    >
      {journeys.map((journey) => (
        <MyJourneyCard
          key={journey.publicId}
          journey={journey}
          className="w-full"
        />
      ))}
    </div>
  );
}