// -----------------------------------------------------------------------------
// sisiMove — Journey Schedule Creation Page
// -----------------------------------------------------------------------------
//
// Route:
//   /journeys/create/[journeyPublicId]/schedule
//
// Responsibilities:
// - Load the Journey-owned schedule.
// - Compose the JourneyScheduleStep presentation component.
// - Provide persisted schedule data to JourneyScheduleForm.
// - Track unsaved form changes locally.
// - Persist the schedule through the Journey aggregate API.
// - Remove an existing Journey schedule when explicitly requested.
// - Navigate to the next Journey creation step.
//
// This page does NOT:
// - Create a Journey.
// - Create a standalone schedule resource.
// - Implement schedule domain rules.
// - Call the API from the form component.
// - Own schedule business invariants.
// - Introduce schedule update/patch semantics.
// - Modify the Journey aggregate directly.
//
// Schedule configuration belongs to the Journey aggregate. The page is the
// application/UI orchestration boundary that invokes the existing Journey
// schedule commands through the feature mutation hooks.
// -----------------------------------------------------------------------------

'use client';

import {
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useParams, useRouter } from 'next/navigation';

import {
  JourneyScheduleForm,
  JourneyScheduleStep,
  type JourneyScheduleFormSubmitValue,
} from '@/components/journeys/creation/schedule';

import {
  useJourneySchedule,
} from '@/features/journey/hooks/queries';

import {
  useAttachJourneySchedule,
  useRemoveJourneySchedule,
} from '@/features/journey/hooks/mutations';

import { AUTHENTICATED_ROUTES } from '@/foundation/routing';

import { Button } from '@/components/ui';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function isSameSchedule(
  left: JourneyScheduleFormSubmitValue,
  right: JourneyScheduleFormSubmitValue,
): boolean {
  return (
    left.departureAt === right.departureAt &&
    left.arrivalAt === right.arrivalAt &&
    left.timezone === right.timezone
  );
}

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function JourneySchedulePage() {
  const router = useRouter();

  const params = useParams<{
    journeyPublicId: string;
  }>();

  const journeyPublicId =
    params.journeyPublicId;

  // ---------------------------------------------------------------------------
  // Query
  // ---------------------------------------------------------------------------

  const scheduleQuery =
    useJourneySchedule(journeyPublicId);

  // ---------------------------------------------------------------------------
  // Mutations
  // ---------------------------------------------------------------------------

  const attachSchedule =
    useAttachJourneySchedule();

  const removeSchedule =
    useRemoveJourneySchedule();

  // ---------------------------------------------------------------------------
  // Local presentation state
  // ---------------------------------------------------------------------------

  /**
   * Holds only values changed by the user during the current page session.
   *
   * We intentionally do not mirror server state with an effect. The persisted
   * schedule remains the source of truth until the user edits the form.
   */
  const [scheduleDraft, setScheduleDraft] =
    useState<
      Partial<JourneyScheduleFormSubmitValue>
    >();

  const [saveError, setSaveError] =
    useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Persisted schedule
  // ---------------------------------------------------------------------------

  const persistedSchedule =
    useMemo<
      JourneyScheduleFormSubmitValue | undefined
    >(() => {
      const schedule =
        scheduleQuery.data;

      if (!schedule) {
        return undefined;
      }

      return {
        departureAt:
          schedule.departureAt,
        arrivalAt:
          schedule.arrivalAt ?? null,
        timezone:
          schedule.timezone,
      };
    }, [scheduleQuery.data]);

  // ---------------------------------------------------------------------------
  // Form value
  // ---------------------------------------------------------------------------

  /**
   * The form receives either:
   *
   * 1. the user's current unsaved draft, or
   * 2. the persisted Journey schedule.
   *
   * Once the user starts editing, their draft takes precedence until the page
   * is successfully persisted or the draft is explicitly cleared.
   */
  const scheduleValue = useMemo<
    Partial<JourneyScheduleFormSubmitValue> | undefined
  >(() => {
    if (scheduleDraft) {
      return scheduleDraft;
    }

    return persistedSchedule;
  }, [
    scheduleDraft,
    persistedSchedule,
  ]);

  // ---------------------------------------------------------------------------
  // Form change
  // ---------------------------------------------------------------------------

  const handleScheduleChange =
    useCallback(
      (
        value: Partial<JourneyScheduleFormSubmitValue>,
      ) => {
        setSaveError(null);

        setScheduleDraft((current) => ({
          ...current,
          ...value,
        }));
      },
      [],
    );

  // ---------------------------------------------------------------------------
  // Save schedule
  // ---------------------------------------------------------------------------

  const handleScheduleSubmit =
    useCallback(
      async (
        schedule: JourneyScheduleFormSubmitValue,
      ) => {
        setSaveError(null);

        try {
          const scheduleNeedsPersistence =
            !persistedSchedule ||
            !isSameSchedule(
              schedule,
              persistedSchedule,
            );

          if (scheduleNeedsPersistence) {
            await attachSchedule.mutateAsync({
              journeyPublicId,
              departureAt:
                schedule.departureAt,
              arrivalAt:
                schedule.arrivalAt ??
                undefined,
              timezone:
                schedule.timezone,
            });
          }

          setScheduleDraft(
            undefined,
          );

          router.push(
            AUTHENTICATED_ROUTES.JOURNEY_CREATE_VEHICLE(
              journeyPublicId,
            ),
          );
        } catch (error) {
          setSaveError(
            error instanceof Error
              ? error.message
              : 'Unable to save the Journey schedule. Please try again.',
          );
        }
      },
      [
        attachSchedule,
        journeyPublicId,
        persistedSchedule,
        router,
      ],
    );

  // ---------------------------------------------------------------------------
  // Remove schedule
  // ---------------------------------------------------------------------------

  const handleRemoveSchedule =
    useCallback(
      async () => {
        setSaveError(null);

        try {
          await removeSchedule.mutateAsync({
            journeyPublicId,
          });

          setScheduleDraft(
            undefined,
          );
        } catch (error) {
          setSaveError(
            error instanceof Error
              ? error.message
              : 'Unable to remove the Journey schedule. Please try again.',
          );
        }
      },
      [
        journeyPublicId,
        removeSchedule,
      ],
    );

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------

  const handleBack = useCallback(() => {
    router.push(
      AUTHENTICATED_ROUTES.JOURNEY_CREATE_ROUTE(
        journeyPublicId,
      ),
    );
  }, [
    journeyPublicId,
    router,
  ]);

const handleContinue = useCallback(() => {
  const form = document.getElementById(
    'journey-schedule-form',
  );

  if (!(form instanceof HTMLFormElement)) {
    return;
  }

  form.requestSubmit();
}, []);

  // ---------------------------------------------------------------------------
  // Loading state
  // ---------------------------------------------------------------------------

  if (scheduleQuery.isLoading) {
    return (
      <JourneyScheduleStep>
        <div
          className={[
            'rounded-[var(--radius-lg)]',
            'border',
            'border-[var(--border)]',
            'bg-[var(--surface)]',
            'p-5',
          ].join(' ')}
        >
          <p className="text-sm text-[var(--foreground-muted)]">
            Loading schedule…
          </p>
        </div>
      </JourneyScheduleStep>
    );
  }

  // ---------------------------------------------------------------------------
  // Query error
  // ---------------------------------------------------------------------------

  if (scheduleQuery.isError) {
    return (
      <JourneyScheduleStep>
        <div
          role="alert"
          className={[
            'rounded-[var(--radius-lg)]',
            'border',
            'border-[var(--danger)]',
            'bg-[var(--surface)]',
            'p-5',
          ].join(' ')}
        >
          <p className="text-sm font-medium text-[var(--danger)]">
            Unable to load the Journey schedule.
          </p>

          <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
            {scheduleQuery.error instanceof Error
              ? scheduleQuery.error.message
              : 'Please try again.'}
          </p>

          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                scheduleQuery.refetch()
              }
            >
              Try again
            </Button>
          </div>
        </div>
      </JourneyScheduleStep>
    );
  }

  // ---------------------------------------------------------------------------
  // Derived mutation state
  // ---------------------------------------------------------------------------

  const isSaving =
    attachSchedule.isPending ||
    removeSchedule.isPending;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <JourneyScheduleStep
      schedule={scheduleQuery.data}
    >
      <div className="space-y-6">
        <JourneyScheduleForm
          key={journeyPublicId}
          initialValue={scheduleValue}
          disabled={isSaving}
          onChange={
            handleScheduleChange
          }
          onSubmit={
            handleScheduleSubmit
          }
        />

        {saveError && (
          <div
            role="alert"
            className={[
              'rounded-[var(--radius-md)]',
              'border',
              'border-[var(--danger)]',
              'bg-[var(--surface)]',
              'px-4',
              'py-3',
            ].join(' ')}
          >
            <p className="text-sm text-[var(--danger)]">
              {saveError}
            </p>
          </div>
        )}

        {persistedSchedule && (
          <div
            className={[
              'flex',
              'items-center',
              'justify-between',
              'gap-4',
              'border-t',
              'border-[var(--border)]',
              'pt-5',
            ].join(' ')}
          >
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">
                Remove schedule
              </p>

              <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                You can remove the current schedule and configure it again.
              </p>
            </div>

            <Button
              type="button"
              variant="danger"
              size="sm"
              loading={
                removeSchedule.isPending
              }
              disabled={
                attachSchedule.isPending
              }
              onClick={
                handleRemoveSchedule
              }
            >
              Remove
            </Button>
          </div>
        )}

        <div
          className={[
            'flex',
            'flex-col-reverse',
            'gap-3',
            'border-t',
            'border-[var(--border)]',
            'pt-5',
            'sm:flex-row',
            'sm:items-center',
            'sm:justify-between',
          ].join(' ')}
        >
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
            loading={
              attachSchedule.isPending
            }
            disabled={
              removeSchedule.isPending
            }
            onClick={handleContinue}
          >
            Save and continue
          </Button>
        </div>
      </div>
    </JourneyScheduleStep>
  );
}