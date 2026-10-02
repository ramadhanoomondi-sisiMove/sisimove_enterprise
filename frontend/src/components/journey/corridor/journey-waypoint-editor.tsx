// -----------------------------------------------------------------------------
// sisiMove — Journey Waypoint Editor
// -----------------------------------------------------------------------------
//
// Presentation-only editor for one Journey waypoint.
//
// State ownership:
//
//   Owning Journey workflow
//        │
//        ├── location
//        └── locationQuery
//                 │
//                 ▼
//        JourneyWaypointEditor
//
// This component does NOT keep local location state.
//
// The owning workflow remains responsible for:
// - resolved location state;
// - location query state;
// - supported-location filtering;
// - location selection;
// - domain validation;
// - primitive-to-domain conversion;
// - waypoint persistence;
// - workflow navigation.
//
// User-facing requirement:
// - Location
//
// The user never enters:
// - latitude;
// - longitude;
// - coordinates;
// - geocoding/provider details.
//
// LocationSelector owns:
// - location input;
// - location suggestions;
// - location selection.
//
// This component remains responsible for:
// - waypoint type;
// - sequence;
// - passenger permissions;
// - exposing the complete presentation form state.
//
// It does NOT:
// - call the Journey API;
// - perform domain validation;
// - construct backend/domain value objects;
// - infer pickup/dropoff permissions from waypoint type;
// - resolve or serialize geographic coordinates.
//
// -----------------------------------------------------------------------------
//
// Physical-world model:
//
// The waypoint represents a physical place on the Journey:
//
//   Location
//
// The editor deals with that place as a ResolvedLocation. It does not expose
// the geographic representation of the place as separate form fields.
//
// Coordinates and other location-resolution details remain behind the
// presentation/application boundary.
//
// -----------------------------------------------------------------------------

"use client";

import {
  type FormEvent,
  useMemo,
  useState,
} from "react";

import {
  Button,
  Input,
  Select,
} from "@/components/ui";

import {
  LocationSelector,
  type ResolvedLocation,
} from "@/foundation/location";

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

  /**
   * Selected physical waypoint location.
   *
   * Geographic details remain encapsulated by ResolvedLocation rather than
   * being exposed as separate presentation fields.
   */
  readonly location: ResolvedLocation;

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
   * Currently selected waypoint location.
   *
   * Controlled by the owning Journey workflow.
   */
  readonly location: ResolvedLocation | null;

  /**
   * Current location search text.
   *
   * Controlled by the owning Journey workflow.
   */
  readonly locationQuery: string;

  /**
   * SisiMove-supported locations available to the waypoint selector.
   */
  readonly locationSuggestions: readonly ResolvedLocation[];

  readonly locationError?: string | null;

  /**
   * Initial non-location waypoint values.
   *
   * These are read once when the editor mounts.
   */
  readonly initialValue?: Partial<
    Omit<JourneyWaypointFormValues, "location">
  >;

  /**
   * Presentation-only submission boundary.
   *
   * Persistence and domain validation belong to the parent workflow.
   */
  readonly onSubmit: (
    values: JourneyWaypointFormValues,
  ) => void;

  readonly onLocationQueryChange: (
    query: string,
  ) => void;

  readonly onLocationSelect: (
    location: ResolvedLocation,
  ) => void;

  readonly onCancel?: () => void;

  /**
   * Indicates that the owning workflow is currently performing its mutation.
   */
  readonly submitting?: boolean;

  readonly submitLabel?: string;

  readonly disabled?: boolean;

  readonly className?: string;
}

// =============================================================================
// Defaults
// =============================================================================

const EMPTY_VALUES: Omit<
  JourneyWaypointFormValues,
  "location"
> = {
  type: "WAYPOINT",
  sequence: "1",
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
function getWaypointTypeLabel(
  type: JourneyWaypointType,
): string {
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

/**
 * Keeps the Select boundary type-safe without asserting the DOM value.
 *
 * The browser always provides a string, so only values present in the
 * supported Journey waypoint type catalogue are accepted.
 */
function parseWaypointType(
  value: string,
): JourneyWaypointType {
  const matchedType = JOURNEY_WAYPOINT_TYPES.find(
    (type) => type === value,
  );

  return matchedType ?? "WAYPOINT";
}

// =============================================================================
// Component
// =============================================================================

export function JourneyWaypointEditor({
  location,
  locationQuery,
  locationSuggestions,
  locationError = null,
  initialValue,
  onSubmit,
  onLocationQueryChange,
  onLocationSelect,
  onCancel,
  submitting = false,
  submitLabel = "Add waypoint",
  disabled = false,
  className,
}: JourneyWaypointEditorProps) {
  const [values, setValues] =
    useState<Omit<
      JourneyWaypointFormValues,
      "location"
    >>(() => ({
      ...EMPTY_VALUES,
      ...initialValue,
    }));

  const waypointTypeOptions = useMemo(
    () =>
      JOURNEY_WAYPOINT_TYPES.map((type) => ({
        value: type,
        label: getWaypointTypeLabel(type),
      })),
    [],
  );

  // ===========================================================================
  // Field updates
  // ===========================================================================

  /**
   * Update one non-location presentation value without performing domain
   * conversion.
   */
  function updateField<
    K extends keyof Omit<
      JourneyWaypointFormValues,
      "location"
    >
  >(
    field: K,
    value: Omit<
      JourneyWaypointFormValues,
      "location"
    >[K],
  ): void {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  }

  // ===========================================================================
  // Submit
  // ===========================================================================

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault();

    /**
     * A waypoint location is selected through LocationSelector.
     *
     * The selected physical location is passed through unchanged. The owning
     * workflow remains responsible for validation, conversion, and persistence.
     */
    if (location === null) {
      return;
    }

    onSubmit({
      ...values,
      location,
    });
  }

  // ===========================================================================
  // Render
  // ===========================================================================

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
              parseWaypointType(event.target.value),
            );
          }}
          options={waypointTypeOptions}
          disabled={disabled || submitting}
          fullWidth
        />

        <Input
          label="Sequence"
          type="text"
          inputMode="numeric"
          value={values.sequence}
          onChange={(event) => {
            updateField(
              "sequence",
              event.target.value,
            );
          }}
          placeholder="e.g. 1"
          disabled={disabled || submitting}
          fullWidth
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Location                                                           */}
      {/* ------------------------------------------------------------------ */}

      <LocationSelector
        label="Location"
        placeholder="Select waypoint location"
        value={location}
        query={locationQuery}
        suggestions={locationSuggestions}
        disabled={disabled || submitting}
        error={locationError}
        onQueryChange={onLocationQueryChange}
        onSelect={onLocationSelect}
      />

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
              updateField(
                "pickupAllowed",
                event.target.checked,
              );
            }}
            disabled={disabled || submitting}
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
              updateField(
                "dropoffAllowed",
                event.target.checked,
              );
            }}
            disabled={disabled || submitting}
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

      <div
        className={cn(
          "flex",
          "flex-wrap",
          "items-center",
          "justify-end",
          "gap-3",
        )}
      >
        {onCancel !== undefined ? (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={disabled || submitting}
          >
            Cancel
          </Button>
        ) : null}

        <Button
          type="submit"
          variant="primary"
          loading={submitting}
          disabled={
            disabled ||
            submitting ||
            location === null
          }
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

export default JourneyWaypointEditor;
