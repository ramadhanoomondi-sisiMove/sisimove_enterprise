// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Waypoint Editor
// -----------------------------------------------------------------------------
//
// Controlled editor for a single Journey Demand waypoint.
//
// Architecture:
// - Consumes the authenticated/editor JourneyDemandWaypoint model.
// - Does not fetch data.
// - Does not mutate backend state directly.
// - Does not call an API.
// - Does not own authorization or capability decisions.
// - Does not construct backend domain value objects.
// - Emits a complete updated waypoint through onChange.
// - Parent/container owns persistence, validation orchestration, and errors.
//
// This component is intentionally separate from the read-only waypoint
// presentation component.
//
// The authenticated JourneyDemandWaypoint model is used because the Journey
// Demand editing workflow operates on the richer authenticated representation.
//
// The parent corridor editor owns collection-level orchestration.
// This component owns editing one waypoint.
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
  readonly waypoint: JourneyDemandWaypoint;
  readonly onChange?: (waypoint: JourneyDemandWaypoint) => void;
  readonly onRemove?: () => void;
  readonly disabled?: boolean;
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
    onChange?.({
      ...waypoint,
      type: event.target.value as JourneyDemandWaypointType,
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
        'min-w-0 rounded-[var(--radius-lg)]',
        'border border-[var(--border)] bg-[var(--surface)]',
        'p-4',
        className,
      )}
    >
      <legend className="sr-only">
        Edit waypoint {waypoint.sequence}
      </legend>

      {/* ---------------------------------------------------------------------
          Header
      --------------------------------------------------------------------- */}

      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={cn(
              'flex size-6 shrink-0 items-center justify-center',
              'rounded-[var(--radius-full)]',
              'bg-[var(--background-muted)]',
              'text-xs font-semibold text-[var(--foreground-secondary)]',
            )}
            aria-hidden="true"
          >
            {waypoint.sequence}
          </span>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              Waypoint {waypoint.sequence}
            </p>

            <p className="text-xs text-foreground-muted">
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
              'shrink-0 rounded-[var(--radius-sm)]',
              'px-2.5 py-1.5 text-xs font-medium',
              'text-[var(--danger)]',
              'transition-colors',
              'hover:bg-[var(--danger-soft)]',
              'focus-visible:outline-none',
              'focus-visible:ring-2',
              'focus-visible:ring-[var(--brand)]',
              'disabled:pointer-events-none',
              'disabled:opacity-50',
            )}
          >
            Remove
          </button>
        ) : null}
      </div>

      {/* ---------------------------------------------------------------------
          Editable fields
      --------------------------------------------------------------------- */}

      <div className="mt-4 grid min-w-0 gap-4">
        {/* -------------------------------------------------------------------
            Name
        ------------------------------------------------------------------- */}

        <label className="grid gap-1.5">
          <span className="text-sm font-medium text-foreground">
            Name
          </span>

          <input
            type="text"
            value={waypoint.name}
            onChange={handleNameChange}
            placeholder="e.g. Limuru"
            className={cn(
              'min-h-10 w-full rounded-[var(--radius-md)]',
              'border border-[var(--border)]',
              'bg-[var(--background)]',
              'px-3 text-sm text-foreground',
              'placeholder:text-foreground-subtle',
              'outline-none transition-colors',
              'focus:border-[var(--brand)]',
              'focus:ring-2 focus:ring-[var(--brand-soft)]',
              'disabled:cursor-not-allowed',
              'disabled:bg-[var(--background-muted)]',
            )}
          />
        </label>

        {/* -------------------------------------------------------------------
            Type
        ------------------------------------------------------------------- */}

        <label className="grid gap-1.5">
          <span className="text-sm font-medium text-foreground">
            Type
          </span>

          <select
            value={waypoint.type}
            onChange={handleTypeChange}
            className={cn(
              'min-h-10 w-full rounded-[var(--radius-md)]',
              'border border-[var(--border)]',
              'bg-[var(--background)]',
              'px-3 text-sm text-foreground',
              'outline-none transition-colors',
              'focus:border-[var(--brand)]',
              'focus:ring-2 focus:ring-[var(--brand-soft)]',
              'disabled:cursor-not-allowed',
              'disabled:bg-[var(--background-muted)]',
            )}
          >
            {JOURNEY_DEMAND_WAYPOINT_TYPES.map((type) => (
              <option key={type} value={type}>
                {formatWaypointType(type)}
              </option>
            ))}
          </select>
        </label>

        {/* -------------------------------------------------------------------
            Pickup / drop-off requirements
        ------------------------------------------------------------------- */}

        <div className="grid gap-3 sm:grid-cols-2">
          <label
            className={cn(
              'flex min-w-0 items-start gap-3',
              'rounded-[var(--radius-md)]',
              'border border-[var(--border-subtle)]',
              'bg-[var(--background-subtle)]',
              'p-3',
            )}
          >
            <input
              type="checkbox"
              checked={waypoint.pickupRequired}
              onChange={handlePickupRequiredChange}
              className="mt-0.5 size-4 shrink-0 accent-[var(--brand)]"
            />

            <span className="min-w-0">
              <span className="block text-sm font-medium text-foreground">
                Pickup required
              </span>

              <span className="mt-0.5 block text-xs text-foreground-muted">
                This waypoint requires pickup.
              </span>
            </span>
          </label>

          <label
            className={cn(
              'flex min-w-0 items-start gap-3',
              'rounded-[var(--radius-md)]',
              'border border-[var(--border-subtle)]',
              'bg-[var(--background-subtle)]',
              'p-3',
            )}
          >
            <input
              type="checkbox"
              checked={waypoint.dropoffRequired}
              onChange={handleDropoffRequiredChange}
              className="mt-0.5 size-4 shrink-0 accent-[var(--brand)]"
            />

            <span className="min-w-0">
              <span className="block text-sm font-medium text-foreground">
                Drop-off required
              </span>

              <span className="mt-0.5 block text-xs text-foreground-muted">
                This waypoint requires drop-off.
              </span>
            </span>
          </label>
        </div>
      </div>
    </fieldset>
  );
}

// -----------------------------------------------------------------------------
// Presentation labels
// -----------------------------------------------------------------------------

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
