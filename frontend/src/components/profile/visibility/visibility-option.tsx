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
//
// Visual language:
// - SisiMove blue identifies the active selection.
// - White surfaces preserve the clean authenticated-product feel.
// - Subtle borders and restrained shadows provide hierarchy.
// - The entire option remains a comfortable mobile touch target.
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
  readonly onSelect: (
    value: ProfileVisibilityOptionValue,
  ) => void;
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
        'group relative flex min-h-16 cursor-pointer items-start gap-3.5',
        'rounded-[var(--radius-lg)] border p-4',
        'transition-[border-color,background-color,box-shadow]',
        'duration-150',
        'focus-within:outline-none',
        'focus-within:ring-2',
        'focus-within:ring-[var(--brand)]',
        'focus-within:ring-offset-2',
        'focus-within:ring-offset-[var(--surface)]',
        selected
          ? [
              'border-[var(--brand)]',
              'bg-[var(--brand-soft)]',
              'shadow-[var(--shadow-sm)]',
            ].join(' ')
          : [
              'border-[var(--border)]',
              'bg-[var(--surface)]',
              'hover:border-[var(--border-strong)]',
              'hover:bg-[var(--background-subtle)]',
            ].join(' '),
      ].join(' ')}
    >
      {/* ---------------------------------------------------------------------
          Radio
         --------------------------------------------------------------------- */}

      <span
        className={[
          'relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center',
          'rounded-full border transition-colors',
          selected
            ? 'border-[var(--brand)]'
            : [
                'border-[var(--border-strong)]',
                'group-hover:border-[var(--foreground-muted)]',
              ].join(' '),
        ].join(' ')}
        aria-hidden="true"
      >
        {selected && (
          <span
            className="
              h-2.5
              w-2.5
              rounded-full
              bg-[var(--brand)]
            "
          />
        )}
      </span>

      <input
        type="radio"
        name="profile-visibility"
        value={value}
        checked={selected}
        onChange={() => onSelect(value)}
        className="sr-only"
      />

      {/* ---------------------------------------------------------------------
          Content
         --------------------------------------------------------------------- */}

      <span className="min-w-0 flex-1">
        <span
          className={[
            'block text-sm font-semibold leading-5',
            selected
              ? 'text-[var(--foreground)]'
              : 'text-[var(--foreground)]',
          ].join(' ')}
        >
          {label}
        </span>

        <span className="mt-1 block max-w-2xl text-sm leading-5 text-[var(--foreground-secondary)]">
          {description}
        </span>
      </span>

      {/* ---------------------------------------------------------------------
          Selected Indicator
         --------------------------------------------------------------------- */}

      {selected && (
        <span
          className="
            hidden
            shrink-0
            rounded-full
            bg-[var(--brand)]
            px-2.5
            py-1
            text-[0.6875rem]
            font-semibold
            uppercase
            tracking-[0.08em]
            text-[var(--brand-foreground)]
            sm:inline-flex
          "
        >
          Selected
        </span>
      )}
    </label>
  );
}

