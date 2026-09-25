'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Creation Shell
// -----------------------------------------------------------------------------
//
// Provides the shared presentation shell for the multi-step Journey creation
// workflow.
//
// Responsibilities:
// - Render the creation progress indicator.
// - Render the current step heading and description.
// - Provide the shared content surface for the active step.
// - Render the shared creation navigation.
// - Keep workflow state and persistence outside the shell.
//
// This component intentionally does NOT:
// - Create or mutate a Journey.
// - Persist form data.
// - Perform validation.
// - Publish a Journey.
// - Own API calls.
// - Infer the current route.
// - Perform router navigation.
//
// The route/page that owns the workflow supplies navigation callbacks and
// destinations. This keeps the shell reusable across all Journey creation
// steps while preserving the application's routing boundary.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import { Card, Container } from '@/components/ui';

import {
  JourneyCreationNavigation,
  type JourneyCreationNavigationProps,
} from './journey-creation-navigation';

import {
  JourneyCreationProgress,
  type JourneyCreationStep,
} from './journey-creation-progress';

// -----------------------------------------------------------------------------
// Step metadata
// -----------------------------------------------------------------------------

interface JourneyCreationStepMetadata {
  title: string;
  description: string;
}

const JOURNEY_CREATION_STEP_METADATA: Record<
  JourneyCreationStep,
  JourneyCreationStepMetadata
> = {
  route: {
    title: 'Plan your route',
    description:
      'Set the journey origin, destination, and route details passengers will see.',
  },

  schedule: {
    title: 'Set your schedule',
    description:
      'Choose when the journey starts and provide the timing information passengers need.',
  },

  vehicle: {
    title: 'Choose your vehicle',
    description:
      'Select the vehicle you will use for this journey.',
  },

  seats: {
    title: 'Set available seats',
    description:
      'Tell travellers how many seats are available for this journey.',
  },

  pricing: {
    title: 'Set your pricing',
    description:
      'Set the travel cost passengers will contribute toward the journey.',
  },

  preferences: {
    title: 'Set journey preferences',
    description:
      'Choose the travel preferences that help passengers know what to expect.',
  },

  photos: {
    title: 'Add journey photos',
    description:
      'Add relevant photos that help travellers identify the journey, vehicle, or route.',
  },

  review: {
    title: 'Review your journey',
    description:
      'Check the journey details before publishing it to the marketplace.',
  },
};

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyCreationShellProps
  extends Omit<
    JourneyCreationNavigationProps,
    'className'
  > {
  /**
   * Current step represented by the active creation page.
   */
  currentStep: JourneyCreationStep;

  /**
   * Steps that have already been completed.
   */
  completedSteps?: ReadonlySet<JourneyCreationStep>;

  /**
   * Active step content.
   */
  children: ReactNode;

  /**
   * Optional override for the current step title.
   */
  title?: string;

  /**
   * Optional override for the current step description.
   */
  description?: string;

  /**
   * Optional additional content rendered above the navigation.
   */
  footerContent?: ReactNode;

  /**
   * Additional classes for the outer shell.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyCreationShell({
  currentStep,
  completedSteps,
  children,
  title,
  description,
  footerContent,
  previousHref,
  nextHref,
  onBack,
  onNext,
  finalAction,
  backDisabled = false,
  nextDisabled = false,
  nextLoading = false,
  finalLoading = false,
  className,
}: JourneyCreationShellProps) {
  const metadata =
    JOURNEY_CREATION_STEP_METADATA[currentStep];

  const resolvedTitle =
    title ?? metadata.title;

  const resolvedDescription =
    description ?? metadata.description;

  return (
    <main
      className={[
        'min-h-[calc(100vh-4rem)]',
        'bg-[var(--background-brand)]',
        'py-6',
        'sm:py-8',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Container size="lg">
        <div className="mx-auto w-full max-w-3xl">
          {/* -----------------------------------------------------------------
              Progress
              ----------------------------------------------------------------- */}

          <JourneyCreationProgress
            currentStep={currentStep}
            completedSteps={completedSteps}
            className="mb-6"
          />

          {/* -----------------------------------------------------------------
              Step content
              ----------------------------------------------------------------- */}

          <Card
            variant="default"
            padding="none"
            className="overflow-hidden"
          >
            <div className="p-5 sm:p-6 lg:p-8">
              <header className="mb-6">
                <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
                  {resolvedTitle}
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--foreground-secondary)] sm:text-base">
                  {resolvedDescription}
                </p>
              </header>

              <section
                aria-label={`${resolvedTitle} form`}
              >
                {children}
              </section>
            </div>

            {/* ---------------------------------------------------------------
                Optional step-specific footer content
                --------------------------------------------------------------- */}

            {footerContent ? (
              <div className="border-t border-[var(--border-subtle)] bg-[var(--background-subtle)] px-5 py-4 sm:px-6 lg:px-8">
                {footerContent}
              </div>
            ) : null}

            {/* ---------------------------------------------------------------
                Shared workflow navigation
                --------------------------------------------------------------- */}

            <div className="px-5 pb-5 sm:px-6 sm:pb-6 lg:px-8 lg:pb-8">
              <JourneyCreationNavigation
                previousHref={previousHref}
                nextHref={nextHref}
                onBack={onBack}
                onNext={onNext}
                finalAction={finalAction}
                backDisabled={backDisabled}
                nextDisabled={nextDisabled}
                nextLoading={nextLoading}
                finalLoading={finalLoading}
              />
            </div>
          </Card>
        </div>
      </Container>
    </main>
  );
}