'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Creation: Seats Step
// -----------------------------------------------------------------------------
//
// Third editable step in the Journey Demand creation wizard.
//
// The route composes the creation shell and delegates seat requirements to
// JourneyDemandSeatsStep. Persistence remains inside the feature component and
// its mutation hook.
// -----------------------------------------------------------------------------

import { useParams } from 'next/navigation';

import {
  JourneyDemandCreationShell,
  JourneyDemandSeatsStep,
} from '@/components/journey-demands';

export default function JourneyDemandSeatsPage() {
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
            currentStep="seats"
          >
            <JourneyDemandSeatsStep
              journeyDemandPublicId={journeyDemandPublicId}
            />
          </JourneyDemandCreationShell>
        </section>
      </div>
    </div>
  );
}