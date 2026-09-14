// -----------------------------------------------------------------------------
// sisiMove — Rating Summary
// -----------------------------------------------------------------------------
//
// Reusable presentation component for displaying a traveller's public rating.
//
// This component:
//
// - receives rating values from PublicTravellerTrust;
// - does not fetch Trust data;
// - does not render individual reviews;
// - does not expose private rating records;
// - can be reused across Journey and Demand surfaces.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface RatingSummaryProps {
  /**
   * Average public rating.
   */
  ratingAverage: number;

  /**
   * Number of ratings contributing to the average.
   */
  ratingCount: number;

  /**
   * Whether to display the rating count.
   *
   * Defaults to true.
   */
  showCount?: boolean;

  /**
   * Optional additional class name.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatRating(ratingAverage: number): string {
  if (!Number.isFinite(ratingAverage)) {
    return "0.0";
  }

  return ratingAverage.toFixed(1);
}

function formatRatingCount(ratingCount: number): string {
  if (!Number.isFinite(ratingCount) || ratingCount < 0) {
    return "0";
  }

  return Math.floor(ratingCount).toLocaleString();
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function RatingSummary({
  ratingAverage,
  ratingCount,
  showCount = true,
  className,
}: RatingSummaryProps) {
  const formattedRating = formatRating(ratingAverage);
  const formattedCount = formatRatingCount(ratingCount);

  return (
    <span
      className={[
        "inline-flex items-center gap-1 text-sm text-muted-foreground",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={`${formattedRating} out of 5 stars${
        showCount ? ` from ${formattedCount} ratings` : ""
      }`}
    >
      <span aria-hidden="true">★</span>
      <span className="font-medium text-foreground">{formattedRating}</span>

      {showCount ? (
        <span className="text-muted-foreground">({formattedCount})</span>
      ) : null}
    </span>
  );
}