// src/components/landing/trust/rating-summary.tsx

// -----------------------------------------------------------------------------
// sisiMove — Landing Rating Summary
// -----------------------------------------------------------------------------
//
// Public landing-page Trust signal.
//
// Responsibilities:
// - Explain ratings as a public Trust signal.
// - Present an optional aggregated rating.
// - Present the number of ratings when supplied.
// - Explain that ratings come from completed journeys.
//
// This component does not:
// - calculate ratings;
// - determine rating eligibility;
// - access individual reviews;
// - access reviewer identities;
// - access Booking data;
// - access Financial data;
// - access private Trust information;
// - fetch Trust data.
//
// This is presentation-only.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import type {
  HTMLAttributes,
  ReactNode,
} from 'react';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { cn } from '../../../foundation/utils/cn';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface RatingSummaryProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'children' | 'title'
  > {
  /**
   * Aggregated public rating.
   */
  rating?: number | null;

  /**
   * Number of ratings contributing to the aggregated rating.
   */
  ratingCount?: number | null;

  /**
   * Maximum value of the public rating scale.
   *
   * This is presentation metadata only. The component does not alter
   * the supplied rating.
   */
  maximumRating?: number;

  /**
   * Public Trust signal label.
   */
  label?: ReactNode;

  /**
   * Optional supporting description.
   */
  description?: ReactNode;

  /**
   * Optional replacement leading visual.
   */
  leadingContent?: ReactNode;

  /**
   * Optional trailing content.
   */
  trailingContent?: ReactNode;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function normalizeRating(
  rating: number | null | undefined,
): number | null {
  if (
    typeof rating !== 'number' ||
    !Number.isFinite(rating) ||
    rating < 0
  ) {
    return null;
  }

  return rating;
}

function normalizeCount(
  count: number | null | undefined,
): number {
  if (
    typeof count !== 'number' ||
    !Number.isFinite(count) ||
    count < 0
  ) {
    return 0;
  }

  return Math.floor(count);
}

function normalizeMaximumRating(
  maximumRating: number | undefined,
): number {
  if (
    typeof maximumRating !== 'number' ||
    !Number.isFinite(maximumRating) ||
    maximumRating <= 0
  ) {
    return 5;
  }

  return maximumRating;
}

// -----------------------------------------------------------------------------
// Default Icon
// -----------------------------------------------------------------------------

function DefaultRatingIcon() {
  return (
    <span
      aria-hidden="true"
      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-500"
    >
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-5"
      >
        <path d="m10 2.75 2.17 4.4 4.86.71-3.52 3.43.83 4.84L10 13.84l-4.34 2.29.83-4.84-3.52-3.43 4.86-.71L10 2.75Z" />
      </svg>
    </span>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function RatingSummary({
  rating,
  ratingCount,
  maximumRating = 5,
  label = 'Ratings from completed journeys',
  description,
  leadingContent,
  trailingContent,
  className,
  ...props
}: RatingSummaryProps) {
  const normalizedRating = normalizeRating(rating);
  const normalizedCount = normalizeCount(ratingCount);
  const normalizedMaximumRating =
    normalizeMaximumRating(maximumRating);

  const hasRating = normalizedRating !== null;
  const hasRatingCount = normalizedCount > 0;

  const resolvedDescription =
    description ??
    (hasRating
      ? hasRatingCount
        ? `${normalizedRating.toFixed(1)} out of ${normalizedMaximumRating} from ${normalizedCount.toLocaleString()} ${
            normalizedCount === 1
              ? 'rating'
              : 'ratings'
          }.`
        : `${normalizedRating.toFixed(1)} out of ${normalizedMaximumRating}.`
      : 'Ratings come from completed journeys.');

  return (
    <div
      className={cn(
        'flex items-start gap-3',
        className,
      )}
      {...props}
    >
      {leadingContent ?? <DefaultRatingIcon />}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="text-sm font-semibold text-neutral-950">
            {label}
          </p>

          {hasRating ? (
            <span
              className="inline-flex items-center gap-1 text-sm font-semibold text-neutral-900"
              aria-label={`${normalizedRating.toFixed(1)} out of ${normalizedMaximumRating}`}
            >
              <span aria-hidden="true">
                ★
              </span>

              <span>
                {normalizedRating.toFixed(1)}
              </span>
            </span>
          ) : null}
        </div>

        {resolvedDescription ? (
          <p className="mt-1 text-sm leading-5 text-neutral-600">
            {resolvedDescription}
          </p>
        ) : null}
      </div>

      {trailingContent ? (
        <div className="shrink-0">
          {trailingContent}
        </div>
      ) : null}
    </div>
  );
}