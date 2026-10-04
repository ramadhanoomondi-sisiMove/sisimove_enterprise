// -----------------------------------------------------------------------------
// sisiMove — My Journey Demands
// -----------------------------------------------------------------------------
//
// Authenticated Journey Demand collection coordinator.
//
// Responsibilities:
// - retrieve the authenticated user's Journey Demands through the feature hook;
// - render loading, error, empty, or populated states;
// - navigate to the owner Journey Demand management detail;
// - navigate to Journey Demand creation;
// - pass backend-provided MyJourneyDemand projections to presentation.
//
// This component does NOT:
// - resolve ownership;
// - perform authorization;
// - call the API directly;
// - recreate Journey Demand domain logic;
// - transform MyJourneyDemand into PublicJourneyDemand;
// - sort or filter the collection;
// - derive lifecycle/business state.
//
// The hook owns the request boundary.
// This coordinator owns collection-level orchestration.
// Child components own presentation.
// Routing owns URL construction.
//
// Data flow:
//
//   useMyJourneyDemands()
//          ↓
//   MyJourneyDemand[]
//          ↓
//   MyJourneyDemands
//          ↓
//   MyJourneyDemandsList
//          ↓
//   MyJourneyDemandCard
//
// Owner navigation:
//
//   Manage Demand
//          ↓
//   /my-demands/[publicId]
//
// Creation navigation:
//
//   Create travel need
//          ↓
//   /my-demands/new
// -----------------------------------------------------------------------------

'use client';

import { useRouter } from 'next/navigation';

import { cn } from '@/foundation';
import { AUTHENTICATED_ROUTES } from '@/foundation/routing';
import { useMyJourneyDemands } from '@/features/journey-demand/hooks';

import { MyJourneyDemandEmptyState } from './my-journey-demand-empty-state';
import { MyJourneyDemandErrorState } from './my-journey-demand-error-state';
import { MyJourneyDemandLoading } from '../manage/my-journey-demand-loading';
import { MyJourneyDemandsList } from './my-journey-demands-list';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface MyJourneyDemandsProps {
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function MyJourneyDemands({
  className,
}: MyJourneyDemandsProps) {
  const router = useRouter();

  // ---------------------------------------------------------------------------
  // Data
  // ---------------------------------------------------------------------------

  /**
   * The hook exposes the collection as `demands`.
   *
   * This intentionally follows the hook's result contract rather than
   * introducing a generic `data` alias at the component boundary.
   */
  const {
    demands,
    isLoading,
    error,
    refetch,
  } = useMyJourneyDemands();

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------

  const handleManage = (demand: {
    readonly publicId: string;
  }): void => {
    router.push(
      AUTHENTICATED_ROUTES.MY_DEMAND(
        demand.publicId,
      ),
    );
  };

  const handleCreate = (): void => {
    router.push(
      AUTHENTICATED_ROUTES.MY_DEMAND_NEW,
    );
  };

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <div className={cn('min-w-0', className)}>
        <MyJourneyDemandLoading />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------

  if (error !== null) {
    return (
      <div className={cn('min-w-0', className)}>
        <MyJourneyDemandErrorState
          error={error}
          onRetry={refetch}
        />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Empty
  // ---------------------------------------------------------------------------

  if (demands.length === 0) {
    return (
      <div className={cn('min-w-0', className)}>
        <MyJourneyDemandEmptyState
          primaryAction={{
            label: 'Create travel need',
            onClick: handleCreate,
          }}
        />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Collection
  // ---------------------------------------------------------------------------

  return (
    <div className={cn('min-w-0', className)}>
      <MyJourneyDemandsList
        demands={demands}
        onManage={handleManage}
      />
    </div>
  );
}
