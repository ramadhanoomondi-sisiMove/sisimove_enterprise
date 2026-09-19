// -----------------------------------------------------------------------------
// sisiMove — Profile Visibility Option
// -----------------------------------------------------------------------------
//
// Presentation-only option used by the authenticated profile's
// Profile Visibility section.
//
// Responsibilities:
// - Present one visibility choice.
// - Indicate whether the option is currently selected.
// - Notify the parent when the option is selected.
//
// Non-responsibilities:
// - Persisting visibility changes.
// - Fetching the current visibility.
// - Performing authorization or privacy enforcement.
//
// Architecture:
// - Pure presentation component.
// - Does not import the Traveller Profile model because the option only needs
//   a value, label, and description for rendering.
// - Persistence remains the responsibility of ProfileVisibilitySection and
//   the profile visibility mutation boundary.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type ProfileVisibilityOptionValue =
  | 'PUBLIC'
  | 'LIMITED'
  | 'PRIVATE';

export interface VisibilityOptionProps {
  /**
   * Persisted profile visibility value represented by this option.
   */
  readonly value: ProfileVisibilityOptionValue;

  /**
   * Human-readable option name.
   */
  readonly label: string;

  /**
   * Explanation of what selecting this option means.
   */
  readonly description: string;

  /**
   * Whether this option is currently selected.
   */
  readonly selected: boolean;

  /**
   * Notifies the parent that this option has been selected.
   */
  readonly onSelect: (value: ProfileVisibilityOptionValue) => void;
}

// -----------------------------------------------------------------------------
// Visibility Option
// -----------------------------------------------------------------------------

export function VisibilityOption({
  value,
  label,
  description,
  selected,
  onSelect,
}: VisibilityOptionProps): ReactNode {
  return (
    <label
      className={[
        'flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors',
        selected
          ? 'border-foreground bg-muted/40'
          : 'border-border bg-background hover:bg-muted/20',
      ].join(' ')}
    >
      <input
        type="radio"
        name="profile-visibility"
        value={value}
        checked={selected}
        onChange={() => onSelect(value)}
        className="mt-1 h-4 w-4 shrink-0"
      />

      <span className="min-w-0">
        <span className="block text-sm font-medium text-foreground">
          {label}
        </span>

        <span className="mt-1 block text-sm text-muted-foreground">
          {description}
        </span>
      </span>
    </label>
  );
}