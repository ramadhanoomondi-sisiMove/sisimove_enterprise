'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Creation: Schedule Step
// -----------------------------------------------------------------------------
//
// Second editable step in the Journey Demand creation wizard.
//
// The route only composes the creation shell and schedule step. Schedule
// persistence remains inside JourneyDemandScheduleStep and its feature hooks.
// -----------------------------------------------------------------------------

import { useParams } from 'next/navigation';

import {
  JourneyDemandCreationShell,
  JourneyDemandScheduleStep,
} from '@/components/journey-demands';

export default function JourneyDemandSchedulePage() {
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
            currentStep="schedule"
          >
            <JourneyDemandScheduleStep
              journeyDemandPublicId={journeyDemandPublicId}
            />
          </JourneyDemandCreationShell>
        </section>
      </div>
    </div>
  );
}