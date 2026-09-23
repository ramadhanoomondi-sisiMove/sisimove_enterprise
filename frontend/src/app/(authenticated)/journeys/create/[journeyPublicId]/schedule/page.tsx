// -----------------------------------------------------------------------------
// sisiMove — Journey Creation — Schedule Step
// -----------------------------------------------------------------------------
//
// Schedule configuration step for an existing Journey draft.
//
// Route:
//
//   /authenticated/journeys/create/:journeyPublicId/schedule
//
// Responsibilities:
// - Load the Journey's persisted schedule.
// - Present the schedule form.
// - Persist the selected schedule through the existing Journey API.
// - Navigate to the Vehicle step after successful submission.
//
// Non-responsibilities:
// - No Journey creation.
// - No schedule definition creation.
// - No workflow overview.
// - No publishing.
// - No direct HTTP implementation.
// - No independent journeyPublicId state.
//
// Persistence model:
//
//   Journey
//      └── JourneySchedule
//
// The Journey public ID comes exclusively from the route.
//
// IMPORTANT:
// `useJourneySchedule()` reads the schedule currently attached to the Journey.
// It is not a global schedule catalogue.
//
// Therefore this page does not invent a schedule catalogue endpoint.
//
// The current form contract requires:
//
//   schedules: readonly JourneyScheduleOption[]
//
// Until a separate schedule-catalogue API/hook is established, the currently
// persisted schedule is exposed as the selectable option. This allows an
// existing draft to be resumed without fabricating backend data.
//
// -----------------------------------------------------------------------------

'use client';

import {
  useMemo,
  useState,
} from 'react';

import { useRouter } from 'next/navigation';

import {
  JourneyScheduleForm,
  type JourneyScheduleFormValue,
  type JourneyScheduleOption,
} from '@/components/journeys/schedule';

import {
  useJourneySchedule,
  useAttachJourneySchedule,
} from '@/features/journey/hooks';

import {
  normalizeError,
} from '@/foundation/errors';

import {
  AUTHENTICATED_ROUTES,
} from '@/foundation/routing';

// =============================================================================
// Types
// =============================================================================

interface JourneySchedulePageProps {
  params: Promise<{
    journeyPublicId: string;
  }>;
}

// =============================================================================
// Page
// =============================================================================

export default function JourneySchedulePage({
  params,
}: JourneySchedulePageProps) {
  const [journeyPublicId, setJourneyPublicId] =
    useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // The application currently supplies route params asynchronously.
  //
  // Resolve the Journey public ID from the route and keep it as the only
  // Journey identifier used by this page.
  // ---------------------------------------------------------------------------

  void params.then(
    ({
      journeyPublicId: publicId,
    }) => {
      setJourneyPublicId(
        (current) =>
          current ?? publicId,
      );
    },
  );

  if (!journeyPublicId) {
    return null;
  }

  return (
    <JourneyScheduleStep
      journeyPublicId={journeyPublicId}
    />
  );
}

// =============================================================================
// Schedule step
// =============================================================================

interface JourneyScheduleStepProps {
  journeyPublicId: string;
}

function JourneyScheduleStep({
  journeyPublicId,
}: JourneyScheduleStepProps) {
  const router = useRouter();

  // ---------------------------------------------------------------------------
  // Load the Journey's persisted schedule.
  // ---------------------------------------------------------------------------

  const {
    data: schedule,
    isLoading,
    error: queryError,
    refetch,
  } = useJourneySchedule(
    journeyPublicId,
  );

  // ---------------------------------------------------------------------------
  // Schedule attachment mutation.
  // ---------------------------------------------------------------------------

  const attachSchedule =
    useAttachJourneySchedule();

  // ---------------------------------------------------------------------------
  // Mutation error
  // ---------------------------------------------------------------------------

  const [
    mutationError,
    setMutationError,
  ] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Saving state
  // ---------------------------------------------------------------------------

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  // ---------------------------------------------------------------------------
  // Form catalogue
  // ---------------------------------------------------------------------------
  //
  // The current frontend contract provides the Journey's persisted schedule,
  // not a global schedule catalogue.
  //
  // We therefore expose the persisted schedule as the available option.
  //
  // A future authoritative schedule-catalogue hook can replace this mapping
  // without changing the form's responsibilities.
  // ---------------------------------------------------------------------------

  const schedules =
    useMemo<
      readonly JourneyScheduleOption[]
    >(
      () => {
        if (!schedule) {
          return [];
        }

        return [
          {
            publicId:
              schedule.publicId,

            departureAt:
              schedule.departureAt,

            arrivalAt:
              schedule.arrivalAt,

            timezone:
              schedule.timezone,
          },
        ];
      },
      [schedule],
    );

  // ---------------------------------------------------------------------------
  // Existing selection
  // ---------------------------------------------------------------------------

  const defaultValue =
    schedule
      ? {
          schedulePublicId:
            schedule.publicId,
        }
      : undefined;

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  async function handleSubmit(
    value: JourneyScheduleFormValue,
  ): Promise<void> {
    if (
      isSaving ||
      attachSchedule.isPending
    ) {
      return;
    }

    setMutationError(null);
    setIsSaving(true);

    try {
      await attachSchedule.mutateAsync({
        journeyPublicId,
        input: {
          schedulePublicId:
            value.schedulePublicId,
        },
      });

      // -----------------------------------------------------------------------
      // Schedule is persisted. Continue to Vehicle.
      // -----------------------------------------------------------------------

      router.push(
        AUTHENTICATED_ROUTES.JOURNEY_CREATE_VEHICLE(
          journeyPublicId,
        ),
      );
    } catch (submitError: unknown) {
      const normalizedError =
        normalizeError(
          submitError,
        );

      setMutationError(
        normalizedError.message,
      );
    } finally {
      setIsSaving(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Query failure
  // ---------------------------------------------------------------------------

  if (queryError) {
    const normalizedError =
      normalizeError(queryError);

    return (
      <main className="min-h-[60vh] px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto w-full max-w-2xl">
          <section
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6"
            aria-labelledby="journey-schedule-error-title"
          >
            <h1
              id="journey-schedule-error-title"
              className="text-xl font-semibold text-[var(--foreground)]"
            >
              Schedule
            </h1>

            <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
              We could not load the schedule for this journey.
            </p>

            <p
              role="alert"
              className="mt-4 rounded-xl bg-[var(--danger-soft)] px-3 py-2 text-sm text-[var(--danger)]"
            >
              {normalizedError.message}
            </p>

            <button
              type="button"
              onClick={() => {
                void refetch();
              }}
              className="mt-5 rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--background-subtle)]"
            >
              Try again
            </button>
          </section>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Loading
  //
  // Route-level loading.tsx owns the visual loading state.
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <main className="min-h-[60vh] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-6">
          <p className="text-sm font-medium text-[var(--brand)]">
            Journey creation
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            Schedule
          </h1>

          <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
            Choose when you plan to make this journey.
          </p>
        </header>

        <JourneyScheduleForm
          schedules={schedules}
          defaultValue={defaultValue}
          onSubmit={handleSubmit}
          isLoading={isSaving}
          error={mutationError}
        />
      </div>
    </main>
  );
}
