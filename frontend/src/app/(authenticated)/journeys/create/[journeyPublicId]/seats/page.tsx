// -----------------------------------------------------------------------------
// sisiMove — Journey Seats Creation Page
// -----------------------------------------------------------------------------
//
// Route:
//   /journeys/create/[journeyPublicId]/seats
//
// Responsibilities:
// - Load the Journey-owned capacity.
// - Compose JourneySeatsStep and JourneySeatsForm.
// - Provide persisted capacity to the presentation form.
// - Track unsaved seat-count changes locally.
// - Persist capacity through useAttachJourneyCapacity.
// - Initialize bookedSeats to zero for a newly configured Journey.
// - Remove an existing Journey capacity when explicitly requested.
// - Navigate to the next Journey creation step.
//
// This page does NOT:
// - Create a standalone Capacity resource.
// - Generate capacity identifiers.
// - Calculate available seats.
// - Modify booked-seat state from the UI.
// - Implement Journey domain invariants.
// - Call the API from the form.
// - Own aggregate persistence directly.
// - Introduce navigation into the form component.
//
// The Journey aggregate remains the owner of capacity configuration.
// -----------------------------------------------------------------------------

'use client';

import {
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useParams, useRouter } from 'next/navigation';

import {
  JourneySeatsForm,
  JourneySeatsStep,
  type JourneySeatsFormSubmitValue,
} from '@/components/journeys/creation/seats';

import {
  useJourneyCapacity,
} from '@/features/journey/hooks/queries';

import {
  useAttachJourneyCapacity,
  useRemoveJourneyCapacity,
} from '@/features/journey/hooks/mutations';

import { AUTHENTICATED_ROUTES } from '@/foundation/routing';

import { Button } from '@/components/ui';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function isSameCapacity(
  left: JourneySeatsFormSubmitValue,
  right: JourneySeatsFormSubmitValue,
): boolean {
  return left.totalSeats === right.totalSeats;
}

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function JourneySeatsPage() {
  const router = useRouter();

  const params = useParams<{
    journeyPublicId: string;
  }>();

  const journeyPublicId =
    params.journeyPublicId;

  // ---------------------------------------------------------------------------
  // Query
  // ---------------------------------------------------------------------------

  const capacityQuery =
    useJourneyCapacity(journeyPublicId);

  // ---------------------------------------------------------------------------
  // Mutations
  // ---------------------------------------------------------------------------

  const attachCapacity =
    useAttachJourneyCapacity();

  const removeCapacity =
    useRemoveJourneyCapacity();

  // ---------------------------------------------------------------------------
  // Local presentation state
  // ---------------------------------------------------------------------------

  /**
   * Holds only values changed by the user during the current page session.
   *
   * Server state remains the source of truth until the user edits the form.
   * We intentionally do not mirror query data through an effect.
   */
  const [capacityDraft, setCapacityDraft] =
    useState<
      Partial<JourneySeatsFormSubmitValue>
    >();

  const [saveError, setSaveError] =
    useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Persisted capacity
  // ---------------------------------------------------------------------------

  const persistedCapacity =
    useMemo<
      JourneySeatsFormSubmitValue | undefined
    >(() => {
      const capacity =
        capacityQuery.data;

      if (!capacity) {
        return undefined;
      }

      return {
        totalSeats:
          capacity.totalSeats,
      };
    }, [capacityQuery.data]);

  // ---------------------------------------------------------------------------
  // Form value
  // ---------------------------------------------------------------------------

  /**
   * Once the user starts editing, the local draft takes precedence over the
   * persisted server value.
   */
  const capacityValue = useMemo<
    JourneySeatsFormSubmitValue | undefined
  >(() => {
    if (capacityDraft) {
      return {
        totalSeats:
          capacityDraft.totalSeats ??
          persistedCapacity?.totalSeats ??
          0,
      };
    }

    return persistedCapacity;
  }, [
    capacityDraft,
    persistedCapacity,
  ]);

  // ---------------------------------------------------------------------------
  // Form change
  // ---------------------------------------------------------------------------

  const handleCapacityChange =
    useCallback(
      (
        value: Partial<JourneySeatsFormSubmitValue>,
      ) => {
        setSaveError(null);

        setCapacityDraft((current) => ({
          ...current,
          ...value,
        }));
      },
      [],
    );

  // ---------------------------------------------------------------------------
  // Save capacity
  // ---------------------------------------------------------------------------

  const handleCapacitySubmit =
    useCallback(
      async (
        capacity: JourneySeatsFormSubmitValue,
      ) => {
        setSaveError(null);

        try {
          const capacityNeedsPersistence =
            !persistedCapacity ||
            !isSameCapacity(
              capacity,
              persistedCapacity,
            );

          if (capacityNeedsPersistence) {
            await attachCapacity.mutateAsync({
              journeyPublicId,
              totalSeats:
                capacity.totalSeats,
              bookedSeats: 0,
            });
          }

          setCapacityDraft(
            undefined,
          );

          router.push(
            AUTHENTICATED_ROUTES.JOURNEY_CREATE_PRICING(
              journeyPublicId,
            ),
          );
        } catch (error) {
          setSaveError(
            error instanceof Error
              ? error.message
              : 'Unable to save the Journey seat capacity. Please try again.',
          );
        }
      },
      [
        attachCapacity,
        journeyPublicId,
        persistedCapacity,
        router,
      ],
    );

  // ---------------------------------------------------------------------------
  // Remove capacity
  // ---------------------------------------------------------------------------

  const handleRemoveCapacity =
    useCallback(
      async () => {
        setSaveError(null);

        try {
          await removeCapacity.mutateAsync({
            journeyPublicId,
          });

          setCapacityDraft(
            undefined,
          );
        } catch (error) {
          setSaveError(
            error instanceof Error
              ? error.message
              : 'Unable to remove the Journey seat capacity. Please try again.',
          );
        }
      },
      [
        journeyPublicId,
        removeCapacity,
      ],
    );

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------

  const handleBack = useCallback(() => {
    router.push(
      AUTHENTICATED_ROUTES.JOURNEY_CREATE_VEHICLE(
        journeyPublicId,
      ),
    );
  }, [
    journeyPublicId,
    router,
  ]);

  const handleContinue = useCallback(() => {
    const form = document.getElementById(
      'journey-seats-form',
    );

    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    form.requestSubmit();
  }, []);

  // ---------------------------------------------------------------------------
  // Loading state
  // ---------------------------------------------------------------------------

  if (capacityQuery.isLoading) {
    return (
      <JourneySeatsStep>
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
            Loading seat capacity…
          </p>
        </div>
      </JourneySeatsStep>
    );
  }

  // ---------------------------------------------------------------------------
  // Query error
  // ---------------------------------------------------------------------------

  if (capacityQuery.isError) {
    return (
      <JourneySeatsStep>
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
            Unable to load the Journey seat capacity.
          </p>

          <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
            {capacityQuery.error instanceof Error
              ? capacityQuery.error.message
              : 'Please try again.'}
          </p>

          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                capacityQuery.refetch()
              }
            >
              Try again
            </Button>
          </div>
        </div>
      </JourneySeatsStep>
    );
  }

  // ---------------------------------------------------------------------------
  // Mutation state
  // ---------------------------------------------------------------------------

  const isSaving =
    attachCapacity.isPending ||
    removeCapacity.isPending;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <JourneySeatsStep>
      <div className="space-y-6">
        <JourneySeatsForm
          key={journeyPublicId}
          initialValue={capacityValue}
          disabled={isSaving}
          onChange={
            handleCapacityChange
          }
          onSubmit={
            handleCapacitySubmit
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

        {persistedCapacity && (
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
                Remove seat capacity
              </p>

              <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                Remove the current capacity configuration and set it again.
              </p>
            </div>

            <Button
              type="button"
              variant="danger"
              size="sm"
              loading={
                removeCapacity.isPending
              }
              disabled={
                attachCapacity.isPending
              }
              onClick={
                handleRemoveCapacity
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
              attachCapacity.isPending
            }
            disabled={
              removeCapacity.isPending
            }
            onClick={handleContinue}
          >
            Save and continue
          </Button>
        </div>
      </div>
    </JourneySeatsStep>
  );
}