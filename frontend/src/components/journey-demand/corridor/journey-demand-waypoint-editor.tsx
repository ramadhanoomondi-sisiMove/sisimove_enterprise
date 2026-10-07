// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Waypoint Editor
// -----------------------------------------------------------------------------
//
// Controlled editor for one Journey Demand waypoint.
//
// Responsibilities:
// - Render one JourneyDemandWaypoint.
// - Emit a complete updated waypoint through onChange.
// - Optionally expose a parent-owned remove action.
// - Keep all editing local to the supplied waypoint value.
//
// This component does NOT:
// - fetch data;
// - call API endpoints;
// - own mutation hooks;
// - persist changes;
// - authorize changes;
// - determine Journey Demand lifecycle state;
// - construct backend domain value objects;
// - manage the surrounding waypoint collection;
// - reorder or renumber waypoints.
//
// Collection ownership:
//
//     JourneyDemandCorridorEditor
//          │
//          ├── waypoint collection
//          ├── add / update / remove
//          ├── corridor draft
//          └── corridor persistence
//                    │
//                    └── JourneyDemandWaypointEditor
//                              │
//                              └── one waypoint
//
// `sequence` is existing backend data. This component displays it but never
// calculates or changes it.
//
// -----------------------------------------------------------------------------

'use client';

import type { ChangeEvent } from 'react';

import {
  JOURNEY_DEMAND_WAYPOINT_TYPES,
  type JourneyDemandWaypoint,
  type JourneyDemandWaypointType,
} from '@/features/journey-demand/models';
import { cn } from '@/foundation';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDemandWaypointEditorProps {
  /**
   * Controlled waypoint value.
   */
  readonly waypoint: JourneyDemandWaypoint;

  /**
   * Emits the complete updated waypoint.
   *
   * The parent owns the draft and persistence lifecycle.
   */
  readonly onChange?: (waypoint: JourneyDemandWaypoint) => void;

  /**
   * Optional collection-level removal action.
   *
   * The editor does not remove itself from a collection. The parent decides
   * what removal means and updates its waypoint collection accordingly.
   */
  readonly onRemove?: () => void;

  /**
   * Disables all editable controls and the optional remove action.
   */
  readonly disabled?: boolean;

  /**
   * Optional additional class names.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandWaypointEditor({
  waypoint,
  onChange,
  onRemove,
  disabled = false,
  className,
}: JourneyDemandWaypointEditorProps) {
  // ---------------------------------------------------------------------------
  // Name
  // ---------------------------------------------------------------------------

  const handleNameChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    onChange?.({
      ...waypoint,
      name: event.target.value,
    });
  };

  // ---------------------------------------------------------------------------
  // Type
  // ---------------------------------------------------------------------------

  const handleTypeChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ): void => {
    const nextType = parseWaypointType(event.target.value);

    if (nextType === undefined) {
      return;
    }

    onChange?.({
      ...waypoint,
      type: nextType,
    });
  };

  // ---------------------------------------------------------------------------
  // Pickup requirement
  // ---------------------------------------------------------------------------

  const handlePickupRequiredChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    onChange?.({
      ...waypoint,
      pickupRequired: event.target.checked,
    });
  };

  // ---------------------------------------------------------------------------
  // Drop-off requirement
  // ---------------------------------------------------------------------------

  const handleDropoffRequiredChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    onChange?.({
      ...waypoint,
      dropoffRequired: event.target.checked,
    });
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <fieldset
      disabled={disabled}
      className={cn(
        'min-w-0',
        'rounded-[var(--radius-lg)]',
        'border',
        'border-[var(--border)]',
        'bg-[var(--surface)]',
        'p-4',
        className,
      )}
    >
      <legend className="sr-only">
        Edit waypoint {waypoint.sequence}
      </legend>

      {/* -----------------------------------------------------------------------
          Header
      ----------------------------------------------------------------------- */}

      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            aria-hidden="true"
            className={cn(
              'flex size-7 shrink-0 items-center justify-center',
              'rounded-[var(--radius-full)]',
              'bg-[var(--background-muted)]',
              'text-xs font-semibold',
              'text-[var(--foreground-secondary)]',
            )}
          >
            {waypoint.sequence}
          </span>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--foreground)]">
              Waypoint {waypoint.sequence}
            </p>

            <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">
              Update this stop&apos;s details.
            </p>
          </div>
        </div>

        {onRemove ? (
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            className={cn(
              'shrink-0',
              'rounded-[var(--radius-sm)]',
              'px-2.5 py-1.5',
              'text-xs font-medium',
              'text-[var(--danger)]',
              'transition-colors',
              'hover:bg-[var(--danger-soft)]',
              'focus-visible:outline-none',
              'focus-visible:ring-2',
              'focus-visible:ring-[var(--brand)]',
              'focus-visible:ring-offset-1',
              'disabled:pointer-events-none',
              'disabled:opacity-50',
            )}
          >
            Remove
          </button>
        ) : null}
      </div>

      {/* -----------------------------------------------------------------------
          Editable fields
      ----------------------------------------------------------------------- */}

      <div className="mt-5 grid min-w-0 gap-4">
        {/* ---------------------------------------------------------------------
            Name
        --------------------------------------------------------------------- */}

        <label className="grid min-w-0 gap-1.5">
          <span className="text-sm font-medium text-[var(--foreground)]">
            Name
          </span>

          <input
            type="text"
            value={waypoint.name}
            onChange={handleNameChange}
            placeholder="e.g. Limuru"
            autoComplete="off"
            className={cn(
              'min-h-10 w-full',
              'rounded-[var(--radius-md)]',
              'border border-[var(--border)]',
              'bg-[var(--background)]',
              'px-3 py-2',
              'text-sm text-[var(--foreground)]',
              'placeholder:text-[var(--foreground-subtle)]',
              'outline-none transition-colors',
              'focus:border-[var(--brand)]',
              'focus:ring-2',
              'focus:ring-[var(--brand-soft)]',
              'disabled:cursor-not-allowed',
              'disabled:bg-[var(--background-muted)]',
              'disabled:opacity-60',
            )}
          />
        </label>

        {/* ---------------------------------------------------------------------
            Type
        --------------------------------------------------------------------- */}

        <label className="grid min-w-0 gap-1.5">
          <span className="text-sm font-medium text-[var(--foreground)]">
            Type
          </span>

          <select
            value={waypoint.type}
            onChange={handleTypeChange}
            className={cn(
              'min-h-10 w-full',
              'rounded-[var(--radius-md)]',
              'border border-[var(--border)]',
              'bg-[var(--background)]',
              'px-3 py-2',
              'text-sm text-[var(--foreground)]',
              'outline-none transition-colors',
              'focus:border-[var(--brand)]',
              'focus:ring-2',
              'focus:ring-[var(--brand-soft)]',
              'disabled:cursor-not-allowed',
              'disabled:bg-[var(--background-muted)]',
              'disabled:opacity-60',
            )}
          >
            {JOURNEY_DEMAND_WAYPOINT_TYPES.map((type) => (
              <option
                key={type}
                value={type}
              >
                {formatWaypointType(type)}
              </option>
            ))}
          </select>
        </label>

        {/* ---------------------------------------------------------------------
            Operational requirements
        --------------------------------------------------------------------- */}

        <div className="grid gap-3 sm:grid-cols-2">
          {/* -------------------------------------------------------------------
              Pickup
          ------------------------------------------------------------------- */}

          <label
            className={cn(
              'flex min-w-0 items-start gap-3',
              'rounded-[var(--radius-md)]',
              'border border-[var(--border-subtle)]',
              'bg-[var(--background-subtle)]',
              'p-3',
              'transition-colors',
              'has-[:focus-visible]:border-[var(--brand)]',
            )}
          >
            <input
              type="checkbox"
              checked={waypoint.pickupRequired}
              onChange={handlePickupRequiredChange}
              className={cn(
                'mt-0.5 size-4 shrink-0',
                'accent-[var(--brand)]',
              )}
            />

            <span className="min-w-0">
              <span className="block text-sm font-medium text-[var(--foreground)]">
                Pickup required
              </span>

              <span className="mt-0.5 block text-xs leading-5 text-[var(--foreground-muted)]">
                Travellers may be picked up at this stop.
              </span>
            </span>
          </label>

          {/* -------------------------------------------------------------------
              Drop-off
          ------------------------------------------------------------------- */}

          <label
            className={cn(
              'flex min-w-0 items-start gap-3',
              'rounded-[var(--radius-md)]',
              'border border-[var(--border-subtle)]',
              'bg-[var(--background-subtle)]',
              'p-3',
              'transition-colors',
              'has-[:focus-visible]:border-[var(--brand)]',
            )}
          >
            <input
              type="checkbox"
              checked={waypoint.dropoffRequired}
              onChange={handleDropoffRequiredChange}
              className={cn(
                'mt-0.5 size-4 shrink-0',
                'accent-[var(--brand)]',
              )}
            />

            <span className="min-w-0">
              <span className="block text-sm font-medium text-[var(--foreground)]">
                Drop-off required
              </span>

              <span className="mt-0.5 block text-xs leading-5 text-[var(--foreground-muted)]">
                Travellers may be dropped off at this stop.
              </span>
            </span>
          </label>
        </div>
      </div>
    </fieldset>
  );
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function parseWaypointType(
  value: string,
): JourneyDemandWaypointType | undefined {
  return JOURNEY_DEMAND_WAYPOINT_TYPES.find(
    (type) => type === value,
  );
}

function formatWaypointType(
  type: JourneyDemandWaypointType,
): string {
  switch (type) {
    case 'ORIGIN':
      return 'Origin';

    case 'DESTINATION':
      return 'Destination';

    case 'PICKUP':
      return 'Pickup';

    case 'DROPOFF':
      return 'Drop-off';

    case 'WAYPOINT':
      return 'Waypoint';

    default:
      return type;
  }
}