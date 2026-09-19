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
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

export interface PreferenceRowProps {
  readonly label: string;
  readonly value: string;
  readonly description?: string;
}

export function PreferenceRow({
  label,
  value,
  description,
}: PreferenceRowProps): ReactNode {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-border py-4 last:border-b-0">
      <div className="min-w-0">
        <div className="text-sm font-medium">{label}</div>

        {description !== undefined ? (
          <div className="mt-1 text-xs text-muted-foreground">
            {description}
          </div>
        ) : null}
      </div>

      <div className="shrink-0 text-right text-sm text-muted-foreground">
        {value}
      </div>
    </div>
  );
}