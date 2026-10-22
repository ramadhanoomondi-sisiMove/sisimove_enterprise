/**
 * sisiMove — Trust Profile Ratings Panel
 *
 * Displays ratings associated with an individual Trust profile.
 *
 * Responsibilities:
 * - Display rating scores, roles, statuses, and recorded dates.
 * - Show available reviewer, journey, and booking references.
 * - Provide a consistent empty state when no ratings exist.
 * - Keep moderation operations in the dedicated moderation workflow.
 *
 * Non-responsibilities:
 * - Fetching ratings.
 * - Inferring rating or moderation status.
 * - Mutating, hiding, or removing ratings.
 */

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { TrustRatingModel } from "@/features/admin/trust/models/trust-profile.model";
import { TrustEmptyState } from "../shared/TrustEmptyState";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface TrustProfileRatingsPanelProps {
  /**
   * Ratings associated with the selected Trust profile.
   */
  ratings: TrustRatingModel[];

  /**
   * Optional panel heading.
   */
  title?: string;

  /**
   * Optional supporting description.
   */
  description?: string;

  /**
   * Optional additional classes.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Formatting
// -----------------------------------------------------------------------------

function formatLabel(value: string | null | undefined): string {
  if (!value?.trim()) {
    return "Not specified";
  }

  return value
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatScore(score: number): string {
  if (!Number.isFinite(score)) {
    return "—";
  }

  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
  }).format(score);
}

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
// Rating Card
// -----------------------------------------------------------------------------

function TrustRatingItem({ rating }: { rating: TrustRatingModel }) {
  return (
    <Card variant="default" padding="md" className="min-w-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="break-words text-sm font-semibold text-[var(--foreground)]">
            Rating
          </h3>

          <p className="mt-1 text-xs text-[var(--foreground-muted)]">
            Recorded{" "}
            <time dateTime={rating.createdAt}>
              {formatDate(rating.createdAt)}
            </time>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className="inline-flex min-h-9 items-center rounded-[var(--radius-md)] bg-[var(--brand-soft)] px-3 text-sm font-semibold text-[var(--brand)]"
            aria-label={`Rating score ${formatScore(rating.score)}`}
          >
            {formatScore(rating.score)}
          </span>

          <Badge variant="outline" size="sm">
            {formatLabel(rating.status)}
          </Badge>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-3 border-t border-[var(--border-subtle)] pt-4 sm:grid-cols-2">
        <div className="min-w-0">
          <dt className="text-xs text-[var(--foreground-muted)]">
            Reviewer
          </dt>

          <dd
            className="mt-1 break-all text-sm text-[var(--foreground)]"
            title={rating.reviewerPublicId}
          >
            {formatReference(rating.reviewerPublicId)}
          </dd>
        </div>

        <div className="min-w-0">
          <dt className="text-xs text-[var(--foreground-muted)]">
            Reviewee role
          </dt>

          <dd className="mt-1 text-sm text-[var(--foreground)]">
            {formatLabel(rating.role)}
          </dd>
        </div>

        {rating.journeyPublicId && (
          <div className="min-w-0">
            <dt className="text-xs text-[var(--foreground-muted)]">
              Journey reference
            </dt>

            <dd
              className="mt-1 break-all text-sm text-[var(--foreground)]"
              title={rating.journeyPublicId}
            >
              {formatReference(rating.journeyPublicId)}
            </dd>
          </div>
        )}

        {rating.bookingPublicId && (
          <div className="min-w-0">
            <dt className="text-xs text-[var(--foreground-muted)]">
              Booking reference
            </dt>

            <dd
              className="mt-1 break-all text-sm text-[var(--foreground)]"
              title={rating.bookingPublicId}
            >
              {formatReference(rating.bookingPublicId)}
            </dd>
          </div>
        )}
      </dl>
    </Card>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TrustProfileRatingsPanel({
  ratings,
  title = "Ratings",
  description = "Ratings recorded for this Trust profile.",
  className,
}: TrustProfileRatingsPanelProps) {
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
            {ratings.length}
          </Badge>
        </div>

        {description && (
          <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
            {description}
          </p>
        )}
      </header>

      {ratings.length === 0 ? (
        <TrustEmptyState variant="ratings" />
      ) : (
        <div className="space-y-3">
          {ratings.map((rating) => (
            <TrustRatingItem key={rating.publicId} rating={rating} />
          ))}
        </div>
      )}
    </section>
  );
}

export default TrustProfileRatingsPanel;
