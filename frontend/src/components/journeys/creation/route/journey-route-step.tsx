'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Creation
// Route Step
// -----------------------------------------------------------------------------
//
// Presentation composition for the Route step.
//
// The Route step consists of:
//
// 1. Journey corridor
// 2. Optional journey waypoints
//
// Architectural boundary:
//
// This component is intentionally orchestration-free.
//
// It does NOT:
// - Call APIs.
// - Navigate.
// - Persist Journey state.
// - Generate public IDs.
// - Resolve Journey aggregates.
// - Decide whether the Journey can be published.
// - Perform domain validation.
// - Maintain duplicate local state for corridor or waypoints.
//
// The parent route/workflow owns:
// - API orchestration
// - persistence
// - navigation
// - workflow completion
// - domain validation
//
// The child forms own their presentation editing state and expose typed values
// through their callbacks.
//
// -----------------------------------------------------------------------------
//
// Data flow:
//
//   JourneyCreationWorkflow
//          │
//          ├── corridor
//          │      ↓
//          │  JourneyCorridorForm
//          │      ↓
//          │  onCorridorChange / onCorridorSubmit
//          │
//          └── waypoints
//                 ↓
//             JourneyWaypointsForm
//                 ↓
//             onWaypointsChange / onWaypointsSubmit
//
// JourneyRouteStep is only the composition boundary between these pieces.
//
// -----------------------------------------------------------------------------

import {
  JourneyCorridorForm,
  type JourneyCorridorFormSubmitValue,
} from './journey-corridor-form';

import {
  JourneyWaypointsForm,
  type JourneyWaypointsFormSubmitValue,
} from './journey-waypoints-form';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyRouteStepProps {
  /**
   * Existing corridor configuration.
   *
   * Partial values are supported because the Journey may still be incomplete
   * while the creation workflow is in progress.
   *
   * The value is passed to the corridor form as initial presentation state.
   */
  corridor?: Partial<JourneyCorridorFormSubmitValue>;

  /**
   * Existing waypoint configuration.
   *
   * Waypoints are optional during Journey creation.
   *
   * The value is passed to the waypoint form as initial presentation state.
   */
  waypoints?: readonly JourneyWaypointsFormSubmitValue[];

  /**
   * Prevents editing while the workflow is busy or otherwise read-only.
   */
  disabled?: boolean;

  /**
   * Called whenever the corridor's local presentation state changes.
   *
   * The route step does not interpret or transform the value.
   */
  onCorridorChange?: (
    value: Partial<JourneyCorridorFormSubmitValue>,
  ) => void;

  /**
   * Called when the corridor form is explicitly submitted.
   *
   * The route step forwards the callback unchanged.
   */
  onCorridorSubmit?: (
    value: JourneyCorridorFormSubmitValue,
  ) => void | Promise<void>;

  /**
   * Called whenever the waypoint collection's local presentation state
   * changes and can be represented by the complete waypoint contract.
   */
  onWaypointsChange?: (
    value: readonly JourneyWaypointsFormSubmitValue[],
  ) => void;

  /**
   * Called when the waypoint collection is explicitly submitted.
   */
  onWaypointsSubmit?: (
    value: readonly JourneyWaypointsFormSubmitValue[],
  ) => void | Promise<void>;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyRouteStep({
  corridor,
  waypoints,
  disabled = false,
  onCorridorChange,
  onCorridorSubmit,
  onWaypointsChange,
  onWaypointsSubmit,
}: JourneyRouteStepProps) {
  return (
    <div className="space-y-8">
      {/* ------------------------------------------------------------------- */}
      {/* Journey corridor                                                    */}
      {/* ------------------------------------------------------------------- */}

      <section
        aria-labelledby="journey-route-corridor-heading"
        className="space-y-4"
      >
        <div>
          <h2
            id="journey-route-corridor-heading"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Journey route
          </h2>

          <p className="mt-1 text-sm leading-5 text-[var(--foreground-muted)]">
            Set the starting point and destination for this journey.
          </p>
        </div>

        <JourneyCorridorForm
          initialValue={corridor}
          disabled={disabled}
          onChange={onCorridorChange}
          onSubmit={onCorridorSubmit}
        />
      </section>

      {/* ------------------------------------------------------------------- */}
      {/* Optional waypoints                                                  */}
      {/* ------------------------------------------------------------------- */}

      <section
        aria-labelledby="journey-route-waypoints-heading"
        className="border-t border-[var(--border-subtle)] pt-7"
      >
        <div className="mb-4">
          <h2
            id="journey-route-waypoints-heading"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Stops along the way
          </h2>

          <p className="mt-1 text-sm leading-5 text-[var(--foreground-muted)]">
            Add optional pickup, dropoff, or intermediate stops along the
            route.
          </p>
        </div>

        <JourneyWaypointsForm
          initialValue={waypoints}
          disabled={disabled}
          onChange={onWaypointsChange}
          onSubmit={onWaypointsSubmit}
        />
      </section>
    </div>
  );
}