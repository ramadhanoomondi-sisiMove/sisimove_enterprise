// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Detail Container
// -----------------------------------------------------------------------------
//
// Composition container for the Journey Demand detail surface.
//
// Responsibilities:
// - Fetch the Journey Demand aggregate.
// - Fetch its component data.
// - Compose the presentational detail sections.
//
// Non-responsibilities:
// - Mutating Journey Demand state.
// - Owning section-specific presentation.
// - Implementing lifecycle rules.
//
// Lifecycle mutations belong to dedicated actions/hooks and should be added
// without turning this container into a domain workflow.
// -----------------------------------------------------------------------------

'use client';

import { ErrorState, Spinner } from '@/components/ui';

import {
  useJourneyDemand,
  useJourneyDemandCapacity,
  useJourneyDemandCorridor,
  useJourneyDemandParticipants,
  useJourneyDemandPricing,
  useJourneyDemandSchedule,
  useJourneyDemandWaypoints,
} from '@/features/journey-demand/hooks';

import {
  JourneyDemandDetailCapacity,
  JourneyDemandDetailHeader,
  JourneyDemandDetailParticipants,
  JourneyDemandDetailPricing,
  JourneyDemandDetailRoute,
  JourneyDemandDetailSchedule,
} from '.';

export interface JourneyDemandDetailContainerProps {
  journeyDemandPublicId: string;
}

export function JourneyDemandDetailContainer({
  journeyDemandPublicId,
}: JourneyDemandDetailContainerProps) {
  const demandQuery = useJourneyDemand(journeyDemandPublicId);
  const corridorQuery = useJourneyDemandCorridor(journeyDemandPublicId);
  const waypointsQuery = useJourneyDemandWaypoints(
    journeyDemandPublicId,
  );
  const scheduleQuery = useJourneyDemandSchedule(
    journeyDemandPublicId,
  );
  const capacityQuery = useJourneyDemandCapacity(
    journeyDemandPublicId,
  );
  const pricingQuery = useJourneyDemandPricing(
    journeyDemandPublicId,
  );
  const participantsQuery = useJourneyDemandParticipants(
    journeyDemandPublicId,
  );

  if (demandQuery.isPending) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <Spinner size="md" />
      </div>
    );
  }

  if (demandQuery.isError || !demandQuery.data) {
    return (
      <ErrorState
        title="Unable to load journey demand"
        description="We could not load this journey demand. Please try again."
        onRetry={() => {
          void demandQuery.refetch();
        }}
      />
    );
  }

  const journeyDemand = demandQuery.data;

  const isComponentLoading =
    corridorQuery.isPending ||
    waypointsQuery.isPending ||
    scheduleQuery.isPending ||
    capacityQuery.isPending ||
    pricingQuery.isPending ||
    participantsQuery.isPending;

  if (isComponentLoading) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <Spinner size="md" />
      </div>
    );
  }

  if (
    corridorQuery.isError ||
    waypointsQuery.isError ||
    scheduleQuery.isError ||
    capacityQuery.isError ||
    pricingQuery.isError ||
    participantsQuery.isError
  ) {
    return (
      <ErrorState
        title="Unable to load journey demand details"
        description="Some journey demand details could not be loaded. Please try again."
        onRetry={() => {
          void Promise.all([
            corridorQuery.refetch(),
            waypointsQuery.refetch(),
            scheduleQuery.refetch(),
            capacityQuery.refetch(),
            pricingQuery.refetch(),
            participantsQuery.refetch(),
          ]);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <JourneyDemandDetailHeader
        journeyDemand={journeyDemand}
      />

      <JourneyDemandDetailRoute
        corridor={corridorQuery.data ?? null}
        waypoints={waypointsQuery.data ?? []}
      />

      <JourneyDemandDetailSchedule
        schedule={scheduleQuery.data ?? null}
      />

      <JourneyDemandDetailCapacity
        capacity={capacityQuery.data ?? null}
      />

      <JourneyDemandDetailPricing
        pricing={pricingQuery.data ?? null}
      />

      <JourneyDemandDetailParticipants
        participants={participantsQuery.data ?? []}
      />
    </div>
  );
}