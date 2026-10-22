/**
 * sisiMove — Trust Profile Reviews Panel
 *
 * Displays review content associated with an individual Trust profile.
 *
 * Responsibilities:
 * - Display review content and recorded timestamps.
 * - Show the associated rating reference when available.
 * - Provide a consistent empty state when no reviews exist.
 * - Reuse the shared design-system Card and Badge components.
 *
 * Non-responsibilities:
 * - Fetching reviews.
 * - Inferring moderation status.
 * - Mutating, hiding, or removing reviews.
 */

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { TrustReviewModel } from "@/features/admin/trust/models/trust-profile.model";
import { TrustEmptyState } from "../shared/TrustEmptyState";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface TrustProfileReviewsPanelProps {
  /**
   * Reviews associated with the selected Trust profile.
   */
  reviews: TrustReviewModel[];

  /**
   * Optional panel heading.
   */
  title?: string;

  /**
   * Optional supporting description.
   */
  description?: string;

  /**
   * Additional classes for the panel root.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Formatting
// -----------------------------------------------------------------------------

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value || "—";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatReference(value: string): string {
  return value.length > 24
    ? `${value.slice(0, 12)}…${value.slice(-8)}`
    : value;
}

// -----------------------------------------------------------------------------
// Review Card
// -----------------------------------------------------------------------------

function TrustReviewItem({ review }: { review: TrustReviewModel }) {
  return (
    <Card variant="default" padding="md" className="min-w-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">
            Review
          </h3>

          <p className="mt-1 text-xs text-[var(--foreground-muted)]">
            Recorded{" "}
            <time dateTime={review.createdAt}>
              {formatDate(review.createdAt)}
            </time>
          </p>
        </div>

        <Badge variant="outline" size="sm">
          Review
        </Badge>
      </div>

      <div className="mt-4">
        <p className="whitespace-pre-wrap break-words text-sm leading-6 text-[var(--foreground-secondary)]">
          {review.content}
        </p>
      </div>

      <dl className="mt-4 border-t border-[var(--border-subtle)] pt-3">
        <div className="grid gap-1 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-3">
          <dt className="text-xs text-[var(--foreground-muted)]">
            Review reference
          </dt>

          <dd
            className="break-all text-sm text-[var(--foreground)]"
            title={review.publicId}
          >
            {formatReference(review.publicId)}
          </dd>
        </div>

        <div className="mt-3 grid gap-1 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-3">
          <dt className="text-xs text-[var(--foreground-muted)]">
            Associated rating
          </dt>

          <dd
            className="break-all text-sm text-[var(--foreground)]"
            title={review.ratingId}
          >
            {formatReference(review.ratingId)}
          </dd>
        </div>
      </dl>
    </Card>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TrustProfileReviewsPanel({
  reviews,
  title = "Reviews",
  description = "Written reviews associated with this Trust profile.",
  className,
}: TrustProfileReviewsPanelProps) {
  return (
    <section
      aria-label={title}
      className={["w-full min-w-0", className ?? ""].join(" ")}
    >
      <header className="mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            {title}
          </h2>

          <Badge variant="outline" size="sm">
            {reviews.length}
          </Badge>
        </div>

        {description && (
          <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
            {description}
          </p>
        )}
      </header>

      {reviews.length === 0 ? (
        <TrustEmptyState variant="reviews" />
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <TrustReviewItem key={review.publicId} review={review} />
          ))}
        </div>
      )}
    </section>
  );
}

export default TrustProfileReviewsPanel;
