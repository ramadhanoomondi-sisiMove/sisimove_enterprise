'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Creation Navigation
// -----------------------------------------------------------------------------
//
// Provides previous/next navigation for the Journey Demand creation wizard.
//
// Navigation is deliberately route-based:
// - Each step has its own URL.
// - The server-side DRAFT remains the source of persisted progress.
// - This component does not save or publish data.
//
// The final Review step does not expose a "Next" action because publishing is
// owned by JourneyDemandReviewStep.
// -----------------------------------------------------------------------------

import Link from 'next/link';

import { Button } from '@/components/ui';
import { AUTHENTICATED_ROUTES } from '@/foundation/routing';
import type { JourneyDemandCreationStep } from './journey-demand-creation-progress';

export interface JourneyDemandCreationNavigationProps {
  journeyDemandPublicId: string;
  currentStep: JourneyDemandCreationStep;
}

const STEP_ORDER: JourneyDemandCreationStep[] = [
  'route',
  'schedule',
  'seats',
  'pricing',
  'review',
];

const STEP_ROUTES: Record<
  JourneyDemandCreationStep,
  (journeyDemandPublicId: string) => string
> = {
  route: AUTHENTICATED_ROUTES.JOURNEY_DEMAND_CREATE_ROUTE,
  schedule: AUTHENTICATED_ROUTES.JOURNEY_DEMAND_CREATE_SCHEDULE,
  seats: AUTHENTICATED_ROUTES.JOURNEY_DEMAND_CREATE_SEATS,
  pricing: AUTHENTICATED_ROUTES.JOURNEY_DEMAND_CREATE_PRICING,
  review: AUTHENTICATED_ROUTES.JOURNEY_DEMAND_CREATE_REVIEW,
};

export function JourneyDemandCreationNavigation({
  journeyDemandPublicId,
  currentStep,
}: JourneyDemandCreationNavigationProps) {
  const currentIndex = STEP_ORDER.indexOf(currentStep);

  const previousStep =
    currentIndex > 0
      ? STEP_ORDER[currentIndex - 1]
      : undefined;

  const nextStep =
    currentIndex >= 0 &&
    currentIndex < STEP_ORDER.length - 1
      ? STEP_ORDER[currentIndex + 1]
      : undefined;

  return (
    <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
      <div>
        {previousStep ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            asChild
          >
            <Link
              href={STEP_ROUTES[previousStep](
                journeyDemandPublicId,
              )}
            >
              Back
            </Link>
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            asChild
          >
            <Link
              href={AUTHENTICATED_ROUTES.JOURNEY_DEMANDS}
            >
              Exit
            </Link>
          </Button>
        )}
      </div>

      {nextStep ? (
        <Button
          type="button"
          variant="primary"
          size="sm"
          asChild
        >
          <Link
            href={STEP_ROUTES[nextStep](journeyDemandPublicId)}
          >
            Continue
          </Link>
        </Button>
      ) : null}
    </div>
  );
}