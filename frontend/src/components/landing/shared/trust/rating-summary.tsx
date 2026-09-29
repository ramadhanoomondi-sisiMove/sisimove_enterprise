// -----------------------------------------------------------------------------
// sisiMove — Rating Summary
// -----------------------------------------------------------------------------
//
// Reusable presentation component for displaying a Traveller's public rating.
//
// This component is intentionally compact and suitable for dense public
// surfaces such as:
//
//     Journey marketplace cards
//     Journey Demand marketplace cards
//     Traveller summaries
//     Public Traveller pages
//
// Visual form:
//
//     ★ 4.9  (128)
//
// The component:
//
// - receives rating values from the public Trust read model;
// - does not fetch Trust data;
// - does not render individual reviews;
// - does not expose private rating records;
// - does not calculate the rating average;
// - does not infer completed journeys;
// - can be reused across independent public presentation surfaces.
//
// -----------------------------------------------------------------------------
// PRESENTATION BOUNDARY
// -----------------------------------------------------------------------------
//
// `ratingAverage` and `ratingCount` are already public read-model values.
//
// This component only:
//
//   1. safely normalizes invalid runtime values;
//   2. formats the values for compact presentation;
//   3. exposes an accessible text alternative.
//
// It does NOT:
//
// - determine whether a Traveller is trusted;
// - determine verification status;
// - calculate the rating average;
// - load reviews;
// - infer completed journeys from rating count.
//
// IMPORTANT:
//
//     ratingCount !== completedJourneyCount
//
// A completed journey/trip count must come from its own public read-model
// property and should be rendered by the appropriate Traveller/Trust
// presentation component.
//
// -----------------------------------------------------------------------------
// MARKETPLACE VISUAL LANGUAGE
// -----------------------------------------------------------------------------
//
// The rating remains intentionally compact:
//
//     ★ 4.9  (128)
//
// The star is a visual rating indicator, not an interactive control.
//
// The star therefore uses:
//
//     --warning
//
// Other established SisiMove tokens:
//
//     --foreground
//     --foreground-muted
//
// No generic/nonexistent tokens are introduced:
//
//     --primary
//     --muted
//     --muted-foreground
//     --ring
//
// -----------------------------------------------------------------------------
// RESPONSIVE BEHAVIOR
// -----------------------------------------------------------------------------
//
// Marketplace cards remain horizontal on small screens.
//
// RatingSummary therefore:
//
// - has `min-w-0`;
// - does not introduce a fixed width;
// - keeps the star from shrinking;
// - allows the numeric content to remain compact;
// - does not create horizontal scrolling.
// -----------------------------------------------------------------------------

// =============================================================================
// Props
// =============================================================================

export interface RatingSummaryProps {
  /**
   * Average public rating.
   *
   * The expected domain range is normally 0–5.
   *
   * Domain validation belongs to the Trust read/domain boundary. This
   * presentation component only protects rendering against invalid runtime
   * numeric values.
   */
  readonly ratingAverage: number;

  /**
   * Number of ratings contributing to the public average.
   */
  readonly ratingCount: number;

  /**
   * Whether to display the number of ratings.
   *
   * Defaults to true.
   *
   * When false:
   *
   *     ★ 4.9
   */
  readonly showCount?: boolean;

  /**
   * Optional additional class name.
   */
  readonly className?: string;
}


// =============================================================================
// Helpers
// =============================================================================

/**
 * Format the public average rating for compact presentation.
 *
 * Ratings are intentionally displayed to one decimal place so the visual
 * representation remains consistent across Journey, Demand, and Traveller
 * surfaces.
 *
 * This does not clamp the rating to 0–5. Domain validation belongs upstream.
 */
function formatRating(
  ratingAverage: number,
): string {
  if (!Number.isFinite(ratingAverage)) {
    return '0.0';
  }

  return ratingAverage.toFixed(1);
}


/**
 * Format the public rating count.
 *
 * Rating counts are integer quantities. Fractional runtime values are reduced
 * to their integer component rather than displayed as misleading decimal
 * counts.
 */
function formatRatingCount(
  ratingCount: number,
): string {
  if (
    !Number.isFinite(ratingCount) ||
    ratingCount < 0
  ) {
    return '0';
  }

  return Math.floor(ratingCount)
    .toLocaleString('en-KE');
}


// =============================================================================
// Component
// =============================================================================

/**
 * Render a compact public rating summary.
 *
 * This component is presentation-only.
 *
 * TrustSummary remains responsible for composing this signal with other
 * public trust information such as verification and completed journeys.
 */
export function RatingSummary({
  ratingAverage,
  ratingCount,
  showCount = true,
  className,
}: RatingSummaryProps) {
  const formattedRating = formatRating(
    ratingAverage,
  );

  const formattedCount = formatRatingCount(
    ratingCount,
  );


  // ---------------------------------------------------------------------------
  // Accessible description
  // ---------------------------------------------------------------------------
  //
  // The visible star is decorative because the accessible meaning is supplied
  // by the parent element's aria-label.
  // ---------------------------------------------------------------------------

  const accessibleLabel = [
    `${formattedRating} out of 5 stars`,
    showCount
      ? `${formattedCount} ratings`
      : null,
  ]
    .filter(Boolean)
    .join(', ');


  return (
    <span
      aria-label={accessibleLabel}
      className={[
        'inline-flex',
        'min-w-0',
        'items-center',
        'gap-1',

        'text-sm',
        'leading-5',

        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Rating star                                                         */}
      {/* ------------------------------------------------------------------- */}
      <span
        aria-hidden="true"
        className={[
          'shrink-0',
          'text-[var(--warning)]',
        ].join(' ')}
      >
        ★
      </span>


      {/* ------------------------------------------------------------------- */}
      {/* Average                                                             */}
      {/* ------------------------------------------------------------------- */}
      <span
        className={[
          'shrink-0',
          'font-semibold',
          'text-[var(--foreground)]',
        ].join(' ')}
      >
        {formattedRating}
      </span>


      {/* ------------------------------------------------------------------- */}
      {/* Rating count                                                        */}
      {/* ------------------------------------------------------------------- */}
      {showCount ? (
        <span
          className={[
            'min-w-0',
            'truncate',
            'text-[var(--foreground-muted)]',
          ].join(' ')}
        >
          ({formattedCount})
        </span>
      ) : null}
    </span>
  );
}