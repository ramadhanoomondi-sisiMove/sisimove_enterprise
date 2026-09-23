// -----------------------------------------------------------------------------
// sisiMove — Journey Creation Workflow Overview
// -----------------------------------------------------------------------------
//
// Overview page for an existing Journey creation draft.
//
// Route:
//
//   /authenticated/journeys/create/:journeyPublicId
//
// Lifecycle:
//
//   /authenticated/journeys/create
//       │
//       │ create Journey draft
//       ▼
//   /authenticated/journeys/create/:journeyPublicId
//       │
//       ├── Route
//       ├── Schedule
//       ├── Vehicle
//       ├── Seats
//       ├── Pricing
//       ├── Preferences
//       └── Review
//
// Responsibilities:
// - Resolve the Journey public ID from the route.
// - Load the existing Journey.
// - Present the creation workflow.
// - Link the provider to each individual creation step.
//
// Non-responsibilities:
// - No Journey creation.
// - No route configuration.
// - No child-entity mutation.
// - No publishing.
// - No workflow state in React.
//
// The Journey returned by the backend is authoritative.
// Individual workflow pages own their respective mutations.
//
// -----------------------------------------------------------------------------

import Link from 'next/link';
import { notFound } from 'next/navigation';

// -----------------------------------------------------------------------------
// Journey feature
// -----------------------------------------------------------------------------

import { getJourney } from '@/features/journey/api';

// -----------------------------------------------------------------------------
// Routing
// -----------------------------------------------------------------------------

import { AUTHENTICATED_ROUTES } from '@/foundation/routing';

// =============================================================================
// Types
// =============================================================================

interface JourneyCreateWorkflowPageProps {
  params: Promise<{
    journeyPublicId: string;
  }>;
}

// =============================================================================
// Workflow definition
// =============================================================================

interface JourneyCreationWorkflowStep {
  key:
    | 'route'
    | 'schedule'
    | 'vehicle'
    | 'seats'
    | 'pricing'
    | 'preferences'
    | 'review';

  label: string;

  description: string;

  href: (
    journeyPublicId: string,
  ) => string;
}

const WORKFLOW_STEPS: readonly JourneyCreationWorkflowStep[] = [
  {
    key: 'route',

    label: 'Route',

    description:
      'Choose where you are travelling from, where you are going, and the stops along the way.',

    href: (journeyPublicId) =>
      AUTHENTICATED_ROUTES.JOURNEY_CREATE_ROUTE(
        journeyPublicId,
      ),
  },

  {
    key: 'schedule',

    label: 'Schedule',

    description:
      'Choose the date and time you plan to leave and arrive.',

    href: (journeyPublicId) =>
      AUTHENTICATED_ROUTES.JOURNEY_CREATE_SCHEDULE(
        journeyPublicId,
      ),
  },

  {
    key: 'vehicle',

    label: 'Vehicle',

    description:
      'Choose the vehicle you will use for this journey.',

    href: (journeyPublicId) =>
      AUTHENTICATED_ROUTES.JOURNEY_CREATE_VEHICLE(
        journeyPublicId,
      ),
  },

  {
    key: 'seats',

    label: 'Seats',

    description:
      'Choose how many passenger seats you have available to share.',

    href: (journeyPublicId) =>
      AUTHENTICATED_ROUTES.JOURNEY_CREATE_SEATS(
        journeyPublicId,
      ),
  },

  {
    key: 'pricing',

    label: 'Pricing',

    description:
      'Set the amount passengers will contribute towards the journey.',

    href: (journeyPublicId) =>
      AUTHENTICATED_ROUTES.JOURNEY_CREATE_PRICING(
        journeyPublicId,
      ),
  },

  {
    key: 'preferences',

    label: 'Preferences',

    description:
      'Choose the conditions and preferences travellers should know before booking.',

    href: (journeyPublicId) =>
      AUTHENTICATED_ROUTES.JOURNEY_CREATE_PREFERENCES(
        journeyPublicId,
      ),
  },

  {
    key: 'review',

    label: 'Review',

    description:
      'Check the journey details before you publish it for travellers to find.',

    href: (journeyPublicId) =>
      AUTHENTICATED_ROUTES.JOURNEY_CREATE_REVIEW(
        journeyPublicId,
      ),
  },
];

// =============================================================================
// Page
// =============================================================================

export default async function JourneyCreateWorkflowPage({
  params,
}: JourneyCreateWorkflowPageProps) {
  const {
    journeyPublicId,
  } = await params;

  // ---------------------------------------------------------------------------
  // Load the existing Journey draft.
  // ---------------------------------------------------------------------------

  let journey;

  try {
    journey = await getJourney(
      journeyPublicId,
    );
  } catch {
    notFound();
  }

  if (!journey) {
    notFound();
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <main className="min-h-[60vh] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-3xl">
        {/* ---------------------------------------------------------------- */}
        {/* Header                                                             */}
        {/* ---------------------------------------------------------------- */}

        <header className="mb-6">
          <p className="text-sm font-medium text-[var(--brand)]">
            sisiMove Journey
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            Create your journey
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)]">
            Complete the journey details below. Your progress is saved as
            you move through each step.
          </p>
        </header>

        {/* ---------------------------------------------------------------- */}
        {/* Journey draft                                                      */}
        {/* ---------------------------------------------------------------- */}

        <section
          aria-labelledby="journey-draft-title"
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6"
        >
          <div>
            <h2
              id="journey-draft-title"
              className="text-base font-semibold text-[var(--foreground)]"
            >
              Journey draft
            </h2>

            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              Continue setting up your journey.
            </p>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Workflow steps                                                   */}
          {/* -------------------------------------------------------------- */}

          <nav
            aria-label="Journey creation steps"
            className="mt-5"
          >
            <ol className="divide-y divide-[var(--border-subtle)] overflow-hidden rounded-xl border border-[var(--border-subtle)]">
              {WORKFLOW_STEPS.map(
                (step, index) => (
                  <li key={step.key}>
                    <Link
                      href={step.href(
                        journeyPublicId,
                      )}
                      className="group flex items-start gap-4 p-4 transition-colors hover:bg-[var(--background-subtle)] sm:p-5"
                    >
                      <span
                        aria-hidden="true"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-sm font-semibold text-[var(--foreground-muted)] group-hover:border-[var(--brand)] group-hover:text-[var(--brand)]"
                      >
                        {index + 1}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-[var(--foreground)]">
                          {step.label}
                        </span>

                        <span className="mt-1 block text-sm leading-5 text-[var(--foreground-muted)]">
                          {step.description}
                        </span>
                      </span>

                      <span
                        aria-hidden="true"
                        className="pt-1 text-sm text-[var(--foreground-muted)] transition-transform group-hover:translate-x-0.5"
                      >
                        →
                      </span>
                    </Link>
                  </li>
                ),
              )}
            </ol>
          </nav>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Back navigation                                                    */}
        {/* ---------------------------------------------------------------- */}

        <div className="mt-5">
          <Link
            href={AUTHENTICATED_ROUTES.MY_JOURNEYS}
            className="text-sm font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
          >
            ← Back to my journeys
          </Link>
        </div>
      </div>
    </main>
  );
}

