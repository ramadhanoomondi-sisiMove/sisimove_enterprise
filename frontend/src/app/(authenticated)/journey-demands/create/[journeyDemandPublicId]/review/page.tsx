'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Creation: Review Step
// -----------------------------------------------------------------------------
//
// Final step in the Journey Demand creation wizard.
//
// The review component owns the final review and publish workflow. This route
// only composes it with the creation shell.
// -----------------------------------------------------------------------------

import { useParams } from 'next/navigation';

import {
  JourneyDemandCreationShell,
  JourneyDemandReviewStep,
} from '@/components/journey-demands';

export default function JourneyDemandReviewPage() {
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
            currentStep="review"
          >
            <JourneyDemandReviewStep
              journeyDemandPublicId={journeyDemandPublicId}
            />
          </JourneyDemandCreationShell>
        </section>
      </div>
    </div>
  );
}