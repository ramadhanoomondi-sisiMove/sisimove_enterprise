'use client';

// -----------------------------------------------------------------------------
// sisiMove — My Journey Demands
// -----------------------------------------------------------------------------
//
// Authenticated Journey Demand management surface.
//
// Responsibilities:
// - Load the authenticated member's Journey Demands.
// - Render the management list.
// - Provide the creation entry point.
//
// The list/card components remain responsible for presentation. Creation,
// editing, and lifecycle workflows belong to their dedicated routes.
// -----------------------------------------------------------------------------

import Link from 'next/link';

import { Button } from '@/components/ui';
import { JourneyDemandList } from '@/components/journey-demands';
import { useMyJourneyDemands } from '@/features/journey-demand/hooks';
import { AUTHENTICATED_ROUTES } from '@/foundation/routing';

export default function JourneyDemandsPage() {
  const journeyDemandsQuery = useMyJourneyDemands();

  if (journeyDemandsQuery.isPending) {
    return (
      <div className="page-shell">
        <div className="page-container">
          <div className="section">
            <JourneyDemandList
              journeyDemands={[]}
              isLoading
            />
          </div>
        </div>
      </div>
    );
  }

  if (journeyDemandsQuery.isError) {
    return (
      <div className="page-shell">
        <div className="page-container">
          <div className="section">
            <JourneyDemandList
              journeyDemands={[]}
              error="We could not load your journey demands. Please try again."
              onRetry={() => {
                void journeyDemandsQuery.refetch();
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  const journeyDemands = journeyDemandsQuery.data ?? [];

  return (
    <div className="page-shell">
      <div className="page-container">
        <section className="section">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                My journey demands
              </h1>

              <p className="mt-1 max-w-2xl text-sm text-slate-500">
                Manage the journeys you are looking for and keep your
                travel needs up to date.
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              asChild
            >
              <Link
                href={AUTHENTICATED_ROUTES.JOURNEY_DEMAND_CREATE_START}
              >
                Create demand
              </Link>
            </Button>
          </div>

          <JourneyDemandList
            journeyDemands={journeyDemands}
          />
        </section>
      </div>
    </div>
  );
}