// -----------------------------------------------------------------------------
// sisiMove — Journey Waypoint Item
// -----------------------------------------------------------------------------
//
// Single waypoint selection item used by the journey route form.
//
// Architectural rule:
// - Waypoints come from the sisiMove-controlled corridor catalogue.
// - This component does not create or modify waypoint definitions.
// - Selection state is owned by the parent.
//
// Responsibilities:
// - Display one waypoint.
// - Display its sequence.
// - Display pickup/drop-off availability.
// - Reflect selection state.
// - Notify the parent when selection changes.
//
// Non-responsibilities:
// - No API calls.
// - No catalogue fetching.
// - No persistence.
// - No router usage.
// - No business-rule enforcement.
//
// -----------------------------------------------------------------------------

'use client';

import type { ChangeEvent } from 'react';

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------

export interface JourneyWaypointItemProps {
  /**
   * Public identifier of the controlled sisiMove waypoint.
   */
  publicId: string;

  /**
   * Human-readable waypoint name.
   */
  name: string;

  /**
   * Position within the selected corridor.
   */
  sequence: number;

  /**
   * Whether pickup is permitted at this waypoint.
   */
  pickupAllowed: boolean;

  /**
   * Whether drop-off is permitted at this waypoint.
   */
  dropoffAllowed: boolean;

  /**
   * Whether the waypoint is currently selected.
   */
  selected: boolean;

  /**
   * Prevents interaction while the parent is persisting changes.
   */
  disabled?: boolean;

  /**
   * Called when the waypoint selection changes.
   */
  onToggle: (
    waypointPublicId: string,
    selected: boolean,
  ) => void;
}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------

export function JourneyWaypointItem({
  publicId,
  name,
  sequence,
  pickupAllowed,
  dropoffAllowed,
  selected,
  disabled = false,
  onToggle,
}: JourneyWaypointItemProps) {
  // ---------------------------------------------------------------------------
  // Checkbox interaction
  // ---------------------------------------------------------------------------

  function handleChange(
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    if (disabled) {
      return;
    }

    onToggle(publicId, event.target.checked);
  }

  // ---------------------------------------------------------------------------
  // Availability
  // ---------------------------------------------------------------------------

  const availability = [
    pickupAllowed ? 'Pickup' : null,
    dropoffAllowed ? 'Drop-off' : null,
  ]
    .filter(Boolean)
    .join(' · ');

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <label
      className={[
        'flex items-start gap-3 rounded-xl border p-3',
        'transition-colors',
        selected
          ? 'border-[var(--brand)] bg-[var(--brand-soft)]'
          : 'border-[var(--border)] bg-[var(--surface)]',
        disabled
          ? 'cursor-not-allowed opacity-60'
          : 'cursor-pointer',
      ].join(' ')}
    >
      <input
        type="checkbox"
        checked={selected}
        onChange={handleChange}
        disabled={disabled}
        aria-label={`Select ${name}`}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--brand)]"
      />

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="min-w-0 truncate text-sm font-medium text-[var(--foreground)]">
            {name}
          </span>

          <span className="shrink-0 text-xs text-[var(--foreground-subtle)]">
            #{sequence}
          </span>
        </span>

        <span className="mt-1 block text-xs text-[var(--foreground-muted)]">
          {availability || 'Journey waypoint'}
        </span>
      </span>
    </label>
  );
}

