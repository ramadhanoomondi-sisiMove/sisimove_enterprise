// -----------------------------------------------------------------------------
// sisiMove — Journey Preferences Step
// -----------------------------------------------------------------------------
//
// Provider-declared Journey preferences.
//
// Workflow:
//
// Route
//   ↓
// Schedule
//   ↓
// Vehicle
//   ↓
// Seats
//   ↓
// Pricing
//   ↓
// Preferences
//   ↓
// Review
//
// -----------------------------------------------------------------------------

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  JourneyPreferencesForm,
  type JourneyPreferencesFormValue,
} from '@/components/journeys/preferences';

import { useJourneyPreferences } from '@/features/journey/hooks/use-journey-preferences';
import { useAttachJourneyPreferences } from '@/features/journey/hooks/use-attach-journey-preferences';

import { normalizeError } from '@/foundation/errors';
import { AUTHENTICATED_ROUTES } from '@/foundation/routing';

// =============================================================================
// Route Props
// =============================================================================

interface JourneyPreferencesPageProps {
  params: Promise<{
    journeyPublicId: string;
  }>;
}

// =============================================================================
// Page
// =============================================================================

export default function JourneyPreferencesPage({
  params,
}: JourneyPreferencesPageProps) {
  const [journeyPublicId, setJourneyPublicId] = useState<string | null>(
    null,
  );

  // ---------------------------------------------------------------------------
  // Resolve the dynamic route parameter.
  // ---------------------------------------------------------------------------
  //
  // This follows the existing Journey creation step pattern used by the
  // working Route and Seats pages.
  //

  void params.then(({ journeyPublicId: publicId }) => {
    setJourneyPublicId(
      (current) => current ?? publicId,
    );
  });

  if (!journeyPublicId) {
    return null;
  }

  return (
    <JourneyPreferencesStep
      journeyPublicId={journeyPublicId}
    />
  );
}

// =============================================================================
// Preferences Step
// =============================================================================

interface JourneyPreferencesStepProps {
  journeyPublicId: string;
}

function JourneyPreferencesStep({
  journeyPublicId,
}: JourneyPreferencesStepProps) {
  const router = useRouter();

  // ---------------------------------------------------------------------------
  // Existing Journey preferences
  // ---------------------------------------------------------------------------
  //
  // A draft may not have a JourneyPreferences child yet.
  //

  const {
    data: preferences,
    isLoading,
    error: queryError,
    refetch,
  } = useJourneyPreferences(
    journeyPublicId,
  );

  // ---------------------------------------------------------------------------
  // Mutation
  // ---------------------------------------------------------------------------

  const attachPreferences =
    useAttachJourneyPreferences();

  // ---------------------------------------------------------------------------
  // Mutation error
  // ---------------------------------------------------------------------------

  const [
    mutationError,
    setMutationError,
  ] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  async function handleSubmit(
    value: JourneyPreferencesFormValue,
  ): Promise<void> {
    if (attachPreferences.isPending) {
      return;
    }

    setMutationError(null);

    try {
      await attachPreferences.mutateAsync({
        journeyPublicId,
        input: {
          smoking: value.smoking,
          pets: value.pets,
          luggage: value.luggage,
          conversation: value.conversation,
          music: value.music,
        },
      });

      // -----------------------------------------------------------------------
      // Preferences have been persisted.
      //
      // The URL represents workflow position. The Journey backend represents
      // the persisted data state.
      // -----------------------------------------------------------------------

      router.push(
        AUTHENTICATED_ROUTES.JOURNEY_CREATE_REVIEW(
          journeyPublicId,
        ),
      );
    } catch (submitError: unknown) {
      const normalizedError =
        normalizeError(submitError);

      setMutationError(
        normalizedError.message,
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Query error
  // ---------------------------------------------------------------------------

  if (queryError) {
    const normalizedError =
      normalizeError(queryError);

    return (
      <main className="min-h-[60vh] px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto w-full max-w-2xl">
          <section
            aria-labelledby="journey-preferences-error-title"
            className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 sm:p-6"
          >
            <p className="text-sm font-medium text-[var(--brand)]">
              Journey creation
            </p>

            <h1
              id="journey-preferences-error-title"
              className="mt-1 text-lg font-semibold text-[var(--foreground)]"
            >
              Journey preferences
            </h1>

            <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
              We could not load the preferences for this journey.
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
              className="mt-5 rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--background-subtle)]"
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
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // Existing preferences → form defaults
  // ---------------------------------------------------------------------------
  //
  // JourneyPreferences.publicId is not used because it identifies the
  // persisted child entity. It is not a catalogue selection.
  //

  const defaultValue = preferences
    ? {
        smoking: preferences.smoking,
        pets: preferences.pets,
        luggage: preferences.luggage,
        conversation: preferences.conversation,
        music: preferences.music,
      }
    : undefined;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <main className="min-h-[60vh] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-6">
          <p className="text-sm font-medium text-[var(--brand)]">
            Journey creation
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            Preferences
          </h1>

          <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
            Set the travel conditions passengers should know before
            booking your journey.
          </p>
        </header>

        <JourneyPreferencesForm
          defaultValue={defaultValue}
          onSubmit={handleSubmit}
          isLoading={
            attachPreferences.isPending
          }
          error={mutationError}
        />
      </div>
    </main>
  );
}