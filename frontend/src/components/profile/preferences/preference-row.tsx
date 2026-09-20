// -----------------------------------------------------------------------------
// sisiMove — Travel Preference Row
// -----------------------------------------------------------------------------
//
// Presentation-only row used by the authenticated profile's
// Travel Preferences section.
//
// Responsibilities:
// - Display one preference label and its current value.
// - Keep preference presentation consistent.
//
// Non-responsibilities:
// - Fetching preferences.
// - Editing or persisting preferences.
// - Interpreting domain-specific preference values.
//
// Visual language:
// - Compact profile-settings row.
// - Clear label/value hierarchy.
// - Value presented as a subtle semantic pill.
// - Responsive layout for narrow mobile screens.
// - Uses sisiMove design tokens instead of generic shadcn colors.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface PreferenceRowProps {
  readonly label: string;
  readonly value: string;
  readonly description?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PreferenceRow({
  label,
  value,
  description,
}: PreferenceRowProps): ReactNode {
  return (
    <div
      className={[
        'flex flex-col gap-2',
        'border-b border-[var(--border-subtle)]',
        'py-4 last:border-b-0',
        'sm:flex-row sm:items-center sm:justify-between sm:gap-6',
      ].join(' ')}
    >
      {/* -------------------------------------------------------------------
          Preference Information
          ------------------------------------------------------------------- */}

      <div className="min-w-0">
        <div className="text-sm font-medium text-[var(--foreground)]">
          {label}
        </div>

        {description !== undefined ? (
          <p className="mt-1 text-xs leading-5 text-[var(--foreground-muted)]">
            {description}
          </p>
        ) : null}
      </div>

      {/* -------------------------------------------------------------------
          Current Value
          ------------------------------------------------------------------- */}

      <div className="shrink-0 sm:text-right">
        <span
          className={[
            'inline-flex max-w-full items-center',
            'rounded-[var(--radius-full)]',
            'border border-[var(--border)]',
            'bg-[var(--background-subtle)]',
            'px-2.5 py-1',
            'text-xs font-medium',
            'text-[var(--foreground-secondary)]',
          ].join(' ')}
        >
          {value}
        </span>
      </div>
    </div>
  );
}