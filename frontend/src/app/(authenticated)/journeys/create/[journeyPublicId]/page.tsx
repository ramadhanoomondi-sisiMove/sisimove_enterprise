// -----------------------------------------------------------------------------
// sisiMove — Journey Creation Overview
// -----------------------------------------------------------------------------
//
// Journey creation workflow overview / resume surface.
//
// Route:
//
//     /journeys/create/[journeyPublicId]
//
// Responsibilities:
// - Load the existing Journey belonging to the authenticated user.
// - Present the Journey creation workflow overview.
// - Show the available Journey creation steps.
// - Navigate the user into an individual creation step.
//
// Non-responsibilities:
// - Creating a Journey.
// - Persisting Journey components.
// - Validating individual steps.
// - Publishing the Journey.
// - Performing lifecycle mutations.
//
// The Journey draft is created only by:
//
//     /journeys/create
//
// This route receives the existing public ID and must never create another
// Journey.
//
// -----------------------------------------------------------------------------
//
// Management read boundary
// -----------------------------------------------------------------------------
//
// This page is part of the authenticated Journey creation workflow.
//
// It therefore must NOT use:
//
//     useJourney()
//
// `useJourney()` belongs to Journey public discovery/detail and resolves the
// public Journey endpoint:
//
//     GET /journeys/:journeyPublicId
//
// A Journey DRAFT is not a marketplace-discoverable resource.
//
// Instead, this page uses:
//
//     useMyJourneys()
//          │
//          ▼
//     GET /journeys/me
//          │
//          ▼
//     MyJourney[]
//          │
//          ▼
//     find journey by publicId
//
// This keeps private Journey management behind the authenticated management
// boundary.
//
// -----------------------------------------------------------------------------
//
// Workflow
// -----------------------------------------------------------------------------
//
//     /journeys/create
//             │
//             │ create draft
//             ▼
//     /journeys/create/:journeyPublicId
//             │
//             ├── Route
//             ├── Schedule
//             ├── Vehicle
//             ├── Seats
//             ├── Pricing
//             ├── Preferences
//             ├── Photos
//             └── Review
//                          │
//                          ▼
//                       Publish
//
// Each individual step owns its own orchestration and persistence.
//
// This overview does not persist anything. It only provides the entry/resume
// surface for the existing Journey creation workflow.
//
// -----------------------------------------------------------------------------
//
// Navigation boundary
// -----------------------------------------------------------------------------
//
// This page owns router navigation.
//
// JourneyCreationShell remains presentation-only and receives navigation
// callbacks/destinations from this page.
//
// -----------------------------------------------------------------------------

'use client';

// -----------------------------------------------------------------------------
// Next.js
// -----------------------------------------------------------------------------

import Link from 'next/link';

import {
  useParams,
  useRouter,
} from 'next/navigation';

// -----------------------------------------------------------------------------
// Icons
// -----------------------------------------------------------------------------

import {
  ArrowRight,
  Check,
} from 'lucide-react';

// -----------------------------------------------------------------------------
// Shared UI
// -----------------------------------------------------------------------------

import {
  Button,
  ErrorState,
  Spinner,
} from '@/components/ui';

// -----------------------------------------------------------------------------
// Journey — Feature
// -----------------------------------------------------------------------------

import {
  useMyJourneys,
} from '@/features/journey/hooks/queries';

// -----------------------------------------------------------------------------
// Journey — Creation UI
// -----------------------------------------------------------------------------

import {
  JourneyCreationShell,
} from '@/components/journeys';

// -----------------------------------------------------------------------------
// Routes
// -----------------------------------------------------------------------------

import {
  AUTHENTICATED_ROUTES,
} from '@/foundation/routing/authenticated-routes';

// =============================================================================
// Step Definition
// =============================================================================

interface JourneyCreationOverviewStep {
  id:
    | 'route'
    | 'schedule'
    | 'vehicle'
    | 'seats'
    | 'pricing'
    | 'preferences'
    | 'photos'
    | 'review';

  label: string;
  description: string;
  href: (journeyPublicId: string) => string;
}

// =============================================================================
// Steps
// =============================================================================

const CREATION_STEPS: readonly JourneyCreationOverviewStep[] = [
  {
    id: 'route',
    label: 'Route',
    description:
      'Set where the journey starts, ends, and stops along the way.',
    href: AUTHENTICATED_ROUTES.JOURNEY_CREATE_ROUTE,
  },

  {
    id: 'schedule',
    label: 'Schedule',
    description:
      'Set the departure and arrival details for the journey.',
    href: AUTHENTICATED_ROUTES.JOURNEY_CREATE_SCHEDULE,
  },

  {
    id: 'vehicle',
    label: 'Vehicle',
    description:
      'Add the vehicle that will be used for the journey.',
    href: AUTHENTICATED_ROUTES.JOURNEY_CREATE_VEHICLE,
  },

  {
    id: 'seats',
    label: 'Seats',
    description:
      'Set the available passenger capacity.',
    href: AUTHENTICATED_ROUTES.JOURNEY_CREATE_SEATS,
  },

  {
    id: 'pricing',
    label: 'Pricing',
    description:
      'Set the cost-sharing amount for available seats.',
    href: AUTHENTICATED_ROUTES.JOURNEY_CREATE_PRICING,
  },

  {
    id: 'preferences',
    label: 'Preferences',
    description:
      'Set the travel preferences passengers should know about.',
    href: AUTHENTICATED_ROUTES.JOURNEY_CREATE_PREFERENCES,
  },

  {
    id: 'photos',
    label: 'Photos',
    description:
      'Add relevant photos that help travellers identify the journey, vehicle, or route.',
    href: AUTHENTICATED_ROUTES.JOURNEY_CREATE_PHOTOS,
  },

  {
    id: 'review',
    label: 'Review',
    description:
      'Review the completed Journey before publishing it.',
    href: AUTHENTICATED_ROUTES.JOURNEY_CREATE_REVIEW,
  },
];

// =============================================================================
// Page
// =============================================================================

export default function JourneyCreationOverviewPage() {
  const router = useRouter();

  const params = useParams<{
    journeyPublicId: string;
  }>();

  const journeyPublicId = params.journeyPublicId;

  // ---------------------------------------------------------------------------
  // Load authenticated Journey management collection
  // ---------------------------------------------------------------------------
  //
  // This is intentionally the authenticated management query rather than the
  // public Journey detail query.
  //
  // The creation overview must be able to resume a DRAFT that is not publicly
  // discoverable.
  //
  // ---------------------------------------------------------------------------

  const {
    data: journeys,
    isLoading,
    isError,
    refetch,
  } = useMyJourneys();

  // ---------------------------------------------------------------------------
  // Resolve requested Journey
  // ---------------------------------------------------------------------------
  //
  // Ownership has already been established by the authenticated /journeys/me
  // API boundary.
  //
  // The public ID from the route is used only to select the requested Journey
  // from the authenticated management collection.
  //
  // ---------------------------------------------------------------------------

  const journey = journeys?.find(
    (item) => item.publicId === journeyPublicId,
  );

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <main className="page-container">
        <div className="mx-auto max-w-3xl py-6 sm:py-8">
          <div className="flex min-h-[24rem] items-center justify-center">
            <Spinner
              size="lg"
              label="Loading your journey"
            />
          </div>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------

  if (isError) {
    return (
      <main className="page-container">
        <div className="mx-auto max-w-3xl py-6 sm:py-8">
          <ErrorState
            title="Unable to load this journey"
            description="We could not retrieve your Journey draft. Please try again."
            retryAction={{
              label: 'Try again',
              variant: 'primary',
              onClick: () => void refetch(),
            }}
          />
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Not found
  // ---------------------------------------------------------------------------
  //
  // If the requested public ID is not present in the authenticated management
  // collection, this page must not attempt to create or reconstruct another
  // Journey.
  //
  // This also prevents a user from using this route as a way to access another
  // user's Journey.
  //
  // ---------------------------------------------------------------------------

  if (!journey) {
    return (
      <main className="page-container">
        <div className="mx-auto max-w-3xl py-6 sm:py-8">
          <ErrorState
            title="Journey not found"
            description="This Journey draft could not be found in your Journeys."
            secondaryAction={{
              label: 'Back to My Journeys',
              variant: 'outline',
              onClick: () => {
                router.push(
                  AUTHENTICATED_ROUTES.MY_JOURNEYS,
                );
              },
            }}
          />
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------
  //
  // The overview is the entry/resume surface for the Route step.
  //
  // The shell remains presentation-only. Navigation is owned here.
  //
  // ---------------------------------------------------------------------------

  const routeHref =
    AUTHENTICATED_ROUTES.JOURNEY_CREATE_ROUTE(
      journey.publicId,
    );

  const handleStartRoute = () => {
    router.push(routeHref);
  };

  // ---------------------------------------------------------------------------
  // Overview
  // ---------------------------------------------------------------------------

  return (
    <JourneyCreationShell
      currentStep="route"
      title="Create your journey"
      description="Complete each step to prepare your Journey for publishing."
      previousHref={AUTHENTICATED_ROUTES.MY_JOURNEYS}
      nextHref={routeHref}
      backDisabled
      nextDisabled={false}
      onNext={handleStartRoute}
    >
      <div className="space-y-4">
        {CREATION_STEPS.map((step) => {
          const href = step.href(journey.publicId);

          return (
            <Link
              key={step.id}
              href={href}
              className="group block"
            >
              <div className="flex items-center gap-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--background-subtle)]">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
                  <Check
                    aria-hidden="true"
                    className="h-4 w-4"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-semibold text-[var(--foreground)]">
                    {step.label}
                  </h2>

                  <p className="mt-1 text-sm leading-5 text-[var(--foreground-secondary)]">
                    {step.description}
                  </p>
                </div>

                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-[var(--foreground-muted)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--brand)]"
                />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          variant="primary"
          trailingIcon={
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4"
            />
          }
          onClick={handleStartRoute}
        >
          Start with route
        </Button>
      </div>
    </JourneyCreationShell>
  );
}