// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Detail
// -----------------------------------------------------------------------------
//
// Public Journey Demand detail composition.
//
// Architecture rules:
// - Presentation/composition only.
// - Receives an already-loaded PublicJourneyDemand.
// - Does not fetch the demand.
// - Does not mutate the demand.
// - Does not recreate aggregate/domain behaviour.
// - Does not derive backend business states.
// - Delegates individual sections to the dedicated detail components.
// - Route/container components own authentication, params and data loading.
//
// This component intentionally composes the canonical public projection:
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
// -----------------------------------------------------------------------------

import type { PublicJourneyDemand } from '@/features/journey-demand/models';
import { cn } from '@/foundation';

import { JourneyDemandOverview } from './journey-demand-overview';
import { JourneyDemandTravelWindow } from './journey-demand-travel-window';
import { JourneyDemandCapacity } from './journey-demand-capacity';
import { JourneyDemandPricing } from './journey-demand-pricing';
import { JourneyDemandMatchingSummary } from './journey-demand-matching-summary';
import { JourneyDemandLifecycle } from './journey-demand-lifecycle';

export interface JourneyDemandDetailProps {
  readonly demand: PublicJourneyDemand;
  readonly className?: string;
}

export function JourneyDemandDetail({
  demand,
  className,
}: JourneyDemandDetailProps) {
  return (
    <main
      className={cn(
        'page-container',
        className,
      )}
    >
      <div className="space-y-4 sm:space-y-5">
        <JourneyDemandOverview demand={demand} />

        <div className="grid gap-4 lg:grid-cols-2">
          <JourneyDemandTravelWindow
            schedule={demand.schedule}
          />

          <JourneyDemandCapacity
            capacity={demand.capacity}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <JourneyDemandPricing
            pricing={demand.pricing}
          />

          <JourneyDemandMatchingSummary
            demand={demand}
          />
        </div>

        <JourneyDemandLifecycle
          demand={demand}
        />
      </div>
    </main>
  );
}

