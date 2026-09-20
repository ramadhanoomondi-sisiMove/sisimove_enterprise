// -----------------------------------------------------------------------------
// sisiMove — Travel Activity Stat
// -----------------------------------------------------------------------------
//
// Presentation-only statistic used by the authenticated profile's
// Travel Activity section.
//
// Responsibilities:
// - Display one travel activity metric.
// - Keep formatting consistent across the profile.
// - Remain independent of API/data-fetching concerns.
//
// Non-responsibilities:
// - Fetching activity data.
// - Calculating activity statistics.
// - Mutating travel history.
//
// Architectural note:
// - `value` is already the authoritative activity metric supplied by the
//   parent/feature model.
// - `toLocaleString()` is presentation formatting only; this component does
//   not calculate or interpret the underlying statistic.
//
// Visual language:
// - Compact metric panel.
// - Subtle background and border.
// - Clear value hierarchy.
// - Consistent spacing with TrustStatistics and other profile metrics.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

export interface TravelActivityStatProps {
  readonly label: string;
  readonly value: number;
  readonly description?: string;
}

export function TravelActivityStat({
  label,
  value,
  description,
}: TravelActivityStatProps): ReactNode {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--background-subtle)] px-4 py-3.5">
      <div className="text-xs font-medium text-[var(--foreground-muted)]">
        {label}
      </div>

      <div className="mt-1.5 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
        {value.toLocaleString()}
      </div>

      {description !== undefined ? (
        <div className="mt-1 text-xs leading-5 text-[var(--foreground-muted)]">
          {description}
        </div>
      ) : null}
    </div>
  );
}