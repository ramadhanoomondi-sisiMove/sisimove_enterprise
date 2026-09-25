'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Schedule Form
// -----------------------------------------------------------------------------
//
// Presentation-only form for collecting Journey schedule configuration.
//
// Responsibilities:
// - Present departure date/time.
// - Present optional arrival date/time.
// - Present schedule timezone.
// - Maintain local editing state.
// - Emit schedule changes to the parent workflow.
// - Emit the complete schedule value on submit.
//
// This component does NOT:
// - Call the Journey API.
// - Persist schedule state.
// - Know journeyPublicId.
// - Navigate.
// - Decide Journey business rules.
// -----------------------------------------------------------------------------

import type { FormEvent } from 'react';
import { useState } from 'react';

import { Input } from '@/components/ui';

import {
  isValidDate,
  toDate,
} from '@/foundation/utils';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyScheduleFormInitialValue {
  /**
   * Existing Journey departure timestamp.
   *
   * Expected to be an ISO-compatible transport string.
   */
  departureAt?: string;

  /**
   * Existing Journey arrival timestamp.
   *
   * Arrival is optional.
   */
  arrivalAt?: string | null;

  /**
   * IANA timezone identifier.
   *
   * Example:
   *
   *     Africa/Nairobi
   */
  timezone?: string;
}

/**
 * Complete schedule configuration emitted by the form.
 *
 * Timestamp values are transport-ready ISO strings.
 */
export interface JourneyScheduleFormSubmitValue {
  departureAt: string;
  arrivalAt: string | null;
  timezone: string;
}

export interface JourneyScheduleFormProps {
  /**
   * Initial schedule configuration supplied by the parent workflow.
   *
   * This is an initial snapshot only.
   *
   * If the parent needs to display another Journey schedule, remount the
   * component with a stable React key.
   */
  initialValue?: JourneyScheduleFormInitialValue;

  /**
   * Prevents editing and submission.
   */
  disabled?: boolean;

  /**
   * Emits the current schedule draft while the user edits.
   *
   * Timestamp values emitted here are transport-ready ISO strings.
   */
  onChange?: (
    value: Partial<JourneyScheduleFormSubmitValue>,
  ) => void;

  /**
   * Emits the complete schedule configuration.
   *
   * Persistence belongs to the parent workflow.
   */
  onSubmit?: (
    value: JourneyScheduleFormSubmitValue,
  ) => void | Promise<void>;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

/**
 * Converts an ISO-compatible timestamp into the value required by an HTML
 * `datetime-local` input.
 *
 * HTML `datetime-local` expects:
 *
 *     YYYY-MM-DDTHH:mm
 *
 * The Journey/API boundary remains ISO-based.
 */
function toDateTimeLocalValue(
  value?: string | null,
): string {
  if (!value) {
    return '';
  }

  const date = toDate(value);

  if (!isValidDate(date)) {
    return '';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Converts an HTML `datetime-local` value into an ISO-compatible timestamp.
 *
 * Returns null when the value is empty or invalid.
 */
function toIsoTimestamp(
  value: string,
): string | null {
  if (!value) {
    return null;
  }

  const date = toDate(value);

  if (!isValidDate(date)) {
    return null;
  }

  return date.toISOString();
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyScheduleForm({
  initialValue,
  disabled = false,
  onChange,
  onSubmit,
}: JourneyScheduleFormProps) {
  // ---------------------------------------------------------------------------
  // Local presentation state
  // ---------------------------------------------------------------------------
  //
  // The form keeps `datetime-local` strings locally because those are the
  // values required by the native browser controls.
  //
  // They are converted to ISO transport strings only when emitted upward.
  // ---------------------------------------------------------------------------

  const [departureAt, setDepartureAt] = useState(
    () =>
      toDateTimeLocalValue(
        initialValue?.departureAt,
      ),
  );

  const [arrivalAt, setArrivalAt] = useState(
    () =>
      toDateTimeLocalValue(
        initialValue?.arrivalAt,
      ),
  );

  const [timezone, setTimezone] = useState(
    () =>
      initialValue?.timezone ??
      'Africa/Nairobi',
  );

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  function handleDepartureChange(
    value: string,
  ) {
    setDepartureAt(value);

    const departureTimestamp =
      toIsoTimestamp(value);

    onChange?.({
      departureAt:
        departureTimestamp ?? value,
    });
  }

  function handleArrivalChange(
    value: string,
  ) {
    setArrivalAt(value);

    onChange?.({
      arrivalAt:
        toIsoTimestamp(value),
    });
  }

  function handleTimezoneChange(
    value: string,
  ) {
    setTimezone(value);

    onChange?.({
      timezone: value,
    });
  }

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      disabled ||
      !departureAt ||
      !timezone.trim()
    ) {
      return;
    }

    const departureTimestamp =
      toIsoTimestamp(departureAt);

    /**
     * Departure is required.
     *
     * Native browser validation normally prevents this case, but the explicit
     * check keeps the component safe when submission is triggered
     * programmatically.
     */
    if (!departureTimestamp) {
      return;
    }

    /**
     * Arrival is optional.
     *
     * An empty arrival field is deliberately represented as null in the
     * form's canonical value.
     */
    const arrivalTimestamp =
      arrivalAt
        ? toIsoTimestamp(arrivalAt)
        : null;

    /**
     * If a non-empty arrival value cannot be converted into a valid timestamp,
     * do not submit an invalid schedule.
     *
     * The browser handles normal datetime-local validation, while this check
     * protects programmatic submission.
     */
    if (arrivalAt && !arrivalTimestamp) {
      return;
    }

    const value: JourneyScheduleFormSubmitValue = {
      departureAt: departureTimestamp,
      arrivalAt: arrivalTimestamp,
      timezone: timezone.trim(),
    };

    await onSubmit?.(value);
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <form
      id="journey-schedule-form"
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* -----------------------------------------------------------------------
          Departure
          ----------------------------------------------------------------------- */}

      <Input
        id="journey-schedule-departure"
        label="Departure"
        helperText="When you plan to leave."
        type="datetime-local"
        name="departureAt"
        value={departureAt}
        onChange={(event) =>
          handleDepartureChange(
            event.target.value,
          )
        }
        disabled={disabled}
        required
      />

      {/* -----------------------------------------------------------------------
          Arrival
          ----------------------------------------------------------------------- */}

      <Input
        id="journey-schedule-arrival"
        label="Arrival"
        helperText="Optional expected arrival time."
        type="datetime-local"
        name="arrivalAt"
        value={arrivalAt}
        onChange={(event) =>
          handleArrivalChange(
            event.target.value,
          )
        }
        disabled={disabled}
      />

      {/* -----------------------------------------------------------------------
          Timezone
          ----------------------------------------------------------------------- */}

      <Input
        id="journey-schedule-timezone"
        label="Timezone"
        helperText="The timezone used for this Journey schedule."
        type="text"
        name="timezone"
        value={timezone}
        onChange={(event) =>
          handleTimezoneChange(
            event.target.value,
          )
        }
        disabled={disabled}
        required
        placeholder="Africa/Nairobi"
        autoComplete="off"
      />

      {/* -----------------------------------------------------------------------
          Hidden native submit control
          ----------------------------------------------------------------------- */}

      <button
        type="submit"
        disabled={
          disabled ||
          !departureAt ||
          !timezone.trim()
        }
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      >
        Save schedule
      </button>
    </form>
  );
}