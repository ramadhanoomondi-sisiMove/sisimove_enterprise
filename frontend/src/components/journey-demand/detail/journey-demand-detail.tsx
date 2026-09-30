// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Detail
// -----------------------------------------------------------------------------
//
// Public Journey Demand detail composition.
//
// Product role:
//
//     REAL TRAVEL DEMAND
//          │
//          ▼
//     Understand who wants to travel
//          │
//          ▼
//     Understand the route
//          │
//          ▼
//     Understand when they want to travel
//          │
//          ▼
//     Understand seats + target price
//          │
//          ▼
//     See matching progress
//          │
//          ▼
//     Understand Demand lifecycle
//          │
//          ▼
//     Take Demand Action
//
// Architecture rules:
// - Presentation/composition only.
// - Receives an already-loaded PublicJourneyDemand.
// - Does not fetch the demand.
// - Does not mutate the demand.
// - Does not recreate aggregate/domain behaviour.
// - Does not derive backend business states.
// - Delegates individual sections to dedicated detail components.
// - Route/container components own authentication, params and data loading.
//
// Canonical public projection:
//
//   overview
//   travel window
//   capacity
//   pricing
//   matching summary
//   lifecycle
//
// Corridor/waypoint presentation belongs to the dedicated corridor feature
// when the public detail projection exposes the required route information.
//
// The composition intentionally keeps the Demand detail focused on the
// traveller's intent rather than making it look like a Journey supply page.
// -----------------------------------------------------------------------------

import type { PublicJourneyDemand } from "@/features/journey-demand/models";
import { cn } from "@/foundation";

import { JourneyDemandOverview } from "./journey-demand-overview";
import { JourneyDemandTravelWindow } from "./journey-demand-travel-window";
import { JourneyDemandCapacity } from "./journey-demand-capacity";
import { JourneyDemandPricing } from "./journey-demand-pricing";
import { JourneyDemandMatchingSummary } from "./journey-demand-matching-summary";
import { JourneyDemandLifecycle } from "./journey-demand-lifecycle";

// =============================================================================
// Props
// =============================================================================

export interface JourneyDemandDetailProps {
  readonly demand: PublicJourneyDemand;

  /**
   * Optional action presentation supplied by the owning page/container.
   *
   * Journey Demand actions remain outside the canonical read-only sections.
   */
  readonly actions?: React.ReactNode;

  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function JourneyDemandDetail({
  demand,
  actions,
  className,
}: JourneyDemandDetailProps) {
  return (
    <main
      className={cn(
        "w-full",
        "min-w-0",
        className,
      )}
    >
      <div
        className={cn(
          "space-y-6",
          "sm:space-y-7",
          "lg:space-y-8",
        )}
      >
        {/* ----------------------------------------------------------------- */}
        {/* Demand actions                                                    */}
        {/* ----------------------------------------------------------------- */}
        {actions ? (
          <section
            aria-label="Journey Demand actions"
            className={cn(
              "flex",
              "w-full",
              "min-w-0",
              "items-center",
              "justify-end",
              "rounded-[var(--radius-xl)]",
              "border",
              "border-[var(--border-subtle)]",
              "bg-[var(--background-subtle)]",
              "px-3",
              "py-3",
              "shadow-[var(--shadow-sm)]",
              "sm:px-4",
            )}
          >
            {actions}
          </section>
        ) : null}

        {/* ----------------------------------------------------------------- */}
        {/* Demand overview                                                   */}
        {/* ----------------------------------------------------------------- */}
        <JourneyDemandOverview
          demand={demand}
        />

        {/* ----------------------------------------------------------------- */}
        {/* Travel intent                                                     */}
        {/* ----------------------------------------------------------------- */}
        <section
          aria-label="Journey Demand travel details"
          className={cn(
            "grid",
            "min-w-0",
            "grid-cols-1",
            "gap-5",
            "lg:grid-cols-2",
          )}
        >
          <JourneyDemandTravelWindow
            schedule={demand.schedule}
          />

          <JourneyDemandCapacity
            capacity={demand.capacity}
          />
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* Commercial + matching signal                                     */}
        {/* ----------------------------------------------------------------- */}
        <section
          aria-label="Journey Demand pricing and matching"
          className={cn(
            "grid",
            "min-w-0",
            "grid-cols-1",
            "gap-5",
            "lg:grid-cols-2",
          )}
        >
          <JourneyDemandPricing
            pricing={demand.pricing}
          />

          <JourneyDemandMatchingSummary
            demand={demand}
          />
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* Demand lifecycle                                                  */}
        {/* ----------------------------------------------------------------- */}
        <JourneyDemandLifecycle
          demand={demand}
        />
      </div>
    </main>
  );
}