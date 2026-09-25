'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Creation Progress
// -----------------------------------------------------------------------------
//
// Displays the current position within the Journey Demand creation flow.
//
// The progress component is presentation-only. It does not determine whether
// a step is actually complete; the creation shell/page owns navigation and
// persistence state.
// -----------------------------------------------------------------------------

import Link from 'next/link';

import { Badge } from '@/components/ui';
import { AUTHENTICATED_ROUTES } from '@/foundation/routing';

export type JourneyDemandCreationStep =
  | 'route'
  | 'schedule'
  | 'seats'
  | 'pricing'
  | 'review';

export interface JourneyDemandCreationProgressProps {
  journeyDemandPublicId: string;
  currentStep: JourneyDemandCreationStep;
}

interface StepDefinition {
  key: JourneyDemandCreationStep;
  label: string;
  description: string;
  href: (journeyDemandPublicId: string) => string;
}

const STEPS: StepDefinition[] = [
  {
    key: 'route',
    label: 'Route',
    description: 'Where you are going',
    href: AUTHENTICATED_ROUTES.JOURNEY_DEMAND_CREATE_ROUTE,
  },
  {
    key: 'schedule',
    label: 'Schedule',
    description: 'When you want to travel',
    href: AUTHENTICATED_ROUTES.JOURNEY_DEMAND_CREATE_SCHEDULE,
  },
  {
    key: 'seats',
    label: 'Seats',
    description: 'How many seats you need',
    href: AUTHENTICATED_ROUTES.JOURNEY_DEMAND_CREATE_SEATS,
  },
  {
    key: 'pricing',
    label: 'Pricing',
    description: 'What you want to pay',
    href: AUTHENTICATED_ROUTES.JOURNEY_DEMAND_CREATE_PRICING,
  },
  {
    key: 'review',
    label: 'Review',
    description: 'Check and publish',
    href: AUTHENTICATED_ROUTES.JOURNEY_DEMAND_CREATE_REVIEW,
  },
];

export function JourneyDemandCreationProgress({
  journeyDemandPublicId,
  currentStep,
}: JourneyDemandCreationProgressProps) {
  const currentIndex = STEPS.findIndex(
    (step) => step.key === currentStep,
  );

  return (
    <nav
      aria-label="Journey demand creation progress"
      className="space-y-3"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-900">
          Create journey demand
        </p>

        <Badge size="sm" variant="default">
          Step {currentIndex + 1} of {STEPS.length}
        </Badge>
      </div>

      <ol className="grid gap-2 sm:grid-cols-5">
        {STEPS.map((step, index) => {
          const isCurrent = step.key === currentStep;
          const isComplete = index < currentIndex;
          const isFuture = index > currentIndex;

          const content = (
            <div
              className={[
                'rounded-lg border px-3 py-2.5 transition',
                isCurrent
                  ? 'border-blue-600 bg-blue-50'
                  : isComplete
                    ? 'border-slate-200 bg-white'
                    : 'border-slate-200 bg-slate-50',
              ].join(' ')}
            >
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={[
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                    isCurrent
                      ? 'bg-blue-600 text-white'
                      : isComplete
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-200 text-slate-600',
                  ].join(' ')}
                >
                  {index + 1}
                </span>

                <span className="min-w-0">
                  <span
                    className={[
                      'block truncate text-sm font-medium',
                      isCurrent
                        ? 'text-blue-700'
                        : isFuture
                          ? 'text-slate-500'
                          : 'text-slate-900',
                    ].join(' ')}
                  >
                    {step.label}
                  </span>

                  <span className="hidden truncate text-xs text-slate-500 sm:block">
                    {step.description}
                  </span>
                </span>
              </div>
            </div>
          );

          if (isFuture) {
            return (
              <li key={step.key}>
                {content}
              </li>
            );
          }

          return (
            <li key={step.key}>
              <Link
                href={step.href(journeyDemandPublicId)}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {content}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}