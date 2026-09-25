'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Vehicle Form
// -----------------------------------------------------------------------------
//
// Presentation-only form for collecting Journey Vehicle configuration.
//
// Responsibilities:
// - Present vehicle make.
// - Present vehicle model.
// - Present optional manufacturing/model year.
// - Present optional exterior color.
// - Present optional registration.
// - Maintain local editing state.
// - Emit Vehicle changes to the parent workflow.
// - Emit the complete Vehicle configuration on submit.
//
// This component does NOT:
// - Call the Journey API.
// - Persist Vehicle state.
// - Know journeyPublicId.
// - Navigate.
// - Decide Journey business rules.
// - Upload Assets.
// - Resolve Asset ownership.
//
// The Journey creation page owns persistence and navigation.
//
// Backend request:
//
//   POST /api/v1/journeys/:journeyPublicId/vehicle
//
//   {
//     make: string;
//     model: string;
//     year?: number;
//     color?: string;
//     registration?: string;
//     assetPublicId?: string;
//   }
//
// `assetPublicId` is an optional reference to an existing Asset owned by the
// Assets domain. It is intentionally not exposed as a free-text input.
// Asset selection belongs to the surrounding workflow.
//
// IMPORTANT:
//
// Journey Vehicle is configured through the Journey aggregate. The frontend
// does not treat the Vehicle as an independently selected Vehicle resource.
//
// -----------------------------------------------------------------------------

import type { FormEvent } from 'react';
import { useState } from 'react';

import { Input } from '@/components/ui';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyVehicleFormInitialValue {
  /**
   * Existing Journey Vehicle manufacturer.
   */
  make?: string;

  /**
   * Existing Journey Vehicle model.
   */
  model?: string;

  /**
   * Existing Vehicle manufacturing/model year.
   */
  year?: number | null;

  /**
   * Existing Vehicle exterior color.
   */
  color?: string | null;

  /**
   * Existing Vehicle registration identifier.
   */
  registration?: string | null;

  /**
   * Existing Asset reference associated with the Vehicle.
   *
   * This is preserved by the form but is not directly editable as text.
   */
  assetPublicId?: string | null;
}

/**
 * Complete Vehicle configuration emitted by the form.
 *
 * Optional values are omitted when they are not provided.
 */
export interface JourneyVehicleFormSubmitValue {
  /**
   * Vehicle manufacturer.
   */
  make: string;

  /**
   * Vehicle model.
   */
  model: string;

  /**
   * Optional manufacturing/model year.
   */
  year?: number;

  /**
   * Optional exterior color.
   */
  color?: string;

  /**
   * Optional registration identifier.
   */
  registration?: string;

  /**
   * Optional public identifier of an existing Asset.
   */
  assetPublicId?: string;
}

export interface JourneyVehicleFormProps {
  /**
   * Initial Vehicle configuration supplied by the parent workflow.
   *
   * This is an initial snapshot only.
   *
   * If the parent needs to display another Journey Vehicle, remount the form
   * with a stable React key.
   */
  initialValue?: JourneyVehicleFormInitialValue;

  /**
   * Prevents editing and submission.
   */
  disabled?: boolean;

  /**
   * Emits the current Vehicle draft while the user edits.
   *
   * Only changed fields need to be supplied by the form.
   */
  onChange?: (
    value: Partial<JourneyVehicleFormSubmitValue>,
  ) => void;

  /**
   * Emits the complete normalized Vehicle configuration.
   *
   * Persistence belongs to the parent workflow.
   */
  onSubmit?: (
    value: JourneyVehicleFormSubmitValue,
  ) => void | Promise<void>;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyVehicleForm({
  initialValue,
  disabled = false,
  onChange,
  onSubmit,
}: JourneyVehicleFormProps) {
  // ---------------------------------------------------------------------------
  // Local presentation state
  // ---------------------------------------------------------------------------

  const [make, setMake] = useState(
    () =>
      initialValue?.make ?? '',
  );

  const [model, setModel] = useState(
    () =>
      initialValue?.model ?? '',
  );

  const [year, setYear] = useState(
    () =>
      initialValue?.year !== undefined &&
      initialValue?.year !== null
        ? String(initialValue.year)
        : '',
  );

  const [color, setColor] = useState(
    () =>
      initialValue?.color ?? '',
  );

  const [registration, setRegistration] =
    useState(
      () =>
        initialValue?.registration ?? '',
    );

  /**
   * `assetPublicId` is deliberately not represented by an editable text
   * control.
   *
   * It is an existing Asset reference and should be supplied by the
   * surrounding Asset-selection workflow.
   *
   * The persisted value is retained so submitting an unchanged Vehicle does
   * not accidentally detach its existing Asset reference.
   */
  const [assetPublicId] = useState(
    () =>
      initialValue?.assetPublicId ?? '',
  );

  // ---------------------------------------------------------------------------
  // Make
  // ---------------------------------------------------------------------------

  function handleMakeChange(
    value: string,
  ) {
    setMake(value);

    onChange?.({
      make: value,
    });
  }

  // ---------------------------------------------------------------------------
  // Model
  // ---------------------------------------------------------------------------

  function handleModelChange(
    value: string,
  ) {
    setModel(value);

    onChange?.({
      model: value,
    });
  }

  // ---------------------------------------------------------------------------
  // Year
  // ---------------------------------------------------------------------------

  function handleYearChange(
    value: string,
  ) {
    setYear(value);

    if (!value.trim()) {
      onChange?.({
        year: undefined,
      });

      return;
    }

    const parsed = Number(value);

    onChange?.({
      year:
        Number.isFinite(parsed)
          ? parsed
          : undefined,
    });
  }

  // ---------------------------------------------------------------------------
  // Color
  // ---------------------------------------------------------------------------

  function handleColorChange(
    value: string,
  ) {
    setColor(value);

    onChange?.({
      color: value,
    });
  }

  // ---------------------------------------------------------------------------
  // Registration
  // ---------------------------------------------------------------------------

  function handleRegistrationChange(
    value: string,
  ) {
    setRegistration(value);

    onChange?.({
      registration: value,
    });
  }

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (disabled) {
      return;
    }

    const trimmedMake =
      make.trim();

    const trimmedModel =
      model.trim();

    const trimmedYear =
      year.trim();

    const trimmedColor =
      color.trim();

    const trimmedRegistration =
      registration.trim();

    /**
     * Make and model are required Vehicle configuration.
     *
     * Native browser validation normally handles this case, but the explicit
     * guard also protects programmatic submission through requestSubmit().
     */
    if (
      !trimmedMake ||
      !trimmedModel
    ) {
      return;
    }

    // -------------------------------------------------------------------------
    // Year
    // -------------------------------------------------------------------------

    const parsedYear =
      trimmedYear
        ? Number(trimmedYear)
        : undefined;

    /**
     * A non-empty year must resolve to a finite number.
     *
     * The backend remains authoritative for the actual acceptable year range.
     */
    if (
      trimmedYear &&
      (
        parsedYear === undefined ||
        !Number.isFinite(parsedYear)
      )
    ) {
      return;
    }

    // -------------------------------------------------------------------------
    // Canonical submit value
    // -------------------------------------------------------------------------

    const value: JourneyVehicleFormSubmitValue = {
      make: trimmedMake,
      model: trimmedModel,

      ...(parsedYear !== undefined
        ? {
            year: parsedYear,
          }
        : {}),

      ...(trimmedColor
        ? {
            color: trimmedColor,
          }
        : {}),

      ...(trimmedRegistration
        ? {
            registration:
              trimmedRegistration,
          }
        : {}),

      ...(assetPublicId.trim()
        ? {
            assetPublicId:
              assetPublicId.trim(),
          }
        : {}),
    };

    await onSubmit?.(value);
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <form
      id="journey-vehicle-form"
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* -----------------------------------------------------------------------
          Make / Model
          ----------------------------------------------------------------------- */}

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="journey-vehicle-make"
          label="Make"
          helperText="The vehicle manufacturer."
          type="text"
          name="make"
          value={make}
          onChange={(event) =>
            handleMakeChange(
              event.target.value,
            )
          }
          disabled={disabled}
          required
          placeholder="Toyota"
          autoComplete="off"
        />

        <Input
          id="journey-vehicle-model"
          label="Model"
          helperText="The vehicle model."
          type="text"
          name="model"
          value={model}
          onChange={(event) =>
            handleModelChange(
              event.target.value,
            )
          }
          disabled={disabled}
          required
          placeholder="Noah"
          autoComplete="off"
        />
      </div>

      {/* -----------------------------------------------------------------------
          Year / Color
          ----------------------------------------------------------------------- */}

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="journey-vehicle-year"
          label="Year"
          helperText="Optional manufacturing/model year."
          type="number"
          name="year"
          value={year}
          onChange={(event) =>
            handleYearChange(
              event.target.value,
            )
          }
          disabled={disabled}
          min={1900}
          max={
            new Date().getFullYear() + 1
          }
          inputMode="numeric"
          placeholder="2022"
        />

        <Input
          id="journey-vehicle-color"
          label="Color"
          helperText="Optional exterior color."
          type="text"
          name="color"
          value={color}
          onChange={(event) =>
            handleColorChange(
              event.target.value,
            )
          }
          disabled={disabled}
          placeholder="Silver"
          autoComplete="off"
        />
      </div>

      {/* -----------------------------------------------------------------------
          Registration
          ----------------------------------------------------------------------- */}

      <Input
        id="journey-vehicle-registration"
        label="Registration"
        helperText="Optional. It may be hidden from public Journey views."
        type="text"
        name="registration"
        value={registration}
        onChange={(event) =>
          handleRegistrationChange(
            event.target.value,
          )
        }
        disabled={disabled}
        placeholder="KDA 123A"
        autoComplete="off"
      />

      {/* -----------------------------------------------------------------------
          Existing Asset
          ----------------------------------------------------------------------- */}
      {/*
       * Asset selection is deliberately outside this form's editable fields.
       *
       * The surrounding Journey workflow can provide an Asset selector and
       * ultimately supply `assetPublicId` as part of the initial configuration.
       *
       * We do not expose the opaque public identifier itself to the traveller.
       */}

      {assetPublicId ? (
        <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background-secondary)] p-4">
          <p className="text-sm font-medium text-[var(--foreground)]">
            Vehicle asset linked
          </p>

          <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
            An existing vehicle Asset is associated
            with this Journey.
          </p>
        </div>
      ) : null}

      {/* -----------------------------------------------------------------------
          Hidden native submit control
          ----------------------------------------------------------------------- */}

      <button
        type="submit"
        disabled={
          disabled ||
          !make.trim() ||
          !model.trim()
        }
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      >
        Save vehicle
      </button>
    </form>
  );
}