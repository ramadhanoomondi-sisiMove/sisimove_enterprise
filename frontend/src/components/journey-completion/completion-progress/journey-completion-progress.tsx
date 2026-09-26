// -----------------------------------------------------------------------------
// sisiMove — Journey Completion Progress
// -----------------------------------------------------------------------------
//
// Presentation component for displaying Journey Completion confirmation
// progress.
//
// Responsibilities:
// - present backend-maintained confirmation counts;
// - provide a compact visual progress indicator;
// - communicate progress accessibly.
//
// Non-responsibilities:
// - calculating lifecycle state;
// - deciding whether completion can transition;
// - determining authorization;
// - submitting confirmations;
// - fetching completion data.
//
// The backend remains authoritative for confirmation counts and lifecycle
// state.
// -----------------------------------------------------------------------------

import { Card } from '@/components/ui';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyCompletionProgressProps {
  /**
   * Number of confirmations currently contributing to completion.
   *
   * This value comes directly from the backend aggregate.
   */
  confirmedCount: number;

  /**
   * Number of confirmations required by the completion aggregate.
   *
   * This value comes directly from the backend aggregate.
   */
  requiredConfirmations: number;

  /**
   * Optional compact presentation mode.
   *
   * Compact mode removes the surrounding Card surface so the component can
   * be embedded inside another completion surface.
   */
  compact?: boolean;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

/**
 * Calculate the visual progress percentage.
 *
 * This is strictly a visual calculation. It does not establish a domain
 * lifecycle state or replace the backend's authoritative status.
 */
function getProgressPercentage(
  confirmedCount: number,
  requiredConfirmations: number,
): number {
  if (requiredConfirmations <= 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(
      0,
      (confirmedCount / requiredConfirmations) * 100,
    ),
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

/**
 * Render Journey Completion confirmation progress.
 */
export function JourneyCompletionProgress({
  confirmedCount,
  requiredConfirmations,
  compact = false,
}: JourneyCompletionProgressProps) {
  const percentage = getProgressPercentage(
    confirmedCount,
    requiredConfirmations,
  );

  const content = (
    <div className="space-y-3">
      {/* ------------------------------------------------------------------- */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------- */}

      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[var(--foreground)]">
            Confirmation progress
          </p>

          <p className="mt-0.5 text-sm text-[var(--foreground-muted)]">
            {confirmedCount} of {requiredConfirmations} confirmations
          </p>
        </div>

        <span className="shrink-0 text-sm font-medium text-[var(--foreground-secondary)]">
          {Math.round(percentage)}%
        </span>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Progress                                                            */}
      {/* ------------------------------------------------------------------- */}

      <div
        className="h-2 w-full overflow-hidden rounded-[var(--radius-full)] bg-[var(--background-muted)]"
        role="progressbar"
        aria-label="Journey completion confirmation progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percentage)}
      >
        <div
          className="h-full rounded-[var(--radius-full)] bg-[var(--brand)] transition-[width] duration-300"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );

  if (compact) {
    return content;
  }

  return (
    <Card padding="md">
      {content}
    </Card>
  );
}