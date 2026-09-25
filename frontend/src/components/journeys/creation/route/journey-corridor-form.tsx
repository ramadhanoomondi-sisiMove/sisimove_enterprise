'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Creation
// Corridor Form
// -----------------------------------------------------------------------------
//
// Presentation-only form for configuring the Journey corridor.
//
// Responsibilities:
// - Collect origin information.
// - Collect destination information.
// - Collect origin coordinates.
// - Collect destination coordinates.
// - Maintain local presentation state.
// - Expose typed values to the parent workflow.
//
// Architectural boundaries:
//
// This component does NOT:
// - Call the API.
// - Create public IDs.
// - Navigate.
// - Persist Journey state.
// - Know the Journey public ID.
// - Resolve the Journey aggregate.
// - Perform domain validation.
//
// The parent Journey route/workflow owns API orchestration, persistence,
// navigation, and domain validation.
//
// -----------------------------------------------------------------------------
//
// React state architecture:
//
// `initialValue` is an INITIAL value.
//
// It is intentionally used only during the initial `useState` construction.
// We do NOT synchronize it through:
//
//   useEffect(() => setDraft(...), [initialValue])
//
// because that creates a render → effect → setState → render cascade and can
// also overwrite active user edits when the parent recreates the initial value.
//
// Likewise, `onChange` is emitted directly from user mutations rather than
// from:
//
//   useEffect(() => onChange(...), [draft, onChange])
//
// This keeps the form locally controlled without effect-driven state
// synchronization.
//
// If a parent needs to load a completely different Journey into this form,
// it should remount the form with a stable React `key` for that Journey.
//
// -----------------------------------------------------------------------------
//
// Data boundary:
//
//   React editing state
//        ↓
//   CorridorDraft
//        ↓
//   parseOptionalNumber()
//        ↓
//   JourneyCorridorFormSubmitValue
//        ↓
//   parent workflow
//        ↓
//   application command / domain
//
// -----------------------------------------------------------------------------

import type {
  ChangeEvent,
  FormEvent,
} from 'react';

import {
  useState,
} from 'react';

import { Input } from '@/components/ui';

// -----------------------------------------------------------------------------
// Submit value
// -----------------------------------------------------------------------------
//
// This is the complete presentation-to-workflow contract.
//
// Coordinates are numbers here because this contract represents a complete
// corridor configuration rather than actively edited input fields.
//
// -----------------------------------------------------------------------------

export interface JourneyCorridorFormSubmitValue {
  originName: string;
  originLatitude: number;
  originLongitude: number;

  destinationName: string;
  destinationLatitude: number;
  destinationLongitude: number;
}

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyCorridorFormProps {
  /**
   * Existing corridor values used when initializing or editing the step.
   *
   * Partial values are supported because the Journey may still be incomplete.
   *
   * This value is intentionally treated as initial configuration. It is not
   * continuously synchronized into local state after mount.
   */
  initialValue?: Partial<JourneyCorridorFormSubmitValue>;

  /**
   * Prevents editing while the workflow is busy.
   */
  disabled?: boolean;

  /**
   * Called when the corridor values are explicitly submitted.
   */
  onSubmit?: (
    value: JourneyCorridorFormSubmitValue,
  ) => void | Promise<void>;

  /**
   * Called whenever a local presentation mutation produces a new draft.
   *
   * Numeric values are converted when possible. Empty or invalid numeric
   * fields are represented as `undefined`.
   *
   * This callback is intentionally separate from `onSubmit`: the parent may
   * use it for workflow-local state without treating the values as a complete
   * command-ready corridor.
   */
  onChange?: (
    value: Partial<JourneyCorridorFormSubmitValue>,
  ) => void;
}

// -----------------------------------------------------------------------------
// Internal state
// -----------------------------------------------------------------------------
//
// Numeric fields remain strings while the user is editing.
//
// This is important for normal browser form behavior because an input such as
// `-1.` is an intermediate editing state. Converting every keystroke through
// Number(...) would destroy that state.
//
// -----------------------------------------------------------------------------

interface CorridorDraft {
  originName: string;
  originLatitude: string;
  originLongitude: string;

  destinationName: string;
  destinationLatitude: string;
  destinationLongitude: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

/**
 * Converts a persisted numeric value into the string representation required
 * by a controlled HTML input.
 */
function numberToInputValue(
  value: number | undefined,
): string {
  return value === undefined
    ? ''
    : String(value);
}

/**
 * Creates the local presentation draft.
 *
 * No domain validation occurs here.
 */
function createDraft(
  initialValue?: Partial<JourneyCorridorFormSubmitValue>,
): CorridorDraft {
  return {
    originName:
      initialValue?.originName ?? '',

    originLatitude:
      numberToInputValue(
        initialValue?.originLatitude,
      ),

    originLongitude:
      numberToInputValue(
        initialValue?.originLongitude,
      ),

    destinationName:
      initialValue?.destinationName ?? '',

    destinationLatitude:
      numberToInputValue(
        initialValue?.destinationLatitude,
      ),

    destinationLongitude:
      numberToInputValue(
        initialValue?.destinationLongitude,
      ),
  };
}

/**
 * Parses an optional numeric presentation value.
 *
 * Empty input stays `undefined`.
 *
 * This deliberately does NOT perform domain validation such as:
 * - latitude range
 * - longitude range
 *
 * Those rules belong to the Journey domain value objects.
 */
function parseOptionalNumber(
  value: string,
): number | undefined {
  const normalized = value.trim();

  if (normalized === '') {
    return undefined;
  }

  const parsed = Number(normalized);

  if (!Number.isFinite(parsed)) {
    return undefined;
  }

  return parsed;
}

/**
 * Converts the current presentation draft into the workflow-local change
 * contract.
 *
 * Empty or invalid numeric fields remain `undefined` instead of becoming
 * `0`.
 */
function toChangeValue(
  draft: CorridorDraft,
): Partial<JourneyCorridorFormSubmitValue> {
  return {
    originName:
      draft.originName,

    originLatitude:
      parseOptionalNumber(
        draft.originLatitude,
      ),

    originLongitude:
      parseOptionalNumber(
        draft.originLongitude,
      ),

    destinationName:
      draft.destinationName,

    destinationLatitude:
      parseOptionalNumber(
        draft.destinationLatitude,
      ),

    destinationLongitude:
      parseOptionalNumber(
        draft.destinationLongitude,
      ),
  };
}

/**
 * Converts the local draft into the complete submission contract.
 *
 * Returns undefined when any required field is incomplete.
 *
 * This is presentation completeness only. Geographic/domain rules remain
 * outside the form.
 */
function toSubmitValue(
  draft: CorridorDraft,
): JourneyCorridorFormSubmitValue | undefined {
  const originName = draft.originName.trim();
  const destinationName =
    draft.destinationName.trim();

  const originLatitude =
    parseOptionalNumber(
      draft.originLatitude,
    );

  const originLongitude =
    parseOptionalNumber(
      draft.originLongitude,
    );

  const destinationLatitude =
    parseOptionalNumber(
      draft.destinationLatitude,
    );

  const destinationLongitude =
    parseOptionalNumber(
      draft.destinationLongitude,
    );

  if (
    originName === '' ||
    destinationName === '' ||
    originLatitude === undefined ||
    originLongitude === undefined ||
    destinationLatitude === undefined ||
    destinationLongitude === undefined
  ) {
    return undefined;
  }

  return {
    originName,
    originLatitude,
    originLongitude,

    destinationName,
    destinationLatitude,
    destinationLongitude,
  };
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyCorridorForm({
  initialValue,
  disabled = false,
  onSubmit,
  onChange,
}: JourneyCorridorFormProps) {
  // ---------------------------------------------------------------------------
  // Local presentation state
  // ---------------------------------------------------------------------------
  //
  // `initialValue` is read once when this component initializes.
  //
  // There is intentionally no effect that mirrors `initialValue` into state.
  //
  // This prevents:
  //
  //   render
  //      ↓
  //   effect
  //      ↓
  //   setDraft(...)
  //      ↓
  //   render
  //
  // and prevents parent rerenders from unexpectedly replacing active edits.
  //
  // ---------------------------------------------------------------------------

  const [draft, setDraft] = useState<CorridorDraft>(
    () => createDraft(initialValue),
  );

  // ---------------------------------------------------------------------------
  // Draft mutation
  // ---------------------------------------------------------------------------
  //
  // This helper performs two explicit actions:
  //
  // 1. Update local React state.
  // 2. Notify the parent workflow of the resulting presentation value.
  //
  // There is no effect watching `draft`.
  //
  // ---------------------------------------------------------------------------

  function updateDraft(
    update: Partial<CorridorDraft>,
  ): void {
    if (disabled) {
      return;
    }

    const nextDraft: CorridorDraft = {
      ...draft,
      ...update,
    };

    setDraft(nextDraft);

    onChange?.(
      toChangeValue(nextDraft),
    );
  }

  // ---------------------------------------------------------------------------
  // Input handlers
  // ---------------------------------------------------------------------------

  function handleOriginNameChange(
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    updateDraft({
      originName:
        event.target.value,
    });
  }

  function handleOriginLatitudeChange(
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    updateDraft({
      originLatitude:
        event.target.value,
    });
  }

  function handleOriginLongitudeChange(
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    updateDraft({
      originLongitude:
        event.target.value,
    });
  }

  function handleDestinationNameChange(
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    updateDraft({
      destinationName:
        event.target.value,
    });
  }

  function handleDestinationLatitudeChange(
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    updateDraft({
      destinationLatitude:
        event.target.value,
    });
  }

  function handleDestinationLongitudeChange(
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    updateDraft({
      destinationLongitude:
        event.target.value,
    });
  }

  // ---------------------------------------------------------------------------
  // Submission
  // ---------------------------------------------------------------------------

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault();

    if (disabled || !onSubmit) {
      return;
    }

    const value = toSubmitValue(draft);

    /**
     * Browser-native `required` validation should normally prevent an empty
     * required input from reaching this point.
     *
     * The explicit conversion guard remains necessary because presentation
     * state can still be incomplete or programmatically supplied.
     *
     * Most importantly, this prevents:
     *
     *   Number('')
     *
     * from becoming:
     *
     *   0
     *
     * and incorrectly crossing the form boundary as a real coordinate.
     */
    if (value === undefined) {
      return;
    }

    void onSubmit(value);
  }

  return (
    <form
      id="journey-corridor-form"
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* ------------------------------------------------------------------- */}
      {/* Origin                                                              */}
      {/* ------------------------------------------------------------------- */}

      <fieldset
        disabled={disabled}
        className="space-y-4"
      >
        <legend className="mb-1 text-sm font-semibold text-[var(--foreground)]">
          Starting point
        </legend>

        <p className="text-sm text-[var(--foreground-muted)]">
          Where will this journey begin?
        </p>

        <Input
          label="Origin"
          value={draft.originName}
          onChange={
            handleOriginNameChange
          }
          placeholder="Nairobi"
          autoComplete="address-level2"
          required
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Latitude"
            type="number"
            step="any"
            value={draft.originLatitude}
            onChange={
              handleOriginLatitudeChange
            }
            placeholder="-1.286389"
            inputMode="decimal"
            required
          />

          <Input
            label="Longitude"
            type="number"
            step="any"
            value={draft.originLongitude}
            onChange={
              handleOriginLongitudeChange
            }
            placeholder="36.817223"
            inputMode="decimal"
            required
          />
        </div>
      </fieldset>

      {/* ------------------------------------------------------------------- */}
      {/* Destination                                                         */}
      {/* ------------------------------------------------------------------- */}

      <fieldset
        disabled={disabled}
        className="space-y-4 border-t border-[var(--border-subtle)] pt-6"
      >
        <legend className="mb-1 text-sm font-semibold text-[var(--foreground)]">
          Destination
        </legend>

        <p className="text-sm text-[var(--foreground-muted)]">
          Where will this journey end?
        </p>

        <Input
          label="Destination"
          value={draft.destinationName}
          onChange={
            handleDestinationNameChange
          }
          placeholder="Mombasa"
          autoComplete="address-level2"
          required
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Latitude"
            type="number"
            step="any"
            value={
              draft.destinationLatitude
            }
            onChange={
              handleDestinationLatitudeChange
            }
            placeholder="-4.043477"
            inputMode="decimal"
            required
          />

          <Input
            label="Longitude"
            type="number"
            step="any"
            value={
              draft.destinationLongitude
            }
            onChange={
              handleDestinationLongitudeChange
            }
            placeholder="39.668206"
            inputMode="decimal"
            required
          />
        </div>
      </fieldset>

      {/* ------------------------------------------------------------------- */}
      {/* Hidden submit                                                       */}
      {/* ------------------------------------------------------------------- */}
      {/*
       * JourneyCreationNavigation owns the visible Continue action.
       *
       * The submit control remains available to native form semantics and
       * allows the workflow container to trigger submission without placing
       * navigation or persistence responsibilities inside this form.
       */}

      <button
        type="submit"
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
      >
        Save corridor
      </button>
    </form>
  );
}