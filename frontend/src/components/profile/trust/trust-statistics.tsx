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
// Visual language:
// - Compact metric strip.
// - Uses sisiMove design tokens rather than generic utility colors.
// - Rating receives a subtle semantic emphasis.
// - Metrics remain visually consistent and easy to scan on mobile and desktop.
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
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
      {/* -------------------------------------------------------------------
          Rating
          ------------------------------------------------------------------- */}

      <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--background-subtle)] px-4 py-3.5">
        <p className="text-xs font-medium text-[var(--foreground-muted)]">
          Rating
        </p>

        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
            <span
              aria-hidden="true"
              className="mr-1 text-[var(--warning)]"
            >
              ★
            </span>
            {ratingAverage.toFixed(1)}
          </span>

          <span className="text-xs text-[var(--foreground-muted)]">
            {ratingCount.toLocaleString()} ratings
          </span>
        </div>
      </div>

      {/* -------------------------------------------------------------------
          Completion Rate
          ------------------------------------------------------------------- */}

      <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--background-subtle)] px-4 py-3.5">
        <p className="text-xs font-medium text-[var(--foreground-muted)]">
          Completion rate
        </p>

        <div className="mt-1.5 flex items-baseline gap-1">
          <span className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
            {completionRate.toFixed(1)}
          </span>

          <span className="text-sm font-medium text-[var(--foreground-muted)]">
            %
          </span>
        </div>
      </div>

      {/* -------------------------------------------------------------------
          Cancellation Rate
          ------------------------------------------------------------------- */}

      <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--background-subtle)] px-4 py-3.5">
        <p className="text-xs font-medium text-[var(--foreground-muted)]">
          Cancellation rate
        </p>

        <div className="mt-1.5 flex items-baseline gap-1">
          <span className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
            {cancellationRate.toFixed(1)}
          </span>

          <span className="text-sm font-medium text-[var(--foreground-muted)]">
            %
          </span>
        </div>
      </div>
    </div>
  );
}