'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Creation
// Waypoints Form
// -----------------------------------------------------------------------------
//
// Presentation-only form for configuring optional Journey waypoints.
//
// Responsibilities:
// - Display existing waypoint configuration.
// - Add waypoint configuration.
// - Edit waypoint configuration.
// - Remove waypoint configuration from local form state.
// - Maintain presentation-only ordering.
// - Expose typed values to the parent workflow.
//
// Architectural boundaries:
//
// This component does NOT:
// - Call the API.
// - Generate domain/public IDs.
// - Navigate.
// - Persist Journey state.
// - Know the Journey public ID.
// - Resolve a Journey aggregate.
// - Perform domain validation.
//
// The parent Journey route/workflow owns API orchestration, persistence,
// navigation, and domain validation.
//
// `localId` exists exclusively to give React a stable key while editing the
// local collection. It is never submitted to the backend.
//
// Coordinate inputs intentionally remain strings in presentation state.
// This prevents browser editing states such as an empty input from becoming
// `0` through `Number('')`.
//
// Numeric conversion happens only when the complete form is submitted.
//
// -----------------------------------------------------------------------------
//
// Data boundary:
//
//   React editing state
//        ↓
//   WaypointDraft
//        ↓
//   toSubmitValue()
//        ↓
//   JourneyWaypointsFormSubmitValue
//        ↓
//   parent workflow
//        ↓
//   application command / domain
//
// -----------------------------------------------------------------------------
//
// React state synchronization:
//
// `initialValue` is intentionally treated as an INITIAL value.
//
// We do NOT use:
//
//   useEffect(() => setWaypoints(...), [initialValue])
//
// because that creates a render → effect → setState → render cascade and can
// also unexpectedly overwrite active user edits when the parent recreates the
// `initialValue` array.
//
// Changes made by the user are propagated directly from the mutation handlers.
// This keeps the form state local and makes `onChange` an explicit consequence
// of a user interaction rather than an effect-driven synchronization mechanism.
//
// If a parent needs to load a completely different Journey into this form,
// it should remount the form with a stable React `key` for that Journey.
//
// -----------------------------------------------------------------------------

import {
  useState,
  type FormEvent,
} from 'react';

import {
  Button,
  Input,
  Select,
} from '@/components/ui';

import type {
  JourneyWaypointType,
} from '@/features/journey/models/journey-waypoint-type';

// -----------------------------------------------------------------------------
// Waypoint type options
// -----------------------------------------------------------------------------
//
// `JourneyWaypointType` is a compile-time type.
//
// The creation UI intentionally does not allow ORIGIN or DESTINATION as
// waypoint types because those locations belong to JourneyCorridor.
//
// Supported optional route stops are:
// - WAYPOINT
// - PICKUP
// - DROPOFF
//
// -----------------------------------------------------------------------------

const JOURNEY_WAYPOINT_TYPE_OPTIONS = [
  {
    value: 'WAYPOINT',
    label: 'Waypoint',
  },
  {
    value: 'PICKUP',
    label: 'Pickup',
  },
  {
    value: 'DROPOFF',
    label: 'Dropoff',
  },
] satisfies ReadonlyArray<{
  value: JourneyWaypointType;
  label: string;
}>;

// -----------------------------------------------------------------------------
// Submit value
// -----------------------------------------------------------------------------
//
// This is the complete presentation-to-workflow contract.
//
// Coordinates are numbers here because this contract represents a complete
// waypoint configuration rather than an actively edited input.
//
// -----------------------------------------------------------------------------

export interface JourneyWaypointsFormSubmitValue {
  type: JourneyWaypointType;
  sequence: number;
  name: string;
  latitude: number;
  longitude: number;
  pickupAllowed: boolean;
  dropoffAllowed: boolean;
}

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyWaypointsFormProps {
  /**
   * Existing waypoint configuration.
   *
   * This value is used to initialize local presentation state.
   *
   * It is intentionally NOT synchronized through an effect after mount.
   * This prevents parent rerenders from unexpectedly overwriting active edits.
   */
  initialValue?: readonly JourneyWaypointsFormSubmitValue[];

  /**
   * Prevents editing while the workflow is busy.
   */
  disabled?: boolean;

  /**
   * Called whenever a local user mutation produces a complete waypoint
   * collection that can be represented by the complete submit contract.
   *
   * Incomplete presentation state remains local to this form.
   */
  onChange?: (
    value: readonly JourneyWaypointsFormSubmitValue[],
  ) => void;

  /**
   * Called when the waypoint collection is explicitly submitted.
   */
  onSubmit?: (
    value: readonly JourneyWaypointsFormSubmitValue[],
  ) => void | Promise<void>;
}

// -----------------------------------------------------------------------------
// Internal draft
// -----------------------------------------------------------------------------
//
// Coordinate fields are strings intentionally.
//
// A user must be able to represent normal browser editing states:
//
// - ''
// - '-'
// - '-0.'
// - '-0.7172'
//
// Converting every keystroke through Number(...) would destroy those states.
//
// -----------------------------------------------------------------------------

interface WaypointDraft {
  /**
   * Presentation-only React key.
   *
   * This is NOT a domain identifier and must never cross the API boundary.
   */
  localId: string;

  type: JourneyWaypointType;
  sequence: number;
  name: string;

  /**
   * Presentation values remain strings until submission.
   */
  latitude: string;
  longitude: string;

  pickupAllowed: boolean;
  dropoffAllowed: boolean;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function createLocalId(): string {
  return crypto.randomUUID();
}

/**
 * Creates a new empty waypoint draft.
 *
 * Coordinates intentionally start as empty strings rather than `0`.
 *
 * `0` is a valid geographic coordinate, so using it as the empty state would
 * make an unconfigured field indistinguishable from a legitimate coordinate.
 */
function createEmptyWaypoint(
  sequence: number,
): WaypointDraft {
  return {
    localId: createLocalId(),
    type: 'WAYPOINT',
    sequence,
    name: '',
    latitude: '',
    longitude: '',
    pickupAllowed: true,
    dropoffAllowed: true,
  };
}

/**
 * Converts a complete workflow value into presentation editing state.
 */
function toDraft(
  waypoint: JourneyWaypointsFormSubmitValue,
): WaypointDraft {
  return {
    localId: createLocalId(),
    type: waypoint.type,
    sequence: waypoint.sequence,
    name: waypoint.name,
    latitude: String(waypoint.latitude),
    longitude: String(waypoint.longitude),
    pickupAllowed: waypoint.pickupAllowed,
    dropoffAllowed: waypoint.dropoffAllowed,
  };
}

/**
 * Parses a coordinate from presentation state.
 *
 * Empty values remain undefined rather than becoming zero.
 *
 * This helper does not perform geographic domain validation such as:
 *
 * - latitude range
 * - longitude range
 *
 * Those rules belong to the Journey domain value objects.
 */
function parseCoordinate(
  value: string,
): number | undefined {
  const trimmed = value.trim();

  if (trimmed === '') {
    return undefined;
  }

  const parsed = Number(trimmed);

  if (!Number.isFinite(parsed)) {
    return undefined;
  }

  return parsed;
}

/**
 * Converts local presentation state into the public form submission contract.
 *
 * The presentation-only `localId` deliberately stops at this boundary.
 *
 * `undefined` means the waypoint is not yet complete enough to construct the
 * complete submission contract.
 */
function toSubmitValue(
  waypoint: WaypointDraft,
): JourneyWaypointsFormSubmitValue | undefined {
  const latitude = parseCoordinate(waypoint.latitude);
  const longitude = parseCoordinate(waypoint.longitude);

  if (
    waypoint.name.trim() === '' ||
    latitude === undefined ||
    longitude === undefined
  ) {
    return undefined;
  }

  return {
    type: waypoint.type,
    sequence: waypoint.sequence,
    name: waypoint.name.trim(),
    latitude,
    longitude,
    pickupAllowed: waypoint.pickupAllowed,
    dropoffAllowed: waypoint.dropoffAllowed,
  };
}

/**
 * Converts all waypoint drafts when the complete collection is valid enough
 * to cross the presentation submission boundary.
 *
 * Returns undefined when at least one waypoint is incomplete.
 */
function toCompleteSubmitValue(
  waypoints: readonly WaypointDraft[],
): JourneyWaypointsFormSubmitValue[] | undefined {
  const values = waypoints.map(toSubmitValue);

  if (values.some((value) => value === undefined)) {
    return undefined;
  }

  return values as JourneyWaypointsFormSubmitValue[];
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyWaypointsForm({
  initialValue = [],
  disabled = false,
  onChange,
  onSubmit,
}: JourneyWaypointsFormProps) {
  // ---------------------------------------------------------------------------
  // Local presentation state
  // ---------------------------------------------------------------------------
  //
  // `initialValue` is read exactly when this component initializes.
  //
  // There is intentionally no useEffect that mirrors `initialValue` into
  // state. Doing so would cause unnecessary cascading renders and could
  // overwrite active user edits whenever the parent recreates the array.
  //
  // ---------------------------------------------------------------------------

  const [waypoints, setWaypoints] = useState<WaypointDraft[]>(() =>
    initialValue.map(toDraft),
  );

  // ---------------------------------------------------------------------------
  // Notify parent
  // ---------------------------------------------------------------------------
  //
  // `onChange` only receives complete values because its contract explicitly
  // requires numeric coordinates and a non-empty location name.
  //
  // An incomplete waypoint therefore remains entirely inside this component's
  // presentation state until the user completes it.
  //
  // ---------------------------------------------------------------------------

  function notifyChange(
    nextWaypoints: readonly WaypointDraft[],
  ): void {
    const value = toCompleteSubmitValue(nextWaypoints);

    if (value === undefined) {
      return;
    }

    onChange?.(value);
  }

  // ---------------------------------------------------------------------------
  // Add
  // ---------------------------------------------------------------------------

  function handleAddWaypoint(): void {
    if (disabled) {
      return;
    }

    setWaypoints((current) => {
      const next = [
        ...current,
        createEmptyWaypoint(current.length + 1),
      ];

      /**
       * The newly added waypoint is intentionally incomplete.
       *
       * Therefore `notifyChange` will not call the parent until the new
       * waypoint has enough information to satisfy the complete submit
       * contract.
       */
      notifyChange(next);

      return next;
    });
  }

  // ---------------------------------------------------------------------------
  // Remove
  // ---------------------------------------------------------------------------

  function handleRemoveWaypoint(
    localId: string,
  ): void {
    if (disabled) {
      return;
    }

    setWaypoints((current) => {
      const next = current
        .filter(
          (waypoint) =>
            waypoint.localId !== localId,
        )
        .map((waypoint, index) => ({
          ...waypoint,
          sequence: index + 1,
        }));

      notifyChange(next);

      return next;
    });
  }

  // ---------------------------------------------------------------------------
  // Update
  // ---------------------------------------------------------------------------

  function updateWaypoint(
    localId: string,
    update: Partial<WaypointDraft>,
  ): void {
    if (disabled) {
      return;
    }

    setWaypoints((current) => {
      const next = current.map((waypoint) =>
        waypoint.localId === localId
          ? {
              ...waypoint,
              ...update,
            }
          : waypoint,
      );

      notifyChange(next);

      return next;
    });
  }

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault();

    if (disabled || !onSubmit) {
      return;
    }

    const value = toCompleteSubmitValue(waypoints);

    /**
     * Browser-native `required` validation should normally prevent reaching
     * this point for empty inputs.
     *
     * This additional conversion guard protects the component from malformed
     * or programmatically supplied state without introducing domain
     * validation into the presentation layer.
     */
    if (value === undefined) {
      return;
    }

    void onSubmit(value);
  }

  return (
    <form
      id="journey-waypoints-form"
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {/* ------------------------------------------------------------------- */}
      {/* Empty state                                                         */}
      {/* ------------------------------------------------------------------- */}

      {waypoints.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] bg-[var(--background-subtle)] px-5 py-6 text-center">
          <p className="text-sm font-medium text-[var(--foreground)]">
            No stops added
          </p>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Add optional stops along the route so travellers know where the
            journey passes.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {waypoints.map((waypoint, index) => (
            <WaypointCard
              key={waypoint.localId}
              waypoint={waypoint}
              index={index}
              disabled={disabled}
              onChange={(update) =>
                updateWaypoint(
                  waypoint.localId,
                  update,
                )
              }
              onRemove={() =>
                handleRemoveWaypoint(
                  waypoint.localId,
                )
              }
            />
          ))}
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Add waypoint                                                        */}
      {/* ------------------------------------------------------------------- */}

      <div className="flex justify-start">
        <Button
          type="button"
          variant="outline"
          size="md"
          disabled={disabled}
          onClick={handleAddWaypoint}
        >
          + Add stop
        </Button>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Hidden submit                                                       */}
      {/* ------------------------------------------------------------------- */}
      {/*
       * JourneyCreationNavigation owns the visible Continue action.
       *
       * This submit control preserves native form semantics and allows a
       * workflow container to submit this form without introducing navigation
       * or API concerns into the presentation component.
       */}

      <button
        type="submit"
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
      >
        Save waypoints
      </button>
    </form>
  );
}

// -----------------------------------------------------------------------------
// Waypoint Card
// -----------------------------------------------------------------------------

interface WaypointCardProps {
  waypoint: WaypointDraft;
  index: number;
  disabled: boolean;
  onChange: (
    update: Partial<WaypointDraft>,
  ) => void;
  onRemove: () => void;
}

function WaypointCard({
  waypoint,
  index,
  disabled,
  onChange,
  onRemove,
}: WaypointCardProps) {
  return (
    <article className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
      {/* ------------------------------------------------------------------- */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------- */}

      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--foreground)]">
            Stop {index + 1}
          </p>

          <p className="mt-1 text-xs text-[var(--foreground-muted)]">
            Add a location passengers may use during this journey.
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={disabled}
          onClick={onRemove}
        >
          Remove
        </Button>
      </div>

      <div className="space-y-4">
        {/* ----------------------------------------------------------------- */}
        {/* Type                                                              */}
        {/* ----------------------------------------------------------------- */}

        <Select
          label="Stop type"
          value={waypoint.type}
          onChange={(event) => {
            const value = event.target.value;

            const option =
              JOURNEY_WAYPOINT_TYPE_OPTIONS.find(
                (item) => item.value === value,
              );

            if (option === undefined) {
              return;
            }

            onChange({
              type: option.value,
            });
          }}
          disabled={disabled}
        >
          {JOURNEY_WAYPOINT_TYPE_OPTIONS.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </Select>

        {/* ----------------------------------------------------------------- */}
        {/* Location                                                          */}
        {/* ----------------------------------------------------------------- */}

        <Input
          label="Location"
          value={waypoint.name}
          onChange={(event) =>
            onChange({
              name: event.target.value,
            })
          }
          placeholder="Naivasha"
          disabled={disabled}
          required
        />

        {/* ----------------------------------------------------------------- */}
        {/* Coordinates                                                       */}
        {/* ----------------------------------------------------------------- */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Latitude"
            type="number"
            step="any"
            value={waypoint.latitude}
            onChange={(event) =>
              onChange({
                latitude: event.target.value,
              })
            }
            placeholder="-0.7172"
            inputMode="decimal"
            disabled={disabled}
            required
          />

          <Input
            label="Longitude"
            type="number"
            step="any"
            value={waypoint.longitude}
            onChange={(event) =>
              onChange({
                longitude: event.target.value,
              })
            }
            placeholder="36.4310"
            inputMode="decimal"
            disabled={disabled}
            required
          />
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Passenger permissions                                             */}
        {/* ----------------------------------------------------------------- */}

        <fieldset className="border-t border-[var(--border-subtle)] pt-4">
          <legend className="text-sm font-medium text-[var(--foreground)]">
            Passenger access
          </legend>

          <div className="mt-3 space-y-3">
            {/* ------------------------------------------------------------- */}
            {/* Pickup                                                         */}
            {/* ------------------------------------------------------------- */}

            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={waypoint.pickupAllowed}
                disabled={disabled}
                onChange={(event) =>
                  onChange({
                    pickupAllowed:
                      event.target.checked,
                  })
                }
                className="mt-0.5 h-4 w-4 rounded border-[var(--border-strong)] text-[var(--brand)] focus:ring-[var(--brand)]"
              />

              <span>
                <span className="block text-sm font-medium text-[var(--foreground)]">
                  Pickup allowed
                </span>

                <span className="block text-xs leading-5 text-[var(--foreground-muted)]">
                  Passengers can join the journey from this stop.
                </span>
              </span>
            </label>

            {/* ------------------------------------------------------------- */}
            {/* Dropoff                                                        */}
            {/* ------------------------------------------------------------- */}

            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={waypoint.dropoffAllowed}
                disabled={disabled}
                onChange={(event) =>
                  onChange({
                    dropoffAllowed:
                      event.target.checked,
                  })
                }
                className="mt-0.5 h-4 w-4 rounded border-[var(--border-strong)] text-[var(--brand)] focus:ring-[var(--brand)]"
              />

              <span>
                <span className="block text-sm font-medium text-[var(--foreground)]">
                  Dropoff allowed
                </span>

                <span className="block text-xs leading-5 text-[var(--foreground-muted)]">
                  Passengers can end their journey at this stop.
                </span>
              </span>
            </label>
          </div>
        </fieldset>
      </div>
    </article>
  );
}