// -----------------------------------------------------------------------------
// sisiMove — Journey Schedule Form
// -----------------------------------------------------------------------------
//
// Schedule selection form for journey creation.
//
// Architectural rule:
// - Schedule definitions are controlled by the application.
// - Providers select an existing schedule definition.
// - Providers do not directly create arbitrary schedule records through this
//   presentation component.
// - Backend remains authoritative and must validate the selected schedule.
//
// Responsibilities:
// - Present available schedule options.
// - Capture the provider's schedule selection.
// - Delegate submission to the parent.
//
// Non-responsibilities:
// - No API calls.
// - No catalogue fetching.
// - No router usage.
// - No persistence.
// - No direct schedule mutation.
// - No backend business-rule enforcement.
//
// Backend write operation:
// - POST /journeys/:journeyPublicId/schedule
//     { schedulePublicId }
//
// -----------------------------------------------------------------------------

'use client';

import { useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------

export interface JourneyScheduleOption {
  /**
   * Public identifier of the controlled schedule.
   */
  publicId: string;

  /**
   * Departure timestamp represented as an ISO 8601 string.
   */
  departureAt: string;

  /**
   * Optional arrival timestamp represented as an ISO 8601 string.
   */
  arrivalAt: string | null;

  /**
   * IANA timezone associated with the schedule.
   */
  timezone: string;
}

export interface JourneyScheduleFormValue {
  /**
   * Selected schedule public identifier.
   */
  schedulePublicId: string;
}

export interface JourneyScheduleFormProps {
  /**
   * Controlled sisiMove schedule catalogue.
   */
  schedules: readonly JourneyScheduleOption[];

  /**
   * Existing schedule selection, useful when editing or resuming a draft.
   */
  defaultValue?: JourneyScheduleFormValue;

  /**
   * Called after the provider submits a valid selection.
   */
  onSubmit: (
    value: JourneyScheduleFormValue,
  ) => void | Promise<void>;

  /**
   * Indicates that the parent is persisting the selection.
   */
  isLoading?: boolean;

  /**
   * Optional error supplied by the parent.
   */
  error?: string | null;
}

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

function formatSchedule(
  schedule: JourneyScheduleOption,
): string {
  const departure = new Date(schedule.departureAt);

  if (Number.isNaN(departure.getTime())) {
    return schedule.departureAt;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: schedule.timezone,
  }).format(departure);
}

function formatArrival(
  schedule: JourneyScheduleOption,
): string | null {
  if (!schedule.arrivalAt) {
    return null;
  }

  const arrival = new Date(schedule.arrivalAt);

  if (Number.isNaN(arrival.getTime())) {
    return schedule.arrivalAt;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: schedule.timezone,
  }).format(arrival);
}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------

export function JourneyScheduleForm({
  schedules,
  defaultValue,
  onSubmit,
  isLoading = false,
  error = null,
}: JourneyScheduleFormProps) {
  // ---------------------------------------------------------------------------
  // Local selection state
  // ---------------------------------------------------------------------------

  const [schedulePublicId, setSchedulePublicId] =
    useState(
      defaultValue?.schedulePublicId ?? '',
    );

  // ---------------------------------------------------------------------------
  // Resolve selected schedule from the controlled catalogue.
  // ---------------------------------------------------------------------------

  const selectedSchedule =
    schedules.find(
      (schedule) =>
        schedule.publicId ===
        schedulePublicId,
    ) ?? null;

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (
      !schedulePublicId ||
      selectedSchedule === null ||
      isLoading
    ) {
      return;
    }

    await onSubmit({
      schedulePublicId,
    });
  }

  // ---------------------------------------------------------------------------
  // Derived UI state
  // ---------------------------------------------------------------------------

  const hasSchedules =
    schedules.length > 0;

  const canSubmit =
    Boolean(schedulePublicId) &&
    selectedSchedule !== null &&
    !isLoading;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* ------------------------------------------------------------------ */}
      {/* Schedule selection                                                   */}
      {/* ------------------------------------------------------------------ */}

      <div className="space-y-2">
        <div>
          <label
            htmlFor="journey-schedule"
            className="text-sm font-semibold text-[var(--foreground)]"
          >
            Journey schedule
          </label>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Select when you plan to make this journey.
          </p>
        </div>

        <Select
          id="journey-schedule"
          value={schedulePublicId}
          onChange={(event) =>
            setSchedulePublicId(
              event.target.value,
            )
          }
          disabled={
            isLoading ||
            !hasSchedules
          }
        >
          <option value="">
            {!hasSchedules
              ? 'No schedules available'
              : 'Select a schedule'}
          </option>

          {schedules.map(
            (schedule) => (
              <option
                key={schedule.publicId}
                value={
                  schedule.publicId
                }
              >
                {formatSchedule(schedule)}
              </option>
            ),
          )}
        </Select>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Selected schedule summary                                           */}
      {/* ------------------------------------------------------------------ */}

      {selectedSchedule ? (
        <Card className="space-y-3 p-4 sm:p-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Departure
            </p>

            <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
              {formatSchedule(
                selectedSchedule,
              )}
            </p>
          </div>

          {selectedSchedule.arrivalAt ? (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                Expected arrival
              </p>

              <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                {formatArrival(
                  selectedSchedule,
                )}
              </p>
            </div>
          ) : null}

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Timezone
            </p>

            <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
              {selectedSchedule.timezone}
            </p>
          </div>
        </Card>
      ) : null}

      {/* ------------------------------------------------------------------ */}
      {/* Parent/application error                                            */}
      {/* ------------------------------------------------------------------ */}

      {error ? (
        <p
          role="alert"
          className="rounded-lg bg-[var(--danger-soft)] px-3 py-2 text-sm text-[var(--danger)]"
        >
          {error}
        </p>
      ) : null}

      {/* ------------------------------------------------------------------ */}
      {/* Form action                                                         */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex justify-end border-t border-[var(--border-subtle)] pt-4">
        <Button
          type="submit"
          disabled={!canSubmit}
        >
          {isLoading
            ? 'Saving…'
            : 'Continue'}
        </Button>
      </div>
    </form>
  );
}

