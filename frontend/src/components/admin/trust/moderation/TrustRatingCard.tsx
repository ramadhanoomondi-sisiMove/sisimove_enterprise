
"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TrustRatingApiResponse } from '@/features/admin/trust/types/trust.types';

// -----------------------------------------------------------------------------
// sisiMove — Trust Rating Card
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display a rating and its available references.
// - Show the rating status and score.
// - Optionally expose moderation action callbacks.
//
// Non-responsibilities:
// - Fetching ratings.
// - Defining rating status transitions.
// - Performing moderation mutations or authorization.
// -----------------------------------------------------------------------------

export interface TrustRatingCardAction {
  label: string;
  onClick: (rating: TrustRatingApiResponse) => void;
  variant?: "default" | "danger" | "outline";
  disabled?: boolean;
}

export interface TrustRatingCardProps {
  rating: TrustRatingApiResponse;
  onSelect?: (rating: TrustRatingApiResponse) => void;
  actions?: TrustRatingCardAction[];
  disabled?: boolean;
  className?: string;
}

function getStatusVariant(
  status: string,
): "default" | "brand" | "success" | "warning" | "danger" | "outline" {
  switch (status.toLowerCase()) {
    case "active":
    case "approved":
    case "visible":
      return "success";
    case "pending":
    case "under_review":
      return "warning";
    case "hidden":
    case "removed":
    case "rejected":
    case "flagged":
      return "danger";
    default:
      return "outline";
  }
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function Reference({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  if (!value) return null;

  return (
    <div className="min-w-0 space-y-1">
      <p className="text-xs text-[var(--foreground-muted)]">{label}</p>
      <p className="break-all font-mono text-xs text-[var(--foreground-secondary)]">
        {value}
      </p>
    </div>
  );
}

export function TrustRatingCard({
  rating,
  onSelect,
  actions = [],
  disabled = false,
  className,
}: TrustRatingCardProps) {
  const status = rating.status || "unknown";

  return (
    <Card
      variant="outlined"
      padding="md"
      className={["space-y-4", className].filter(Boolean).join(" ")}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-semibold text-[var(--foreground)]">
            Rating
          </p>
          <p className="break-all font-mono text-xs text-[var(--foreground-muted)]">
            {rating.publicId}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={getStatusVariant(status)} size="sm">
            {status.replaceAll("_", " ")}
          </Badge>

          <span
            className="inline-flex min-h-8 items-center rounded-lg bg-[var(--background-muted)] px-3 text-sm font-semibold tabular-nums text-[var(--foreground)]"
            aria-label={`Rating score ${rating.score}`}
          >
            {rating.score} / 5
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Reference label="Reviewer" value={rating.reviewerPublicId} />
        <Reference label="Reviewee" value={rating.revieweePublicId} />
        <Reference label="Journey" value={rating.journeyPublicId} />
        <Reference label="Booking" value={rating.bookingPublicId} />
        <Reference label="Review reference" value={rating.reviewPublicId} />
        <div className="space-y-1">
          <p className="text-xs text-[var(--foreground-muted)]">Role</p>
          <p className="text-sm text-[var(--foreground)]">
            {rating.role || "—"}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-[var(--border-subtle)] pt-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-[var(--foreground-muted)]">
          Submitted {formatDate(rating.createdAt)}
        </p>

        <div className="flex flex-wrap gap-2">
          {onSelect && (
            <button
              type="button"
              disabled={disabled}
              onClick={() => onSelect(rating)}
              className="min-h-9 rounded-md border border-[var(--border)] px-3 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--background-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              View details
            </button>
          )}

          {actions.map((action) => {
            const isDanger = action.variant === "danger";
            const isDefault = action.variant === "default";

            return (
              <button
                key={action.label}
                type="button"
                disabled={disabled || action.disabled}
                onClick={() => action.onClick(rating)}
                className={[
                  "min-h-9 rounded-md border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-50",
                  isDanger
                    ? "border-[var(--danger)] text-[var(--danger)] hover:bg-[var(--danger-soft)]"
                    : isDefault
                      ? "border-[var(--brand)] bg-[var(--brand)] text-[var(--brand-foreground)] hover:bg-[var(--brand-hover)]"
                      : "border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--background-subtle)]",
                ].join(" ")}
              >
                {action.label}
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

export default TrustRatingCard;
