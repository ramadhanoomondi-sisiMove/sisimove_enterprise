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
// This component is intentionally separate from the public waypoint
// presentation component (097). The editor uses the richer authenticated
// JourneyDemandWaypoint model because editing may require fields that are not
// exposed by the public marketplace projection.
//
// The parent corridor editor (099) owns the collection-level orchestration.
// This component owns editing one waypoint.
//
// -----------------------------------------------------------------------------

'use client';

import type { ChangeEvent } from 'react';

import type {
  JourneyDemandWaypoint,
  JourneyDemandWaypointType,
} from '@/features/journey-demand/models';
import { cn } from '@/foundation';

export interface JourneyDemandWaypointEditorProps {
  readonly waypoint: JourneyDemandWaypoint;
  readonly onChange?: (waypoint: JourneyDemandWaypoint) => void;
  readonly onRemove?: () => void;
  readonly disabled?: boolean;
  readonly className?: string;
}

export function JourneyDemandWaypointEditor({
  waypoint,
  onChange,
  onRemove,
  disabled = false,
  className,
}: JourneyDemandWaypointEditorProps) {
  const handleNameChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    onChange?.({
      ...waypoint,
      name: event.target.value,
    });
  };

  const handleTypeChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ): void => {
    onChange?.({
      ...waypoint,
      type: event.target.value as JourneyDemandWaypointType,
    });
  };

  const handlePickupRequiredChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    onChange?.({
      ...waypoint,
      pickupRequired: event.target.checked,
    });
  };

  const handleDropoffRequiredChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    onChange?.({
      ...waypoint,
      dropoffRequired: event.target.checked,
    });
  };

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

      <div className="mt-4 grid min-w-0 gap-4">
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
            <option value="ORIGIN">Origin</option>
            <option value="DESTINATION">Destination</option>
            <option value="PICKUP">Pickup</option>
            <option value="DROPOFF">Drop-off</option>
            <option value="WAYPOINT">Waypoint</option>
          </select>
        </label>

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

