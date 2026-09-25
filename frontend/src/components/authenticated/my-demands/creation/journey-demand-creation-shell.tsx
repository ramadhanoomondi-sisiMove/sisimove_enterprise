// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Creation Shell
// -----------------------------------------------------------------------------
//
// Composition shell for the Journey Demand creation wizard.
//
// Responsibilities:
// - Render creation progress.
// - Render the active creation step supplied by the route/page.
// - Render previous/next navigation.
//
// Non-responsibilities:
// - Creating the Journey Demand.
// - Persisting step data.
// - Publishing the Journey Demand.
// - Deciding which step should be displayed.
//
// The individual Next.js route segments own step selection. This component
// therefore remains reusable and presentation-focused.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import {
  JourneyDemandCreationNavigation,
  type JourneyDemandCreationStep,
} from './journey-demand-creation-navigation';
import { JourneyDemandCreationProgress } from './journey-demand-creation-progress';

export interface JourneyDemandCreationShellProps {
  journeyDemandPublicId: string;
  currentStep: JourneyDemandCreationStep;
  children: ReactNode;
}

export function JourneyDemandCreationShell({
  journeyDemandPublicId,
  currentStep,
  children,
}: JourneyDemandCreationShellProps) {
  return (
    <div className="space-y-6">
      <JourneyDemandCreationProgress
        journeyDemandPublicId={journeyDemandPublicId}
        currentStep={currentStep}
      />

      <main>{children}</main>

      <JourneyDemandCreationNavigation
        journeyDemandPublicId={journeyDemandPublicId}
        currentStep={currentStep}
      />
    </div>
  );
}