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
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

export interface TravelActivityStatProps {
  label: string;
  value: number;
  description?: string;
}

export function TravelActivityStat({
  label,
  value,
  description,
}: TravelActivityStatProps): ReactNode {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <div className="text-sm text-muted-foreground">{label}</div>

      <div className="mt-1 text-2xl font-semibold tracking-tight">
        {value.toLocaleString()}
      </div>

      {description !== undefined ? (
        <div className="mt-1 text-xs text-muted-foreground">
          {description}
        </div>
      ) : null}
    </div>
  );
}