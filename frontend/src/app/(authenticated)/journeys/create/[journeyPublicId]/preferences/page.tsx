// -----------------------------------------------------------------------------
// sisiMove — Journey Preferences Creation Page
// -----------------------------------------------------------------------------
//
// Route:
//   /journeys/create/[journeyPublicId]/preferences
//
// Responsibilities:
// - Load the Journey-owned Preferences configuration.
// - Maintain the local workflow draft.
// - Persist Preferences through the Journey feature mutation hooks.
// - Avoid unnecessary persistence when nothing changed.
// - Navigate between Journey creation steps.
//
// Architectural boundary:
// - The route owns workflow orchestration.
// - JourneyPreferencesStep and JourneyPreferencesForm remain presentation-only.
// - Preferences are configured through the Journey aggregate.
// - The frontend does not create or manipulate a JourneyPreferences entity
//   directly.
// - No preference publicId is required for configuration/removal.
// -----------------------------------------------------------------------------

'use client';

import { useCallback, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import {
  JourneyPreferencesForm,
  JourneyPreferencesStep,
  type JourneyPreferencesFormSubmitValue,
} from '@/components/journeys/creation/preferences';

import {
  useJourneyPreferences,
} from '@/features/journey/hooks/queries';

import {
  useAttachJourneyPreferences,
  useRemoveJourneyPreferences,
} from '@/features/journey/hooks/mutations';

import { AUTHENTICATED_ROUTES } from '@/foundation/routing';

import { Button } from '@/components/ui';

// -----------------------------------------------------------------------------
// Comparison
// -----------------------------------------------------------------------------

/**
 * Determines whether the submitted configuration differs from the
 * Journey-owned persisted Preferences configuration.
 *
 * The comparison intentionally includes only the five configurable
 * preference values. Entity metadata such as publicId, createdAt, and
 * updatedAt does not participate in Journey Preferences configuration.
 */
function isSamePreferences(
  left: JourneyPreferencesFormSubmitValue,
  right: JourneyPreferencesFormSubmitValue,
): boolean {
  return (
    left.smoking === right.smoking &&
    left.pets === right.pets &&
    left.luggage === right.luggage &&
    left.conversation === right.conversation &&
    left.music === right.music
  );
}

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function JourneyPreferencesPage() {
  const router = useRouter();

  const params = useParams<{
    journeyPublicId: string;
  }>();

  const journeyPublicId = params.journeyPublicId;

  // ---------------------------------------------------------------------------
  // Query
  // ---------------------------------------------------------------------------

  const preferencesQuery = useJourneyPreferences(journeyPublicId);

  // ---------------------------------------------------------------------------
  // Mutations
  // ---------------------------------------------------------------------------

  const attachPreferences = useAttachJourneyPreferences();
  const removePreferences = useRemoveJourneyPreferences();

  // ---------------------------------------------------------------------------
  // Local workflow state
  // ---------------------------------------------------------------------------

  /**
   * Contains only values changed during the current form interaction.
   *
   * The persisted Journey configuration remains owned by the query cache.
   */
  const [preferencesDraft, setPreferencesDraft] = useState<
    Partial<JourneyPreferencesFormSubmitValue>
  >();

  const [saveError, setSaveError] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Persisted value
  // ---------------------------------------------------------------------------

  /**
   * Project the API model into the exact configuration shape consumed by the
   * presentation form.
   *
   * Entity metadata is deliberately excluded.
   */
  const persistedPreferences = useMemo(() => {
    const preferences = preferencesQuery.data;

    if (!preferences) {
      return undefined;
    }

    return {
      smoking: preferences.smoking,
      pets: preferences.pets,
      luggage: preferences.luggage,
      conversation: preferences.conversation,
      music: preferences.music,
    };
  }, [preferencesQuery.data]);

  // ---------------------------------------------------------------------------
  // Form value
  // ---------------------------------------------------------------------------

  /**
   * Merge the local draft over the persisted configuration.
   *
   * When no persisted configuration exists, the same defaults used by the
   * presentation form are supplied so the workflow has a complete value.
   */
  const preferencesValue = useMemo(() => {
    if (!preferencesDraft) {
      return persistedPreferences;
    }

    return {
      smoking:
        preferencesDraft.smoking ??
        persistedPreferences?.smoking ??
        'NOT_ALLOWED',

      pets:
        preferencesDraft.pets ??
        persistedPreferences?.pets ??
        'NOT_ALLOWED',

      luggage:
        preferencesDraft.luggage ??
        persistedPreferences?.luggage ??
        'STANDARD',

      conversation:
        preferencesDraft.conversation ??
        persistedPreferences?.conversation ??
        'MODERATE',

      music:
        preferencesDraft.music ??
        persistedPreferences?.music ??
        'NONE',
    };
  }, [preferencesDraft, persistedPreferences]);

  // ---------------------------------------------------------------------------
  // Form change
  // ---------------------------------------------------------------------------

  const handlePreferencesChange = useCallback(
    (value: Partial<JourneyPreferencesFormSubmitValue>) => {
      setSaveError(null);

      setPreferencesDraft((current) => ({
        ...current,
        ...value,
      }));
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Form submit
  // ---------------------------------------------------------------------------

  const handlePreferencesSubmit = useCallback(
    async (preferences: JourneyPreferencesFormSubmitValue) => {
      setSaveError(null);

      try {
        /**
         * Preferences are Journey-owned configuration.
         *
         * The route therefore sends the configuration to the Journey
         * mutation. It does not create or update a standalone
         * JourneyPreferences resource.
         */
        const preferencesNeedPersistence =
          !persistedPreferences ||
          !isSamePreferences(preferences, persistedPreferences);

        if (preferencesNeedPersistence) {
          await attachPreferences.mutateAsync({
            journeyPublicId,
            smoking: preferences.smoking,
            pets: preferences.pets,
            luggage: preferences.luggage,
            conversation: preferences.conversation,
            music: preferences.music,
          });
        }

        setPreferencesDraft(undefined);

        router.push(
          AUTHENTICATED_ROUTES.JOURNEY_CREATE_PHOTOS(journeyPublicId),
        );
      } catch (error) {
        setSaveError(
          error instanceof Error
            ? error.message
            : 'Unable to save the Journey preferences. Please try again.',
        );
      }
    },
    [
      attachPreferences,
      journeyPublicId,
      persistedPreferences,
      router,
    ],
  );

  // ---------------------------------------------------------------------------
  // Remove
  // ---------------------------------------------------------------------------

  const handleRemovePreferences = useCallback(async () => {
    setSaveError(null);

    try {
      await removePreferences.mutateAsync({
        journeyPublicId,
      });

      setPreferencesDraft(undefined);
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : 'Unable to remove the Journey preferences. Please try again.',
      );
    }
  }, [journeyPublicId, removePreferences]);

  // ---------------------------------------------------------------------------
  // Back
  // ---------------------------------------------------------------------------

  const handleBack = useCallback(() => {
    router.push(
      AUTHENTICATED_ROUTES.JOURNEY_CREATE_PRICING(journeyPublicId),
    );
  }, [journeyPublicId, router]);

  // ---------------------------------------------------------------------------
  // Continue
  // ---------------------------------------------------------------------------

  const handleContinue = useCallback(() => {
    const form = document.getElementById('journey-preferences-form');

    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    form.requestSubmit();
  }, []);

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (preferencesQuery.isLoading) {
    return (
      <JourneyPreferencesStep>
        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
          <p className="text-sm text-[var(--foreground-muted)]">
            Loading preferences…
          </p>
        </div>
      </JourneyPreferencesStep>
    );
  }

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------

  if (preferencesQuery.isError) {
    return (
      <JourneyPreferencesStep>
        <div
          role="alert"
          className="rounded-[var(--radius-lg)] border border-[var(--danger)] bg-[var(--surface)] p-5"
        >
          <p className="text-sm font-medium text-[var(--danger)]">
            Unable to load the Journey preferences.
          </p>

          <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
            {preferencesQuery.error instanceof Error
              ? preferencesQuery.error.message
              : 'Please try again.'}
          </p>

          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => preferencesQuery.refetch()}
            >
              Try again
            </Button>
          </div>
        </div>
      </JourneyPreferencesStep>
    );
  }

  // ---------------------------------------------------------------------------
  // Workflow state
  // ---------------------------------------------------------------------------

  const isSaving =
    attachPreferences.isPending ||
    removePreferences.isPending;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <JourneyPreferencesStep>
      <div className="space-y-6">
        <JourneyPreferencesForm
          key={journeyPublicId}
          initialValue={preferencesValue}
          disabled={isSaving}
          onChange={handlePreferencesChange}
          onSubmit={handlePreferencesSubmit}
        />

        {saveError && (
          <div
            role="alert"
            className="rounded-[var(--radius-md)] border border-[var(--danger)] bg-[var(--surface)] px-4 py-3"
          >
            <p className="text-sm text-[var(--danger)]">
              {saveError}
            </p>
          </div>
        )}

        {persistedPreferences && (
          <div className="flex items-center justify-between gap-4 border-t border-[var(--border)] pt-5">
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">
                Remove preferences
              </p>

              <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                Remove the current preferences configuration and set it again.
              </p>
            </div>

            <Button
              type="button"
              variant="danger"
              size="sm"
              loading={removePreferences.isPending}
              disabled={attachPreferences.isPending}
              onClick={handleRemovePreferences}
            >
              Remove
            </Button>
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-[var(--border)] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            disabled={isSaving}
            onClick={handleBack}
          >
            Back
          </Button>

          <Button
            type="button"
            loading={attachPreferences.isPending}
            disabled={removePreferences.isPending}
            onClick={handleContinue}
          >
            Save and continue
          </Button>
        </div>
      </div>
    </JourneyPreferencesStep>
  );
}