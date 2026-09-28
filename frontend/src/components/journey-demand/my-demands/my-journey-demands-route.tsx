// -----------------------------------------------------------------------------
// sisiMove — My Journey Demands Route Container
// -----------------------------------------------------------------------------
//
// Authenticated Journey Demand route/container.
//
// Responsibilities:
// - load the authenticated member's Journey Demands;
// - expose loading and error states to the route boundary;
// - pass the backend-provided MyJourneyDemand projections to the presentation
//   component.
//
// Non-responsibilities:
// - no requesterPublicId handling;
// - no sorting or filtering;
// - no lifecycle/business-state derivation;
// - no ownership reconstruction;
// - no mutation handling;
// - no transformation into PublicJourneyDemand;
// - no empty-state business logic.
//
// Data flow:
//
//   useMyJourneyDemands()
//          ↓
//   MyJourneyDemand[]
//          ↓
//   MyJourneyDemandsList
//
// The presentation component intentionally requires `demands` and remains
// independent from the query layer.
// -----------------------------------------------------------------------------

'use client';

import { Skeleton } from '@/components/ui';

import { useMyJourneyDemands } from '@/features/journey-demand/hooks';
import { MyJourneyDemandsList } from './my-journey-demands-list';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface MyJourneyDemandsRouteProps {
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Loading presentation
// -----------------------------------------------------------------------------

function MyJourneyDemandsRouteLoading() {
  return (
    <div
      className="min-w-0 space-y-3"
      aria-label="Loading your travel needs"
      aria-busy="true"
    >
      <Skeleton
        className="h-36 w-full"
        radius="lg"
      />

      <Skeleton
        className="h-36 w-full"
        radius="lg"
      />

      <Skeleton
        className="h-36 w-full"
        radius="lg"
      />
    </div>
  );
}

// -----------------------------------------------------------------------------
// Route container
// -----------------------------------------------------------------------------

export function MyJourneyDemandsRoute({
  className,
}: MyJourneyDemandsRouteProps) {
  const {
    demands,
    isLoading,
    error,
  } = useMyJourneyDemands();

  if (isLoading) {
    return <MyJourneyDemandsRouteLoading />;
  }

  if (error !== null) {
    throw error;
  }

  return (
    <MyJourneyDemandsList
      demands={demands}
      className={className}
    />
  );
}

