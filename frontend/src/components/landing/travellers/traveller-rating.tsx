// -----------------------------------------------------------------------------
// sisiMove — Traveller Rating
// -----------------------------------------------------------------------------
//
// Presentation component for the public traveller rating signal.
//
// Responsibilities:
// - Render a server-authoritative public rating.
// - Render an optional rating count.
// - Support compact and standard presentations.
// - Render partial stars for fractional scores.
//
// This component does not:
// - calculate ratings;
// - determine rating eligibility;
// - inspect individual reviews;
// - infer trust;
// - access APIs;
// - perform authentication or authorization.
//
// A null score means that the traveller has no public rating yet.
// A score of zero is a valid numeric value, although normal SisiMove ratings
// may use a different domain-defined minimum.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import { cn } from '../../../foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface TravellerRatingProps {
  /**
   * Public average rating.
   *
   * Null/undefined means that no public rating exists yet.
   */
  readonly score?: number | null;

  /**
   * Number of ratings contributing to the score.
   */
  readonly count?: number;

  /**
   * Maximum number of visible stars.
   */
  readonly max?: number;

  /**
   * Optional custom label displayed before the stars.
   */
  readonly label?: ReactNode;

  /**
   * Whether to display the numeric score.
   */
  readonly showScore?: boolean;

  /**
   * Whether to display the rating count.
   */
  readonly showCount?: boolean;

  /**
   * Presentation size.
   */
  readonly size?: 'sm' | 'md';

  /**
   * Optional additional class name.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const DEFAULT_MAX_STARS = 5;

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function normalizeMax(
  value: number | undefined,
): number {
  if (
    value === undefined ||
    !Number.isFinite(value) ||
    value <= 0
  ) {
    return DEFAULT_MAX_STARS;
  }

  return Math.max(
    1,
    Math.floor(value),
  );
}

function normalizeScore(
  score: number | null | undefined,
  max: number,
): number | null {
  if (
    score === null ||
    score === undefined ||
    !Number.isFinite(score)
  ) {
    return null;
  }

  return Math.min(
    Math.max(score, 0),
    max,
  );
}

function normalizeCount(
  count: number | undefined,
): number {
  if (
    count === undefined ||
    !Number.isFinite(count) ||
    count <= 0
  ) {
    return 0;
  }

  return Math.floor(count);
}

function formatScore(
  score: number,
): string {
  return score.toFixed(1);
}

// -----------------------------------------------------------------------------
// Star Icon
// -----------------------------------------------------------------------------

function StarIcon({
  className,
}: {
  readonly className?: string;
}) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={cn(
        'h-full',
        'w-full',
        className,
      )}
    >
      <path d="m10 1.5 2.63 5.33 5.87.85-4.25 4.14 1 5.85L10 14.91l-5.25 2.76 1-5.85L1.5 7.68l5.87-.85L10 1.5Z" />
    </svg>
  );
}

// -----------------------------------------------------------------------------
// Star
// -----------------------------------------------------------------------------

function RatingStar({
  index,
  score,
  hasRating,
  max,
  size,
}: {
  readonly index: number;
  readonly score: number | null;
  readonly hasRating: boolean;
  readonly max: number;
  readonly size: 'sm' | 'md';
}) {
  const starValue = index + 1;

  const isFilled =
    hasRating &&
    score !== null &&
    score >= starValue;

  const isPartial =
    hasRating &&
    score !== null &&
    score > index &&
    score < starValue;

  const partialPercentage =
    isPartial && score !== null
      ? `${(
          (score - index) *
          100
        ).toFixed(2)}%`
      : '0%';

  const starSize =
    size === 'sm'
      ? 'h-3.5 w-3.5'
      : 'h-4 w-4';

  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative',
        'inline-flex',
        'shrink-0',
        starSize,
        'text-[var(--border-strong)]',
      )}
    >
      <StarIcon />

      {isPartial && (
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none',
            'absolute',
            'inset-y-0',
            'left-0',
            'overflow-hidden',
          )}
          style={{
            width: partialPercentage,
          }}
        >
          <StarIcon
            className="text-[var(--brand)]"
          />
        </span>
      )}

      {isFilled && (
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none',
            'absolute',
            'inset-0',
          )}
        >
          <StarIcon
            className="text-[var(--brand)]"
          />
        </span>
      )}

      <span className="sr-only">
        {starValue} of {max}
      </span>
    </span>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TravellerRating({
  score,
  count = 0,
  max = DEFAULT_MAX_STARS,
  label,
  showScore = true,
  showCount = true,
  size = 'sm',
  className,
}: TravellerRatingProps) {
  const normalizedMax =
    normalizeMax(max);

  const normalizedScore =
    normalizeScore(
      score,
      normalizedMax,
    );

  const normalizedCount =
    normalizeCount(count);

  const hasRating =
    normalizedScore !== null;

  const textSize =
    size === 'sm'
      ? 'text-xs'
      : 'text-sm';

  const accessibilityLabel =
    hasRating
      ? [
          `${formatScore(normalizedScore)} out of ${normalizedMax}`,
          showCount && normalizedCount > 0
            ? `${normalizedCount} ${
                normalizedCount === 1
                  ? 'rating'
                  : 'ratings'
              }`
            : null,
        ]
          .filter(Boolean)
          .join(', ')
      : 'No ratings yet';

  return (
    <div
      className={cn(
        'inline-flex',
        'min-w-0',
        'items-center',
        'gap-1.5',
        className,
      )}
      aria-label={accessibilityLabel}
    >
      {label && (
        <span
          className={cn(
            'min-w-0',
            'truncate',
            'text-[var(--foreground-muted)]',
            textSize,
          )}
        >
          {label}
        </span>
      )}

      {hasRating ? (
        <>
          <span
            aria-hidden="true"
            className="inline-flex shrink-0 items-center gap-0.5"
          >
            {Array.from(
              {
                length: normalizedMax,
              },
              (_, index) => (
                <RatingStar
                  key={index}
                  index={index}
                  score={normalizedScore}
                  hasRating={hasRating}
                  max={normalizedMax}
                  size={size}
                />
              ),
            )}
          </span>

          {showScore && (
            <span
              className={cn(
                'font-semibold',
                'tabular-nums',
                'text-[var(--foreground)]',
                textSize,
              )}
            >
              {formatScore(
                normalizedScore,
              )}
            </span>
          )}

          {showCount &&
            normalizedCount > 0 && (
              <span
                className={cn(
                  'whitespace-nowrap',
                  'text-[var(--foreground-muted)]',
                  textSize,
                )}
              >
                ({normalizedCount})
              </span>
            )}
        </>
      ) : (
        <span
          className={cn(
            'whitespace-nowrap',
            'text-[var(--foreground-muted)]',
            textSize,
          )}
        >
          No ratings yet
        </span>
      )}
    </div>
  );
}