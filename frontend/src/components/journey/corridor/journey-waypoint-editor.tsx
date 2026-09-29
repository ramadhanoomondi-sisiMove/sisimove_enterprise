// -----------------------------------------------------------------------------
// sisiMove — Journey Waypoint Editor
// -----------------------------------------------------------------------------
//
// Presentation-only editor for one Journey waypoint.
//
// Responsibilities:
// - collect primitive form values;
// - keep coordinates and sequence as strings while editing;
// - expose the complete form state through onSubmit;
// - allow the owning workflow to decide how values are validated, converted,
//   persisted, and navigated.
//
// This component does NOT:
// - call the Journey API;
// - perform domain validation;
// - construct backend/domain value objects;
// - infer pickup/dropoff permissions from waypoint type;
// - convert coordinate or sequence strings into numbers.
//
// The owning application workflow remains responsible for primitive-to-domain
// conversion and backend mutation.
//
// -----------------------------------------------------------------------------

"use client";

import { type FormEvent, useState } from "react";

import { Button, Input, Select } from "@/components/ui";
import { cn } from "@/foundation";

import {
  JOURNEY_WAYPOINT_TYPES,
  type JourneyWaypointType,
} from "@/features/journey/models/journey-waypoint-type";

// =============================================================================
// Types
// =============================================================================

export interface JourneyWaypointFormValues {
  /**
   * Backend JourneyWaypointType value.
   */
  readonly type: JourneyWaypointType;

  /**
   * Kept as a string while editing.
   *
   * The owning workflow converts and validates this value before submitting
   * the backend command.
   */
  readonly sequence: string;

  readonly name: string;

  /**
   * Coordinates remain strings until workflow submission.
   *
   * This prevents Number("") === 0 from accidentally turning an empty field
   * into a valid-looking coordinate.
   */
  readonly latitude: string;
  readonly longitude: string;

  /**
   * These permissions are independent of waypoint type.
   *
   * Do not infer them from `type`.
   */
  readonly pickupAllowed: boolean;
  readonly dropoffAllowed: boolean;
}

export interface JourneyWaypointEditorProps {
  /**
   * Initial values are read once when the editor mounts.
   *
   * This component intentionally does not synchronize its local state from
   * subsequent initialValue changes. The owning workflow controls whether
   * the editor is mounted/remounted for a different waypoint.
   */
  readonly initialValue?: Partial<JourneyWaypointFormValues>;

  /**
   * Presentation-only submission boundary.
   *
   * Persistence and domain validation belong to the parent workflow.
   */
  readonly onSubmit: (values: JourneyWaypointFormValues) => void;

  readonly onCancel?: () => void;

  /**
   * Indicates that the owning workflow is currently performing its mutation.
   */
  readonly submitting?: boolean;

  readonly submitLabel?: string;

  readonly className?: string;
}

// =============================================================================
// Defaults
// =============================================================================

const EMPTY_VALUES: JourneyWaypointFormValues = {
  type: "WAYPOINT",
  sequence: "1",
  name: "",
  latitude: "",
  longitude: "",
  pickupAllowed: false,
  dropoffAllowed: false,
};

// =============================================================================
// Presentation helpers
// =============================================================================

/**
 * Keeps user-facing labels explicit and independent from backend enum names.
 *
 * Backend/API values remain unchanged.
 */
function getWaypointTypeLabel(type: JourneyWaypointType): string {
  switch (type) {
    case "ORIGIN":
      return "Origin";

    case "DESTINATION":
      return "Destination";

    case "PICKUP":
      return "Pickup";

    case "DROPOFF":
      return "Drop-off";

    case "WAYPOINT":
      return "Waypoint";
  }
}

// =============================================================================
// Component
// =============================================================================

export function JourneyWaypointEditor({
  initialValue,
  onSubmit,
  onCancel,
  submitting = false,
  submitLabel = "Add waypoint",
  className,
}: JourneyWaypointEditorProps) {
  const [values, setValues] = useState<JourneyWaypointFormValues>(() => ({
    ...EMPTY_VALUES,
    ...initialValue,
  }));

  /**
   * Update one presentation value without performing domain conversion.
   */
  function updateField<K extends keyof JourneyWaypointFormValues>(
    field: K,
    value: JourneyWaypointFormValues[K],
  ): void {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    onSubmit(values);
  }

  const waypointTypeOptions = JOURNEY_WAYPOINT_TYPES.map((type) => ({
    value: type,
    label: getWaypointTypeLabel(type),
  }));

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "w-full",
        "space-y-5",
        className,
      )}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Waypoint identity                                                  */}
      {/* ------------------------------------------------------------------ */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label="Waypoint type"
          value={values.type}
          onChange={(event) => {
            updateField(
              "type",
              event.target.value as JourneyWaypointType,
            );
          }}
          options={waypointTypeOptions}
          fullWidth
        />

        <Input
          label="Sequence"
          type="text"
          inputMode="numeric"
          value={values.sequence}
          onChange={(event) => {
            updateField("sequence", event.target.value);
          }}
          placeholder="e.g. 1"
          fullWidth
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Location                                                           */}
      {/* ------------------------------------------------------------------ */}

      <Input
        label="Location name"
        value={values.name}
        onChange={(event) => {
          updateField("name", event.target.value);
        }}
        placeholder="e.g. Voi"
        fullWidth
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Latitude"
          type="text"
          inputMode="decimal"
          value={values.latitude}
          onChange={(event) => {
            updateField("latitude", event.target.value);
          }}
          placeholder="e.g. -3.396"
          fullWidth
        />

        <Input
          label="Longitude"
          type="text"
          inputMode="decimal"
          value={values.longitude}
          onChange={(event) => {
            updateField("longitude", event.target.value);
          }}
          placeholder="e.g. 38.556"
          fullWidth
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Passenger permissions                                              */}
      {/* ------------------------------------------------------------------ */}

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-[var(--foreground)]">
          Passenger permissions
        </legend>

        <label
          className={cn(
            "flex",
            "cursor-pointer",
            "items-start",
            "gap-3",
            "rounded-[var(--radius-md)]",
            "border border-[var(--border-subtle)]",
            "bg-[var(--background-subtle)]",
            "p-3",
          )}
        >
          <input
            type="checkbox"
            checked={values.pickupAllowed}
            onChange={(event) => {
              updateField("pickupAllowed", event.target.checked);
            }}
            className="mt-0.5 size-4 accent-[var(--brand)]"
          />

          <span>
            <span className="block text-sm font-medium text-[var(--foreground)]">
              Pickup allowed
            </span>

            <span className="mt-0.5 block text-xs text-[var(--foreground-muted)]">
              Passengers may board at this waypoint.
            </span>
          </span>
        </label>

        <label
          className={cn(
            "flex",
            "cursor-pointer",
            "items-start",
            "gap-3",
            "rounded-[var(--radius-md)]",
            "border border-[var(--border-subtle)]",
            "bg-[var(--background-subtle)]",
            "p-3",
          )}
        >
          <input
            type="checkbox"
            checked={values.dropoffAllowed}
            onChange={(event) => {
              updateField("dropoffAllowed", event.target.checked);
            }}
            className="mt-0.5 size-4 accent-[var(--brand)]"
          />

          <span>
            <span className="block text-sm font-medium text-[var(--foreground)]">
              Drop-off allowed
            </span>

            <span className="mt-0.5 block text-xs text-[var(--foreground-muted)]">
              Passengers may leave the Journey at this waypoint.
            </span>
          </span>
        </label>
      </fieldset>

      {/* ------------------------------------------------------------------ */}
      {/* Actions                                                            */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex flex-wrap items-center justify-end gap-3">
        {onCancel ? (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </Button>
        ) : null}

        <Button
          type="submit"
          variant="primary"
          loading={submitting}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}