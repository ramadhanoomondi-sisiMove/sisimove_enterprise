'use client';

// -----------------------------------------------------------------------------
// sisiMove — Create Journey Start Page
// -----------------------------------------------------------------------------
//
// Journey creation entry point.
//
// Route:
//
//     /journeys/create
//
// Responsibilities:
// - Start a new Journey creation workflow.
// - Create the initial Journey draft through the Journey feature layer.
// - Navigate to the Journey creation workspace after creation succeeds.
// - Present the initial loading/error state for draft creation.
// - Allow the user to retry draft creation after a failure.
//
// Non-responsibilities:
// - Journey creation form fields.
// - Component attachment.
// - Route configuration.
// - Schedule configuration.
// - Vehicle configuration.
// - Capacity configuration.
// - Pricing configuration.
// - Preferences configuration.
// - Photo management.
// - Publishing.
//
// The creation workspace owns those subsequent steps.
//
// Architectural boundary:
//
//     /journeys/create
//            │
//            ▼
//     useCreateJourney()
//            │
//            ▼
//     POST /journeys
//            │
//            ▼
//     Journey draft
//            │
//            ▼
//     /journeys/create/:journeyPublicId
//
// The backend derives the authenticated provider from the current session.
// No provider identity is supplied by the frontend.
//
// IMPORTANT:
//
// This page intentionally creates only the Journey aggregate root.
//
// The Journey starts as a DRAFT with no configured child components.
// Subsequent creation pages configure the aggregate one step at a time:
//
//     Route
//       ↓
//     Schedule
//       ↓
//     Vehicle
//       ↓
//     Seats
//       ↓
//     Pricing
//       ↓
//     Preferences
//       ↓
//     Photos
//       ↓
//     Review
//       ↓
//     Publish
//
// Each subsequent step persists its configuration before the workflow moves
// forward.
//
// This page therefore acts as a workflow bootstrapper, not as a Journey
// configuration screen.
// -----------------------------------------------------------------------------

import {
  useEffect,
  useState,
} from 'react';

import {
  useRouter,
} from 'next/navigation';

import {
  AlertCircle,
} from 'lucide-react';

// -----------------------------------------------------------------------------
// Shared UI
// -----------------------------------------------------------------------------

import {
  Button,
  Spinner,
} from '@/components/ui';

// -----------------------------------------------------------------------------
// Journey — Feature
// -----------------------------------------------------------------------------

import {
  useCreateJourney,
} from '@/features/journey/hooks/mutations';

// -----------------------------------------------------------------------------
// Routes
// -----------------------------------------------------------------------------

import {
  AUTHENTICATED_ROUTES,
} from '@/foundation/routing/authenticated-routes';

// =============================================================================
// Page
// =============================================================================

export default function CreateJourneyPage() {
  const router = useRouter();

  const {
    mutateAsync: createJourney,
    isPending,
  } = useCreateJourney();

  /**
   * Creation attempt counter.
   *
   * The initial value represents the first automatic creation attempt.
   *
   * Incrementing this value explicitly starts another creation attempt after
   * a failure.
   *
   * This is important because clearing local error state alone does not cause
   * the creation effect to execute again.
   */
  const [creationAttempt, setCreationAttempt] = useState(0);

  /**
   * Local workflow error.
   *
   * The mutation itself owns the request lifecycle, while this page owns
   * whether the bootstrap workflow has failed and therefore whether the user
   * should see the retry state.
   */
  const [error, setError] = useState<unknown>(null);

  // ---------------------------------------------------------------------------
  // Start creation workflow
  // ---------------------------------------------------------------------------
  //
  // The entry route does not collect Journey data.
  //
  // POST /journeys intentionally has no request body. The backend derives the
  // authenticated provider from the current session and creates the initial
  // Journey draft.
  //
  // The effect is keyed by `creationAttempt` so the retry action can
  // explicitly start another creation request.
  //
  // ---------------------------------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    const startCreation = async () => {
      try {
        setError(null);

        const journey = await createJourney();

        if (cancelled) {
          return;
        }

        router.replace(
          AUTHENTICATED_ROUTES.JOURNEY_CREATE(
            journey.publicId,
          ),
        );
      } catch (creationError) {
        if (!cancelled) {
          setError(creationError);
        }
      }
    };

    void startCreation();

    return () => {
      cancelled = true;
    };
  }, [
    creationAttempt,
    createJourney,
    router,
  ]);

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------
  //
  // A creation attempt starts automatically when this page mounts.
  //
  // While the request is pending, the user receives a simple workflow
  // bootstrap state rather than a form. There is deliberately no partial
  // Journey data to enter on this screen.
  //
  // `!error` keeps the page in its initial/loading presentation until the
  // current attempt either succeeds or records an error.
  //
  // ---------------------------------------------------------------------------

  if (isPending || !error) {
    return (
      <main className="w-full">
        <div className="mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          <div className="mx-auto flex min-h-[24rem] w-full max-w-3xl items-center justify-center">
            <Spinner
              size="lg"
              label="Starting your journey"
            />
          </div>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------
  //
  // At this point the bootstrap request has failed.
  //
  // No Journey configuration should be attempted here. The only available
  // recovery action is to explicitly start another Journey creation attempt.
  //
  // ---------------------------------------------------------------------------

  return (
    <main className="w-full">
      <div className="mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="mx-auto flex min-h-[24rem] w-full max-w-md items-center justify-center">
          <div className="w-full text-center">
            <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--danger-soft)] text-[var(--danger)]">
              <AlertCircle
                aria-hidden="true"
                className="h-5 w-5"
              />
            </div>

            <h1 className="text-lg font-semibold text-[var(--foreground)]">
              We could not start your journey
            </h1>

            <p className="mt-2 text-sm leading-6 text-[var(--foreground-secondary)]">
              Your Journey draft could not be created. Please try again.
            </p>

            <div className="mt-5 flex justify-center">
              <Button
                type="button"
                variant="primary"
                onClick={() => {
                  setError(null);
                  setCreationAttempt(
                    (attempt) => attempt + 1,
                  );
                }}
              >
                Try again
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}