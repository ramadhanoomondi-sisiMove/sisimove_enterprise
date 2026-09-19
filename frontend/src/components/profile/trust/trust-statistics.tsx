// -----------------------------------------------------------------------------
// sisiMove — Trust Statistics
// -----------------------------------------------------------------------------
//
// Presentational component for the quantitative Trust/reputation statistics
// displayed on the authenticated traveller profile.
//
// Responsibilities:
// - Display rating summary.
// - Display completion rate.
// - Display cancellation rate.
//
// Non-responsibilities:
// - Fetching Trust data.
// - Loading state management.
// - Trust business rules.
// - Calculating rates.
// - Formatting backend responses.
//
// The parent Trust section owns data loading and passes presentation-ready
// values into this component.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface TrustStatisticsProps {
  readonly ratingAverage: number;
  readonly ratingCount: number;
  readonly completionRate: number;
  readonly cancellationRate: number;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TrustStatistics({
  ratingAverage,
  ratingCount,
  completionRate,
  cancellationRate,
}: TrustStatisticsProps): ReactNode {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* ------------------------------------------------------------------ */}
      {/* Rating                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="rounded-lg border border-border bg-background p-4">
        <div className="text-sm text-muted-foreground">
          Rating
        </div>

        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-2xl font-semibold tracking-tight">
            ★ {ratingAverage.toFixed(1)}
          </span>

          <span className="text-sm text-muted-foreground">
            {ratingCount.toLocaleString()} ratings
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Completion Rate                                                    */}
      {/* ------------------------------------------------------------------ */}

      <div className="rounded-lg border border-border bg-background p-4">
        <div className="text-sm text-muted-foreground">
          Completion rate
        </div>

        <div className="mt-1 text-2xl font-semibold tracking-tight">
          {completionRate.toFixed(1)}%
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Cancellation Rate                                                  */}
      {/* ------------------------------------------------------------------ */}

      <div className="rounded-lg border border-border bg-background p-4">
        <div className="text-sm text-muted-foreground">
          Cancellation rate
        </div>

        <div className="mt-1 text-2xl font-semibold tracking-tight">
          {cancellationRate.toFixed(1)}%
        </div>
      </div>
    </div>
  );
}