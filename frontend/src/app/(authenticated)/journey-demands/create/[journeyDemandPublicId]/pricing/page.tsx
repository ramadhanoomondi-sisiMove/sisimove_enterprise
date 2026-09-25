'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Creation: Pricing Step
// -----------------------------------------------------------------------------
//
// Fourth editable step in the Journey Demand creation wizard.
//
// The route composes the creation shell and delegates pricing preferences to
// JourneyDemandPricingStep. Persistence remains inside the feature component
// and its mutation hook.
// -----------------------------------------------------------------------------

import { useParams } from 'next/navigation';

import {
  JourneyDemandCreationShell,
  JourneyDemandPricingStep,
} from '@/components/journey-demands';

export default function JourneyDemandPricingPage() {
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
            currentStep="pricing"
          >
            <JourneyDemandPricingStep
              journeyDemandPublicId={journeyDemandPublicId}
            />
          </JourneyDemandCreationShell>
        </section>
      </div>
    </div>
  );
}