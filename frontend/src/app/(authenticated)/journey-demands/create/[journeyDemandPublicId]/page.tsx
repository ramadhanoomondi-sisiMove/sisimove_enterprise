'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Creation Wizard Root
// -----------------------------------------------------------------------------
//
// Root route for an existing Journey Demand creation workflow.
//
// URL:
//   /journey-demands/create/:journeyDemandPublicId
//
// The actual editable steps live in child routes:
//
//   /route
//   /schedule
//   /seats
//   /pricing
//   /review
//
// This page intentionally does not mutate the aggregate. It only establishes
// the creation shell for the existing server-side DRAFT.
// -----------------------------------------------------------------------------

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

import {
  JourneyDemandCreationShell,
} from '@/components/journey-demands';
import { useJourneyDemand } from '@/features/journey-demand/hooks';
import { AUTHENTICATED_ROUTES } from '@/foundation/routing';

export default function JourneyDemandCreatePage() {
  const params = useParams<{
    journeyDemandPublicId: string;
  }>();

  const router = useRouter();

  const journeyDemandPublicId = params.journeyDemandPublicId;

  const journeyDemandQuery = useJourneyDemand(
    journeyDemandPublicId,
  );

  useEffect(() => {
    if (!journeyDemandQuery.data) {
      return;
    }

    if (journeyDemandQuery.data.status !== 'DRAFT') {
      router.replace(
        AUTHENTICATED_ROUTES.JOURNEY_DEMAND(
          journeyDemandPublicId,
        ),
      );
    }
  }, [
    journeyDemandQuery.data,
    journeyDemandPublicId,
    router,
  ]);

  return (
    <div className="page-shell">
      <div className="page-container">
        <section className="section">
          <JourneyDemandCreationShell
            journeyDemandPublicId={journeyDemandPublicId}
            currentStep="route"
          >
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                Create your journey demand
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Start by telling us where you want to travel.
              </p>
            </div>
          </JourneyDemandCreationShell>
        </section>
      </div>
    </div>
  );
}