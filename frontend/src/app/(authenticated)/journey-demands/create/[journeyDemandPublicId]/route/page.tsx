'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Creation: Route Step
// -----------------------------------------------------------------------------
//
// First editable step in the Journey Demand creation wizard.
//
// Responsibilities:
// - Resolve the Journey Demand public ID from the route.
// - Render the creation shell at the "route" step.
// - Delegate route editing to JourneyDemandRouteStep.
//
// Persistence remains inside the route-step component and its feature hooks.
// -----------------------------------------------------------------------------

import { useParams } from 'next/navigation';

import {
  JourneyDemandCreationShell,
  JourneyDemandRouteStep,
} from '@/components/journey-demands';

export default function JourneyDemandRoutePage() {
  const params = useParams<{
    journeyDemandPublicId: string;
  }>();

  const journeyDemandPublicId = params.journeyDemandPublicId;

  return (
    <div className="page-shell">
      <div className="page-container">
        <section className="section">
          <JourneyDemandCreationShell
            journeyDemandPublicId={journeyDemandPublicId}
            currentStep="route"
          >
            <JourneyDemandRouteStep
              journeyDemandPublicId={journeyDemandPublicId}
            />
          </JourneyDemandCreationShell>
        </section>
      </div>
    </div>
  );
}